import { createBrowserClient } from './supabase'
import type { Database } from './supabase-types'
import type { Course as AppCourse, Workshop as AppWorkshop, Product as AppProduct, Category as AppCategory } from './app-data'

type Tables = Database['public']['Tables']
type Profile = Tables['profiles']['Row']
type Course = Tables['courses']['Row']
type Lesson = Tables['lessons']['Row']
type Product = Tables['products']['Row']
type Workshop = Tables['workshops']['Row']
type Category = Tables['categories']['Row']
type Enrollment = Tables['enrollments']['Row']
type LessonProgress = Tables['lesson_progress']['Row']
type WorkshopRegistration = Tables['workshop_registrations']['Row']
type SavedItem = Tables['saved_items']['Row']
type WishlistItem = Tables['wishlist_items']['Row']
type Notification = Tables['notifications']['Row']
type Order = Tables['orders']['Row']
type OrderItem = Tables['order_items']['Row']
type TTCResource = Tables['ttc_resources']['Row']
type TTCEnrollment = Tables['ttc_enrollments']['Row']

function sb() {
  return createBrowserClient()
}

// Profiles
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await sb().from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { error } = await sb().from('profiles').update(updates).eq('id', userId)
  return { error }
}

// Courses
export async function getCourses(): Promise<Course[]> {
  const { data } = await sb().from('courses').select('*').eq('published', true).order('created_at', { ascending: false })
  return data ?? []
}

export async function getCourse(id: string): Promise<Course | null> {
  const { data } = await sb().from('courses').select('*').eq('id', id).single()
  return data
}

export async function getCoursesByCategory(slug: string): Promise<Course[]> {
  const { data } = await sb()
    .from('courses')
    .select('*, categories!inner(slug)')
    .eq('published', true)
    .eq('categories.slug', slug)
    .order('created_at', { ascending: false })
  return data ?? []
}

// Lessons
export async function getLessons(courseId: string): Promise<Lesson[]> {
  const { data } = await sb()
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })
  return data ?? []
}

export async function getLesson(id: string): Promise<Lesson | null> {
  const { data } = await sb().from('lessons').select('*').eq('id', id).single()
  return data
}

// Products
export async function getProducts(): Promise<Product[]> {
  const { data } = await sb().from('products').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data } = await sb().from('products').select('*').eq('id', id).single()
  return data
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const { data } = await sb()
    .from('products')
    .select('*, categories!inner(slug)')
    .eq('categories.slug', slug)
    .order('created_at', { ascending: false })
  return data ?? []
}

// Workshops
export async function getWorkshops(): Promise<Workshop[]> {
  const { data } = await sb().from('workshops').select('*').order('start_date', { ascending: true })
  return data ?? []
}

export async function getWorkshop(id: string): Promise<Workshop | null> {
  const { data } = await sb().from('workshops').select('*').eq('id', id).single()
  return data
}

export async function getUpcomingWorkshops(): Promise<Workshop[]> {
  const { data } = await sb()
    .from('workshops')
    .select('*')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
  return data ?? []
}

// Categories
export async function getCategories(type?: 'course' | 'product' | 'workshop'): Promise<Category[]> {
  let query = sb().from('categories').select('*').order('name')
  if (type) query = query.eq('type', type)
  const { data } = await query
  return data ?? []
}

// Enrollments
export async function getEnrollments(userId: string): Promise<Enrollment[]> {
  const { data } = await sb().from('enrollments').select('*').eq('user_id', userId).order('started_at', { ascending: false })
  return data ?? []
}

export async function getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
  const { data } = await sb()
    .from('enrollments')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()
  return data
}

export async function enrollInCourse(userId: string, courseId: string) {
  const { error } = await sb().from('enrollments').insert({ user_id: userId, course_id: courseId })
  return { error }
}

