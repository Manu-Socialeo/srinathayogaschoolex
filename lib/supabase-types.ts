export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at'>
        Update: Partial<Omit<Course, 'id'>>
      }
      lessons: {
        Row: Lesson
        Insert: Omit<Lesson, 'id' | 'created_at'>
        Update: Partial<Omit<Lesson, 'id'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id'>>
      }
      workshops: {
        Row: Workshop
        Insert: Omit<Workshop, 'id' | 'created_at'>
        Update: Partial<Omit<Workshop, 'id'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id'>
        Update: Partial<Omit<Category, 'id'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'>
        Update: Partial<Omit<Order, 'id'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id'>
        Update: Partial<Omit<OrderItem, 'id'>>
      }
      shipping_addresses: {
        Row: ShippingAddress
        Insert: Omit<ShippingAddress, 'id' | 'created_at'>
        Update: Partial<Omit<ShippingAddress, 'id'>>
      }
      enrollments: {
        Row: Enrollment
        Insert: Omit<Enrollment, 'id' | 'started_at'>
        Update: Partial<Omit<Enrollment, 'id'>>
      }
      lesson_progress: {
        Row: LessonProgress
        Insert: Omit<LessonProgress, 'id' | 'last_watched_at'>
        Update: Partial<Omit<LessonProgress, 'id'>>
      }
      workshop_registrations: {
        Row: WorkshopRegistration
        Insert: Omit<WorkshopRegistration, 'id' | 'registered_at'>
        Update: Partial<Omit<WorkshopRegistration, 'id'>>
      }
      saved_items: {
        Row: SavedItem
        Insert: Omit<SavedItem, 'id' | 'created_at'>
        Update: Partial<Omit<SavedItem, 'id'>>
      }
      wishlist_items: {
        Row: WishlistItem
        Insert: Omit<WishlistItem, 'id' | 'created_at'>
        Update: Partial<Omit<WishlistItem, 'id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at' | 'read'>
        Update: Partial<Omit<Notification, 'id'>>
      }
      ttc_resources: {
        Row: TTCResource
        Insert: Omit<TTCResource, 'id' | 'created_at'>
        Update: Partial<Omit<TTCResource, 'id'>>
      }
      ttc_enrollments: {
        Row: TTCEnrollment
        Insert: Omit<TTCEnrollment, 'id' | 'created_at'>
        Update: Partial<Omit<TTCEnrollment, 'id'>>
      }
    }
  }
}

export interface Profile {
  id: string
  email: string
  name: string
  avatar_url: string | null
  phone: string | null
  address: string | null
  password_set: boolean
  role: 'student' | 'admin'
  created_at: string
}

export interface Course {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  duration: string
  lessons_count: number
  level: string
  category_id: string | null
  price: number
  instructor: string
  instructor_image: string | null
  rating: number
  reviews_count: number
  certificate_eligible: boolean
  published: boolean
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  video_url: string | null
  duration_seconds: number
  order_index: number
  created_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  image: string
  price: number
  original_price: number
  category_id: string | null
  rating: number
  reviews_count: number
  in_stock: boolean
  is_digital: boolean
  created_at: string
}

export interface Workshop {
  id: string
  title: string
  description: string
  image: string
  start_date: string
  duration: string
  language: string
  price: number
  starts_in: number
  instructor: string
  format: string
  seat_limit: number
  seats_remaining: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  type: 'course' | 'product' | 'workshop'
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  shipping_address_id: string | null
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  course_id: string | null
  workshop_id: string | null
  price: number
}

export interface ShippingAddress {
  id: string
  user_id: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  created_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  progress: number
  started_at: string
  completed_at: string | null
  certificate_issued: boolean
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  watched_seconds: number
  completed: boolean
  last_watched_at: string
}

export interface WorkshopRegistration {
  id: string
  user_id: string
  workshop_id: string
  status: 'registered' | 'cancelled' | 'attended'
  registered_at: string
}

export interface SavedItem {
  id: string
  user_id: string
  item_type: 'course' | 'product' | 'workshop'
  item_id: string
  created_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: 'info' | 'success' | 'warning'
  read: boolean
  created_at: string
}

export interface TTCResource {
  id: string
  title: string
  type: 'pdf' | 'audio' | 'video'
  description: string | null
  file_url: string | null
  size: string | null
  duration: string | null
  created_at: string
}

export interface TTCEnrollment {
  id: string
  user_id: string
  course_id: string
  full_name: string
  date_of_birth: string
  phone: string
  address: string
  experience_level: string
  medical_conditions: string | null
  photo_url: string | null
  id_proof_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
