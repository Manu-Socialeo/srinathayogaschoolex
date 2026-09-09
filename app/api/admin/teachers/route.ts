import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { teachers as defaultTeachers } from '@/lib/app-data'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'teachers.json')

async function getTeachersList() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const file = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(file)
  } catch {
    // If not written yet, initialize with default teachers
    try {
      await fs.writeFile(FILE_PATH, JSON.stringify(defaultTeachers, null, 2), 'utf-8')
    } catch {
      // fallback in-memory
    }
    return defaultTeachers
  }
}

async function saveTeachersList(list: typeof defaultTeachers) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2), 'utf-8')
}

// GET: fetch all teachers
export async function GET() {
  try {
    const list = await getTeachersList()
    return NextResponse.json({ data: list })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST: add a new teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, specialization, bio, image } = body

    if (!name || !role) {
      return NextResponse.json({ error: 'Name and role are required' }, { status: 400 })
    }

    const currentList = await getTeachersList()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const newTeacher = {
      id: `${slug}-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      role: role.trim(),
      specialization: specialization?.trim() || 'Hatha Yoga',
      bio: bio?.trim() || '',
      image: image || '/teachers/Dr.Srinatha.webp',
    }

    const updatedList = [newTeacher, ...currentList]
    await saveTeachersList(updatedList)

    return NextResponse.json({ data: newTeacher }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to add teacher' },
      { status: 500 }
    )
  }
}

// PUT: update teacher
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 })
    }

    const currentList = await getTeachersList()
    const index = currentList.findIndex((t: { id: string }) => t.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    currentList[index] = { ...currentList[index], ...updates }
    await saveTeachersList(currentList)

    return NextResponse.json({ data: currentList[index] })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update teacher' },
      { status: 500 }
    )
  }
}

// DELETE: delete teacher
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 })
    }

    const currentList = await getTeachersList()
    const updatedList = currentList.filter((t: { id: string }) => t.id !== id)
    await saveTeachersList(updatedList)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete teacher' },
      { status: 500 }
    )
  }
}