// Lesson Progress
export async function getLessonProgress(userId: string, courseId: string): Promise<LessonProgress[]> {
  const { data } = await sb()
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
  return data ?? []
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  courseId: string,
  updates: { watched_seconds?: number; completed?: boolean }
) {
  const existing = await sb()
    .from('lesson_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (existing.data) {
    return sb().from('lesson_progress').update(updates).eq('id', existing.data.id)
  }

  return sb().from('lesson_progress').insert({
    user_id: userId,
    lesson_id: lessonId,
    course_id: courseId,
    watched_seconds: updates.watched_seconds ?? 0,
    completed: updates.completed ?? false,
  })
}

// Workshop Registrations
export async function registerForWorkshop(userId: string, workshopId: string) {
  const { error } = await sb().from('workshop_registrations').insert({ user_id: userId, workshop_id: workshopId })
  return { error }
}

export async function getWorkshopRegistrations(userId: string): Promise<WorkshopRegistration[]> {
  const { data } = await sb()
    .from('workshop_registrations')
    .select('*')
    .eq('user_id', userId)
    .order('registered_at', { ascending: false })
  return data ?? []
}

// Saved Items
export async function getSavedItems(userId: string): Promise<SavedItem[]> {
  const { data } = await sb().from('saved_items').select('*').eq('user_id', userId)
  return data ?? []
}

export async function saveItem(userId: string, itemType: SavedItem['item_type'], itemId: string) {
  const { error } = await sb().from('saved_items').insert({ user_id: userId, item_type: itemType, item_id: itemId })
  return { error }
}

export async function unsaveItem(userId: string, itemType: SavedItem['item_type'], itemId: string) {
  const { error } = await sb()
    .from('saved_items')
    .delete()
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
  return { error }
}

export async function isSaved(userId: string, itemType: SavedItem['item_type'], itemId: string): Promise<boolean> {
  const { data } = await sb()
    .from('saved_items')
    .select('id')
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .single()
  return !!data
}

// Wishlist
export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const { data } = await sb().from('wishlist_items').select('*').eq('user_id', userId)
  return data ?? []
}

export async function addToWishlist(userId: string, productId: string) {
  const { error } = await sb().from('wishlist_items').insert({ user_id: userId, product_id: productId })
  return { error }
}

export async function removeFromWishlist(userId: string, productId: string) {
  const { error } = await sb().from('wishlist_items').delete().eq('user_id', userId).eq('product_id', productId)
  return { error }
}

// Notifications
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data } = await sb()
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function markNotificationRead(id: string) {
  const { error } = await sb().from('notifications').update({ read: true }).eq('id', id)
  return { error }
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await sb()
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)
  return count ?? 0
}

// Orders
export async function getOrders(userId: string): Promise<(Order & { items?: OrderItem[] })[]> {
  const { data: orders } = await sb()
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!orders) return []

  const orderIds = orders.map((o: any) => o.id)
  const { data: allItems } = await sb()
    .from('order_items')
    .select('*, courses(title), products(title), workshops(title)')
    .in('order_id', orderIds)

  const itemsByOrder: Record<string, (OrderItem & { itemTitle?: string })[]> = {}
  if (allItems) {
    for (const item of allItems) {
      const itemTitle = item.courses?.title || item.products?.title || item.workshops?.title || ''
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = []
      itemsByOrder[item.order_id].push({ ...item, itemTitle } as OrderItem & { itemTitle?: string })
    }
  }

  return orders.map(order => ({
    ...order,
    items: itemsByOrder[order.id] ?? [],
  }))
}

// TTC Resources
export async function getTTCResources(): Promise<TTCResource[]> {
  const { data } = await sb().from('ttc_resources').select('*').order('created_at', { ascending: false })
  return data ?? []
}

