import { createBrowserClient } from './supabase'

const AVATARS_BUCKET = 'avatars'
const PRODUCTS_BUCKET = 'products'
const DOCUMENTS_BUCKET = 'documents'

function sb() {
  return createBrowserClient()
}

// Avatar upload
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error } = await sb().storage.from(AVATARS_BUCKET).upload(path, file, { upsert: true })
  if (error) return null

  const { data: urlData } = sb().storage.from(AVATARS_BUCKET).getPublicUrl(path)
  return urlData?.publicUrl ?? null
}

export async function deleteAvatar(userId: string) {
  const { data: files } = await sb().storage.from(AVATARS_BUCKET).list(userId)
  if (files?.length) {
    const paths = files.map((f) => `${userId}/${f.name}`)
    await sb().storage.from(AVATARS_BUCKET).remove(paths)
  }
}

// Product image upload
export async function uploadProductImage(productId: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const path = `${productId}/${Date.now()}.${ext}`

  const { error } = await sb().storage.from(PRODUCTS_BUCKET).upload(path, file)
  if (error) return null

  const { data: urlData } = sb().storage.from(PRODUCTS_BUCKET).getPublicUrl(path)
  return urlData?.publicUrl ?? null
}

// Document upload (TTC ID proof, etc.)
export async function uploadDocument(userId: string, folder: string, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${folder}/${Date.now()}.${ext}`

  const { error } = await sb().storage.from(DOCUMENTS_BUCKET).upload(path, file)
  if (error) return null

  const { data: urlData } = sb().storage.from(DOCUMENTS_BUCKET).getPublicUrl(path)
  return urlData?.publicUrl ?? null
}

// Delete a file
export async function deleteFile(bucket: string, path: string) {
  const { error } = await sb().storage.from(bucket).remove([path])
  return { error }
}

// Get public URL
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = sb().storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl ?? ''
}
