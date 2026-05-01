"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMaterial, updateMaterial, deleteMaterial, addQuiz, updateQuiz, deleteQuiz, addAssignment, updateAssignment, deleteAssignment } from "@/actions/lecturer-actions";
import { Plus, FileText, HelpCircle, FileEdit, Loader2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CourseContentManagerProps {
  courseId: string;
  materials: any[];
  quizzes: any[];
  assignments: any[];
}

export function CourseContentManager({ courseId, materials, quizzes, assignments }: CourseContentManagerProps) {
  const [activeForm, setActiveForm] = useState<"material" | "quiz" | "assignment" | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const router = useRouter();

  const handleEdit = (type: "material" | "quiz" | "assignment", item: any) => {
    setEditItem(item);
    setActiveForm(type);
  };

  const handleAddNew = (type: "material" | "quiz" | "assignment") => {
    setEditItem(null);
    setActiveForm(activeForm === type ? null : type);
  };

  const wrapDelete = async (action: Function, id: string) => {
    if (!confirm("Yakin ingin menghapus item ini? Data terkait juga akan hilang.")) return;
    try {
      const res = await action(id, courseId);
      if (res.success) { toast.success("Berhasil dihapus."); router.refresh(); }
      else { toast.error(res.error || "Gagal menghapus."); }
    } catch { toast.error("Terjadi kesalahan."); }
  };

  return (
    <div className="space-y-6">
      {/* Existing Materials */}
      <Card className="neo-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Materi ({materials.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="neo-button font-bold gap-1"
            onClick={() => handleAddNew("material")}
          >
            {activeForm === "material" && !editItem ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            Tambah Materi
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {materials.map((m, idx) => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border-2 bg-muted/30">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-black text-sm border-2 border-primary shrink-0">{idx + 1}</span>
              <div className="flex-grow">
                <p className="font-bold text-sm">{m.title}</p>
                <p className="text-xs text-muted-foreground font-medium capitalize">{m.type.toLowerCase()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => handleEdit("material", m)}><FileEdit className="h-4 w-4 text-primary" /></Button>
                <Button variant="ghost" size="icon" onClick={() => wrapDelete(deleteMaterial, m.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {materials.length === 0 && <p className="text-sm text-muted-foreground font-medium text-center py-4">Belum ada materi.</p>}
          {activeForm === "material" && <MaterialForm courseId={courseId} initialData={editItem} onDone={() => { setActiveForm(null); setEditItem(null); router.refresh(); }} />}
        </CardContent>
      </Card>

      {/* Existing Quizzes */}
      <Card className="neo-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> Kuis ({quizzes.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="neo-button font-bold gap-1"
            onClick={() => handleAddNew("quiz")}
          >
            {activeForm === "quiz" && !editItem ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            Tambah Kuis
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {quizzes.map((q: any) => (
            <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg border-2 bg-muted/30">
              <HelpCircle className="h-5 w-5 text-blue-500 shrink-0" />
              <div className="flex-grow">
                <p className="font-bold text-sm">{q.title}</p>
                <p className="text-xs text-muted-foreground font-medium">{q.questions?.length || 0} soal • Nilai minimum: {q.passingScore}%{q.timeLimitMinutes ? ` • ${q.timeLimitMinutes} menit` : ""}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => handleEdit("quiz", q)}><FileEdit className="h-4 w-4 text-primary" /></Button>
                <Button variant="ghost" size="icon" onClick={() => wrapDelete(deleteQuiz, q.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {quizzes.length === 0 && <p className="text-sm text-muted-foreground font-medium text-center py-4">Belum ada kuis.</p>}
          {activeForm === "quiz" && <QuizForm courseId={courseId} initialData={editItem} onDone={() => { setActiveForm(null); setEditItem(null); router.refresh(); }} />}
        </CardContent>
      </Card>

      {/* Existing Assignments */}
      <Card className="neo-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" /> Tugas ({assignments.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="neo-button font-bold gap-1"
            onClick={() => handleAddNew("assignment")}
          >
            {activeForm === "assignment" && !editItem ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            Tambah Tugas
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {assignments.map((a: any) => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border-2 bg-muted/30">
              <FileEdit className="h-5 w-5 text-orange-500 shrink-0" />
              <div className="flex-grow">
                <p className="font-bold text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground font-medium">Skor maks: {a.maxScore}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => handleEdit("assignment", a)}><FileEdit className="h-4 w-4 text-primary" /></Button>
                <Button variant="ghost" size="icon" onClick={() => wrapDelete(deleteAssignment, a.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {assignments.length === 0 && <p className="text-sm text-muted-foreground font-medium text-center py-4">Belum ada tugas.</p>}
          {activeForm === "assignment" && <AssignmentForm courseId={courseId} initialData={editItem} onDone={() => { setActiveForm(null); setEditItem(null); router.refresh(); }} />}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sub-Forms ───────────────────────────────────────────

function MaterialForm({ courseId, initialData, onDone }: { courseId: string; initialData?: any; onDone: () => void }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [type, setType] = useState(initialData?.type || "TEXT");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) { toast.error("Judul dan konten wajib diisi."); return; }
    setIsPending(true);
    try {
      let res;
      if (initialData) {
        res = await updateMaterial(initialData.id, courseId, title, content, type);
      } else {
        res = await addMaterial(courseId, title, content, type);
      }
      if (res.success) { toast.success(initialData ? "Materi berhasil disunting!" : "Materi berhasil ditambahkan!"); onDone(); }
      else { toast.error(res.error || "Gagal."); }
    } catch { toast.error("Error."); }
    finally { setIsPending(false); }
  };

  return (
    <div className="border-2 border-primary rounded-xl p-4 space-y-4 bg-primary/5 mt-4">
      <h4 className="font-bold text-sm text-primary">Tambah Materi Baru</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs font-bold">Judul</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul materi" className="neo-input text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold">Tipe</Label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full rounded-lg border-2 border-border bg-background p-2 text-sm font-medium neo-border">
            <option value="TEXT">Teks</option>
            <option value="VIDEO">Video</option>
            <option value="DOCUMENT">Dokumen</option>
            <option value="PRESENTATION">Presentasi</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold">Konten</Label>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} placeholder="Tulis konten materi di sini..." className="w-full rounded-lg border-2 border-border bg-background p-3 text-sm font-medium resize-y neo-border" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onDone} className="font-bold">Batal</Button>
        <Button onClick={handleSubmit} disabled={isPending} className="neo-button font-bold gap-1">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {initialData ? "Simpan Perubahan" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}

function QuizForm({ courseId, initialData, onDone }: { courseId: string; initialData?: any; onDone: () => void }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [passingScore, setPassingScore] = useState(initialData?.passingScore || 60);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | undefined>(initialData?.timeLimitMinutes || undefined);
  const [questions, setQuestions] = useState(
    initialData?.questions?.length > 0 
      ? initialData.questions 
      : [{ question: "", options: ["", "", "", ""], correctIndex: 0, points: 10 }]
  );
  const [isPending, setIsPending] = useState(false);

  const addQuestion = () => setQuestions([...questions, { question: "", options: ["", "", "", ""], correctIndex: 0, points: 10 }]);

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[idx] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].options[oIdx] = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error("Judul kuis wajib diisi."); return; }
    if (questions.some((q: any) => !q.question.trim() || q.options.some((o: string) => !o.trim()))) {
      toast.error("Semua pertanyaan dan opsi wajib diisi."); return;
    }
    setIsPending(true);
    try {
      let res;
      if (initialData) {
        res = await updateQuiz(initialData.id, courseId, title, description, passingScore, timeLimitMinutes || null, questions);
      } else {
        res = await addQuiz(courseId, title, description, passingScore, timeLimitMinutes || null, questions);
      }
      if (res.success) { toast.success(initialData ? "Kuis berhasil disunting!" : "Kuis berhasil ditambahkan!"); onDone(); }
      else { toast.error(res.error || "Gagal."); }
    } catch { toast.error("Error."); }
    finally { setIsPending(false); }
  };

  return (
    <div className="border-2 border-primary rounded-xl p-4 space-y-4 bg-primary/5 mt-4">
      <h4 className="font-bold text-sm text-primary">Tambah Kuis Baru</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs font-bold">Judul Kuis</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul kuis" className="neo-input text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold">Nilai Minimum (%)</Label>
          <Input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} min={0} max={100} className="neo-input text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold">Batas Waktu (menit, opsional)</Label>
          <Input type="number" value={timeLimitMinutes || ""} onChange={e => setTimeLimitMinutes(e.target.value ? Number(e.target.value) : undefined)} min={1} placeholder="Tanpa batas" className="neo-input text-sm" />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold">Deskripsi (opsional)</Label>
        <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi kuis" className="neo-input text-sm" />
      </div>

      {questions.map((q: any, qIdx: number) => (
        <div key={qIdx} className="border-2 rounded-lg p-3 space-y-2 bg-background">
          <p className="font-bold text-xs text-muted-foreground">Soal #{qIdx + 1}</p>
          <Input value={q.question} onChange={e => updateQuestion(qIdx, "question", e.target.value)} placeholder="Pertanyaan" className="neo-input text-sm" />
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt: string, oIdx: number) => (
              <div key={oIdx} className="flex items-center gap-2">
                <input type="radio" name={`correct-${qIdx}`} checked={q.correctIndex === oIdx} onChange={() => updateQuestion(qIdx, "correctIndex", oIdx)} className="accent-primary" />
                <Input value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)} placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`} className="neo-input text-sm flex-grow" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addQuestion} className="w-full font-bold gap-1 border-dashed">
        <Plus className="h-4 w-4" /> Tambah Soal
      </Button>

      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onDone} className="font-bold">Batal</Button>
        <Button onClick={handleSubmit} disabled={isPending} className="neo-button font-bold gap-1">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {initialData ? "Simpan Kuis" : "Simpan Baru"}
        </Button>
      </div>
    </div>
  );
}

function AssignmentForm({ courseId, initialData, onDone }: { courseId: string; initialData?: any; onDone: () => void }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(() => {
    if (initialData?.dueDate) {
      // dueDate is a Date object, convert to YYYY-MM-DDTHH:mm format for input type="datetime-local"
      const date = new Date(initialData.dueDate);
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    }
    return "";
  });
  const [maxScore, setMaxScore] = useState(initialData?.maxScore || 100);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !dueDate) { toast.error("Semua field wajib diisi."); return; }
    setIsPending(true);
    try {
      let res;
      if (initialData) {
        res = await updateAssignment(initialData.id, courseId, title, description, dueDate, maxScore);
      } else {
        res = await addAssignment(courseId, title, description, dueDate, maxScore);
      }
      if (res.success) { toast.success(initialData ? "Tugas berhasil disunting!" : "Tugas berhasil ditambahkan!"); onDone(); }
      else { toast.error(res.error || "Gagal."); }
    } catch { toast.error("Error."); }
    finally { setIsPending(false); }
  };

  return (
    <div className="border-2 border-primary rounded-xl p-4 space-y-4 bg-primary/5 mt-4">
      <h4 className="font-bold text-sm text-primary">Tambah Tugas Baru</h4>
      <div className="space-y-1">
        <Label className="text-xs font-bold">Judul Tugas</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul tugas" className="neo-input text-sm" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold">Deskripsi</Label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Jelaskan tugas..." className="w-full rounded-lg border-2 border-border bg-background p-3 text-sm font-medium resize-y neo-border" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs font-bold">Tenggat Waktu</Label>
          <Input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} className="neo-input text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold">Skor Maksimum</Label>
          <Input type="number" value={maxScore} onChange={e => setMaxScore(Number(e.target.value))} min={1} className="neo-input text-sm" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onDone} className="font-bold">Batal</Button>
        <Button onClick={handleSubmit} disabled={isPending} className="neo-button font-bold gap-1">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {initialData ? "Simpan Tugas" : "Simpan Baru"}
        </Button>
      </div>
    </div>
  );
}
