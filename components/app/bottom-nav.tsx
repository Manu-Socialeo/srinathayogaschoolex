'use client'

import { Home, BookOpen, Calendar, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'workshops', label: 'Workshops', icon: Calendar },
  { id: 'store', label: 'Store', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', icon: User },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const activeIndex = navItems.findIndex(item => item.id === activeTab)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border/50 safe-bottom">
      <div className="relative flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all duration-200 touch-target',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={cn(
                'flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200',
                isActive && 'bg-primary/10'
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isActive && 'scale-110'
                )} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                'text-[10px] transition-all duration-200',
                isActive ? 'font-semibold' : 'font-medium'
              )}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
