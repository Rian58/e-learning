interface DataPoint {
  loginFrequency: number;
  studyTime: number;
  completionRate: number;
}

interface ClusterResult {
  centroid: DataPoint;
  label: string;
  members: { userId: string; features: DataPoint }[];
}

function normalize(data: DataPoint[]): { normalized: DataPoint[]; min: DataPoint; max: DataPoint } {
  const min: DataPoint = {
    loginFrequency: Math.min(...data.map(d => d.loginFrequency)),
    studyTime: Math.min(...data.map(d => d.studyTime)),
    completionRate: Math.min(...data.map(d => d.completionRate)),
  };
  const max: DataPoint = {
    loginFrequency: Math.max(...data.map(d => d.loginFrequency)),
    studyTime: Math.max(...data.map(d => d.studyTime)),
    completionRate: Math.max(...data.map(d => d.completionRate)),
  };

  const range = (field: keyof DataPoint) => (max[field] - min[field]) || 1;

  const normalized = data.map(d => ({
    loginFrequency: (d.loginFrequency - min.loginFrequency) / range("loginFrequency"),
    studyTime: (d.studyTime - min.studyTime) / range("studyTime"),
    completionRate: (d.completionRate - min.completionRate) / range("completionRate"),
  }));

  return { normalized, min, max };
}

function euclideanDistance(a: DataPoint, b: DataPoint): number {
  return Math.sqrt(
    Math.pow(a.loginFrequency - b.loginFrequency, 2) +
    Math.pow(a.studyTime - b.studyTime, 2) +
    Math.pow(a.completionRate - b.completionRate, 2)
  );
}

function initializeCentroids(data: DataPoint[], k: number): DataPoint[] {
  const centroids: DataPoint[] = [];
  const used = new Set<number>();

  for (let i = 0; i < k; i++) {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * data.length);
    } while (used.has(idx));
    used.add(idx);
    centroids.push({ ...data[idx] });
  }

  return centroids;
}

function assignClusters(data: DataPoint[], centroids: DataPoint[]): number[] {
  return data.map(point => {
    let minDist = Infinity;
    let cluster = 0;
    centroids.forEach((c, i) => {
      const dist = euclideanDistance(point, c);
      if (dist < minDist) {
        minDist = dist;
        cluster = i;
      }
    });
    return cluster;
  });
}

function updateCentroids(data: DataPoint[], assignments: number[], k: number): DataPoint[] {
  const newCentroids: DataPoint[] = [];

  for (let i = 0; i < k; i++) {
    const members = data.filter((_, idx) => assignments[idx] === i);
    if (members.length === 0) {
      newCentroids.push(data[Math.floor(Math.random() * data.length)]);
      continue;
    }

    newCentroids.push({
      loginFrequency: members.reduce((s, m) => s + m.loginFrequency, 0) / members.length,
      studyTime: members.reduce((s, m) => s + m.studyTime, 0) / members.length,
      completionRate: members.reduce((s, m) => s + m.completionRate, 0) / members.length,
    });
  }

  return newCentroids;
}

function centroidScore(c: DataPoint): number {
  return c.loginFrequency + c.studyTime + c.completionRate;
}

export function kMeansClustering(
  userFeatures: { userId: string; features: DataPoint }[],
  k: number = 3,
  maxIterations: number = 100
): ClusterResult[] {
  if (userFeatures.length < k) {
    throw new Error(`Minimal ${k} data mahasiswa diperlukan untuk clustering.`);
  }

  const rawData = userFeatures.map(u => u.features);
  const { normalized } = normalize(rawData);

  let centroids = initializeCentroids(normalized, k);
  let assignments = assignClusters(normalized, centroids);

  for (let iter = 0; iter < maxIterations; iter++) {
    const newCentroids = updateCentroids(normalized, assignments, k);
    const newAssignments = assignClusters(normalized, newCentroids);

    const converged = newAssignments.every((a, i) => a === assignments[i]);
    centroids = newCentroids;
    assignments = newAssignments;

    if (converged) break;
  }

  const scored = centroids.map((c, i) => ({ index: i, score: centroidScore(c) }));
  scored.sort((a, b) => b.score - a.score);

  const labelMap: Record<number, string> = {};
  labelMap[scored[0].index] = "AKTIF";

  if (k >= 3) {
    labelMap[scored[scored.length - 1].index] = "PASIF";
    for (let i = 1; i < scored.length - 1; i++) {
      labelMap[scored[i].index] = "PROCRASTINATOR";
    }
  } else {
    labelMap[scored[1].index] = "PASIF";
  }

  const results: ClusterResult[] = centroids.map((centroid, i) => ({
    centroid: rawData.reduce(
      (acc, _, idx) => {
        if (assignments[idx] !== i) return acc;
        const members = rawData.filter((__, jdx) => assignments[jdx] === i);
        return {
          loginFrequency: members.reduce((s, m) => s + m.loginFrequency, 0) / members.length,
          studyTime: members.reduce((s, m) => s + m.studyTime, 0) / members.length,
          completionRate: members.reduce((s, m) => s + m.completionRate, 0) / members.length,
        };
      },
      { loginFrequency: 0, studyTime: 0, completionRate: 0 }
    ),
    label: labelMap[i] || "PASIF",
    members: userFeatures.filter((_, idx) => assignments[idx] === i),
  }));

  return results;
}
