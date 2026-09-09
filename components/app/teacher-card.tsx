import Image from 'next/image'
import type { Teacher } from '@/lib/app-data'

interface TeacherCardProps {
  teacher: Teacher
  onClick?: () => void
}

export function TeacherCard({ teacher, onClick }: TeacherCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-32 snap-start text-center"
    >
      <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-primary/20 mb-2">
        <Image
          src={teacher.image}
          alt={teacher.name}
          fill
          className="object-cover object-top"
        />
      </div>
      <h3 className="font-medium text-sm text-foreground">{teacher.name}</h3>
      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{teacher.role}</p>
    </button>
  )
}
