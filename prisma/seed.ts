import 'dotenv/config'
import { UserRole, MaterialType, ActivityType } from '@prisma/client'
import { prisma } from '../src/lib/prisma'

function randomDaysAgo(maxDays: number) {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * maxDays))
  return date
}

function randomMinutesAgo(maxMinutes: number) {
  const date = new Date()
  date.setMinutes(date.getMinutes() - Math.floor(Math.random() * maxMinutes))
  return date
}

async function main() {
  console.log('Starting dummy data generation...')

  console.log('Cleaning database...')
  await prisma.badge.deleteMany()
  await prisma.behaviorProfile.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.assignmentSubmission.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.quizAttempt.deleteMany()
  await prisma.quizQuestion.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.materialCompletion.deleteMany()
  await prisma.material.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  const adminId = '11111111-1111-1111-1111-111111111111'
  const lecturerId = '22222222-2222-2222-2222-222222222222'

  console.log('Creating Users...')
  
  await prisma.user.create({
    data: {
      id: adminId,
      name: 'System Admin',
      email: 'admin@stacksinau.com',
      role: UserRole.SUPER_ADMIN,
    }
  })

  await prisma.user.create({
    data: {
      id: lecturerId,
      name: 'Dr. Jane Smith',
      email: 'jane.smith@stacksinau.com',
      role: UserRole.DOSEN,
    }
  })

  const studentProfiles = [
    { name: 'Andi Pratama', type: 'aktif' },
    { name: 'Budi Santoso', type: 'aktif' },
    { name: 'Citra Dewi', type: 'procrastinator' },
    { name: 'Dian Sari', type: 'pasif' },
    { name: 'Eko Wijaya', type: 'pasif' },
  ]

  const students = []
  for (let i = 0; i < studentProfiles.length; i++) {
    const uuid = `33333333-3333-4333-8333-${(i + 1).toString().padStart(12, '0')}`
    const student = await prisma.user.create({
      data: {
        id: uuid,
        name: studentProfiles[i].name,
        email: `${studentProfiles[i].name.toLowerCase().replace(/\s/g, '.')}@stacksinau.com`,
        role: UserRole.MAHASISWA,
      }
    })
    students.push({ ...student, behaviorType: studentProfiles[i].type })
  }

  console.log('Creating Courses & Learning Materials...')
  const courses = []
  for (let i = 1; i <= 3; i++) {
    const course = await prisma.course.create({
      data: {
        title: `Pengantar Mata Kuliah ${i}`,
        description: `Panduan komprehensif untuk memahami dasar-dasar mata kuliah ${i}.`,
        creatorId: lecturerId,
        isPublished: true,
        semester: 'Ganjil 2025/2026',
      }
    })
    courses.push(course)

    for (const student of students) {
      await prisma.enrollment.create({
        data: {
          userId: student.id,
          courseId: course.id,
          enrolledAt: randomDaysAgo(30)
        }
      })
    }

    for (let m = 1; m <= 3; m++) {
      await prisma.material.create({
        data: {
          courseId: course.id,
          title: `Bab ${m}: Konsep Inti`,
          content: `Ini adalah detail materi untuk Bab ${m}. Materi ini mencakup topik-topik penting...`,
          type: m % 2 === 0 ? MaterialType.VIDEO : MaterialType.TEXT,
          orderIndex: m,
        }
      })
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        title: `Kuis Ujian Tengah Semester - Kursus ${i}`,
        description: `Uji pengetahuan Anda tentang bab 1-3.`,
        timeLimitMinutes: 30,
        passingScore: 60,
      }
    })

    for (let q = 1; q <= 3; q++) {
      await prisma.quizQuestion.create({
        data: {
          quizId: quiz.id,
          question: `Apa konsep yang paling penting pada bagian ${q}?`,
          options: ['Opsi A (Salah)', 'Opsi B (Salah)', 'Opsi C (Benar)', 'Opsi D (Salah)'],
          correctIndex: 2,
          points: 10,
          orderIndex: q
        }
      })
    }

    await prisma.assignment.create({
      data: {
        courseId: course.id,
        title: `Tugas Akhir Mata Kuliah ${i}`,
        description: `Kumpulkan tugas makalah akhir Anda mengenai studi kasus terkait.`,
        dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      }
    })
  }

  console.log('Generating Activity Logs with diverse behavioral patterns...')

  for (const student of students) {
    let loginCount = 0
    let studyDuration = 0
    let completionActions = 0

    switch (student.behaviorType) {
      case 'aktif':
        loginCount = 20 + Math.floor(Math.random() * 10)
        studyDuration = 30 + Math.floor(Math.random() * 30)
        completionActions = 5 + Math.floor(Math.random() * 4)
        break
      case 'procrastinator':
        loginCount = 8 + Math.floor(Math.random() * 5)
        studyDuration = 10 + Math.floor(Math.random() * 10)
        completionActions = 2 + Math.floor(Math.random() * 2)
        break
      case 'pasif':
        loginCount = 2 + Math.floor(Math.random() * 3)
        studyDuration = 3 + Math.floor(Math.random() * 5)
        completionActions = 0 + Math.floor(Math.random() * 1)
        break
    }

    for (let l = 0; l < loginCount; l++) {
      await prisma.activityLog.create({
        data: {
          userId: student.id,
          type: ActivityType.LOGIN,
          createdAt: randomDaysAgo(30),
        }
      })
    }

    for (let s = 0; s < Math.ceil(studyDuration / 10); s++) {
      await prisma.activityLog.create({
        data: {
          userId: student.id,
          type: ActivityType.MATERIAL_READ,
          duration: Math.floor(Math.random() * 20) + 5,
          createdAt: randomDaysAgo(30),
        }
      })
    }

    for (let c = 0; c < completionActions; c++) {
      const types: ActivityType[] = [ActivityType.QUIZ_SUBMIT, ActivityType.ASSIGNMENT_SUBMIT]
      await prisma.activityLog.create({
        data: {
          userId: student.id,
          type: types[Math.floor(Math.random() * types.length)],
          createdAt: randomDaysAgo(30),
        }
      })
    }
  }

  console.log('Dummy data generation completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
