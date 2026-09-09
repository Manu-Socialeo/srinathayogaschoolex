'use client'

import { useState, useEffect } from 'react'
import { User, RefreshCw, Search, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  created_at: string
  enrollments?: { id: string }[]
  orders?: { id: string; total: number; status: string }[]
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const json = await res.json()
      setUsers(json.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const promoteToAdmin = async (user: UserProfile) => {
    if (!confirm(`Promote ${user.name} to admin? This gives them full dashboard access.`)) return
    setUpdatingId(user.id)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, role: user.role === 'admin' ? 'student' : 'admin' }),
      })
      if (res.ok) {
        const newRole = user.role === 'admin' ? 'student' : 'admin'
        setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u))
      }
    } catch (e) { console.error(e) }
    finally { setUpdatingId(null) }
  }

  const filtered = users.filter((u) => {
    const matchRole = filterRole === 'all' || u.role === filterRole
    const matchSearch = !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchRole && matchSearch
  })

  const studentCount = users.filter(u => u.role === 'student').length
  const adminCount = users.filter(u => u.role === 'admin').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Students & Users</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{users.length} total · {studentCount} students · {adminCount} admins</p>
        </div>
        <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: users.length },
          { label: 'Students', value: studentCount },
          { label: 'Admins', value: adminCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#264020]/10 p-4">
            <p className="text-2xl font-bold text-[#264020]">{stat.value}</p>
            <p className="text-xs text-[#264020]/50 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#264020]/40" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#264020]/15 bg-white text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#264020]/15 bg-white text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20">
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-[#264020]/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-[#264020]/30 animate-spin mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">Loading users…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <User className="w-10 h-10 text-[#264020]/20 mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#264020]/8 bg-[#F7F9F6]">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Phone</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Joined</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#264020]/5">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F7F9F6]/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#264020]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#264020]">{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
                        </div>
                        <span className="font-medium text-[#264020]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#264020]/70">{user.email}</td>
                    <td className="px-5 py-4 text-[#264020]/60">{user.phone || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        user.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#264020]/60 text-xs whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => promoteToAdmin(user)}
                        disabled={updatingId === user.id}
                        className={`flex items-center gap-1.5 ml-auto text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                          user.role === 'admin'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-violet-700 hover:bg-violet-50'
                        } disabled:opacity-50`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