// TTC Enrollments
export async function getTTCEnrollments(userId: string): Promise<TTCEnrollment[]> {
  const { data } = await sb()
    .from('ttc_enrollments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function submitTTCEnrollment(enrollment: Omit<TTCEnrollment, 'id' | 'created_at'>) {
  const { error } = await sb().from('ttc_enrollments').insert(enrollment)
  return { error }
}

// ─── Cached fetch functions (transform DB types → App types) ───
// Cache TTL: 60 seconds — data auto-refreshes after admin edits in Supabase

const CACHE_TTL = 60_000

type CacheEntry<T> = { data: T; ts: number }

let _coursesCache: CacheEntry<AppCourse[]> | null = null
let _productsCache: CacheEntry<AppProduct[]> | null = null
let _workshopsCache: CacheEntry<AppWorkshop[]> | null = null
let _categoriesCache: CacheEntry<AppCategory[]> | null = null

function isCacheFresh(entry: CacheEntry<unknown> | null): boolean {
  return entry !== null && Date.now() - entry.ts < CACHE_TTL
}

function mapCourse(c: Course, catMap: Record<string, string>): AppCourse {
  const catSlug = Object.entries(catMap).find(([, id]) => id === c.category_id)?.[0] ?? ''
  return {
    id: c.id, title: c.title, subtitle: c.subtitle, description: c.description,
    image: c.image, duration: c.duration, lessons: c.lessons_count, level: c.level,
    category: catSlug, price: c.price, instructor: c.instructor, instructorImage: c.instructor_image ?? '',
    rating: c.rating, reviews: c.reviews_count, progress: undefined, isPurchased: false, isSaved: false,
    certificateEligible: c.certificate_eligible,
  }
}

function mapProduct(p: Product): AppProduct {
  return {
    id: p.id, title: p.title, description: p.description, image: p.image, price: p.price,
    originalPrice: p.original_price, category: '', rating: p.rating, reviews: p.reviews_count, inStock: p.in_stock,
  }
}

function mapWorkshop(w: Workshop): AppWorkshop {
  return {
    id: w.id, title: w.title, description: w.description, image: w.image,
    startDate: new Date(w.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    duration: w.duration, language: w.language, price: w.price, startsIn: w.starts_in,
    instructor: w.instructor, format: w.format,
  }
}

export async function fetchCourses(): Promise<AppCourse[]> {
  if (isCacheFresh(_coursesCache)) return _coursesCache!.data
  const [courses, cats] = await Promise.all([getCourses(), getCategories('course')])
  const catMap: Record<string, string> = {}
  for (const c of cats) catMap[c.slug] = c.id
  _coursesCache = { data: courses.map(c => mapCourse(c, catMap)), ts: Date.now() }
  return _coursesCache.data
}

export async function fetchProducts(): Promise<AppProduct[]> {
  if (isCacheFresh(_productsCache)) return _productsCache!.data
  const [products, cats] = await Promise.all([getProducts(), getCategories('product')])
  const catMap: Record<string, string> = {}
  for (const c of cats) catMap[c.slug] = c.id
  _productsCache = {
    data: products.map(p => {
      const catSlug = Object.entries(catMap).find(([, id]) => id === p.category_id)?.[0] ?? ''
      return { ...mapProduct(p), category: catSlug }
    }),
    ts: Date.now(),
  }
  return _productsCache.data
}

export async function fetchWorkshops(): Promise<AppWorkshop[]> {
  if (isCacheFresh(_workshopsCache)) return _workshopsCache!.data
  _workshopsCache = { data: (await getWorkshops()).map(mapWorkshop), ts: Date.now() }
  return _workshopsCache.data
}

export async function fetchCategories(): Promise<AppCategory[]> {
  if (isCacheFresh(_categoriesCache)) return _categoriesCache!.data
  _categoriesCache = { data: (await getCategories()).map(c => ({ id: c.slug, label: c.name })), ts: Date.now() }
  return _categoriesCache.data
}

export function clearCache() {
  _coursesCache = null
  _productsCache = null
  _workshopsCache = null
  _categoriesCache = null
}
