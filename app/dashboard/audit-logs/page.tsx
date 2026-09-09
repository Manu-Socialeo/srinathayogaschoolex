'use client'

import { History } from 'lucide-react'

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Audit Logs</h1>
        <p className="text-[#264020]/60 text-sm mt-1">Track all admin actions across the dashboard</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#264020]/8 flex items-center justify-center mx-auto mb-4">
          <History className="w-8 h-8 text-[#264020]/40" />
        </div>
        <h2 className="font-serif font-bold text-[#264020] text-xl mb-2">Audit Logging</h2>
        <p className="text-[#264020]/60 text-sm max-w-md mx-auto">
          Comprehensive admin action audit trails will be recorded here. This feature requires creating an{' '}
          <code className="bg-[#264020]/8 px-1.5 py-0.5 rounded text-xs font-mono text-[#264020]">audit_logs</code> table in Supabase and wiring up middleware hooks.
        </p>
        <div className="mt-6 p-4 bg-[#F7F9F6] rounded-xl text-left text-xs font-mono text-[#264020]/50 max-w-sm mx-auto">
          <p>-- SQL to enable audit logging:</p>
          <p className="mt-1">CREATE TABLE audit_logs (</p>
          <p className="ml-4">id UUID PRIMARY KEY DEFAULT gen_random_uuid(),</p>
          <p className="ml-4">admin_id UUID REFERENCES profiles(id),</p>
          <p className="ml-4">action TEXT NOT NULL,</p>
          <p className="ml-4">resource TEXT NOT NULL,</p>
          <p className="ml-4">resource_id UUID,</p>
          <p className="ml-4">details JSONB,</p>
          <p className="ml-4">created_at TIMESTAMPTZ DEFAULT now()</p>
          <p>);</p>
        </div>
      </div>
    </div>
  )
}
