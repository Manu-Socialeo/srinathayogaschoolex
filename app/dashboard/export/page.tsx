'use client'

import { FileSpreadsheet, Download } from 'lucide-react'

const EXPORT_OPTIONS = [
  { type: 'users', label: 'Students & Users', description: 'All registered user profiles with name, email, phone, role, and join date', color: 'bg-blue-50 border-blue-200' },
  { type: 'orders', label: 'Orders', description: 'Order history with customer details, totals, status, and order date', color: 'bg-amber-50 border-amber-200' },
  { type: 'products', label: 'Products', description: 'Full product catalog with prices, stock status, ratings, and categories', color: 'bg-emerald-50 border-emerald-200' },
  { type: 'leads', label: 'Leads & Inquiries', description: 'All contact form submissions with name, email, subject, and message', color: 'bg-pink-50 border-pink-200' },
]

export default function AdminExportPage() {
  const handleDownload = (type: string) => {
    window.open(`/api/admin/export?type=${type}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Data Export</h1>
        <p className="text-[#264020]/60 text-sm mt-1">Download CSV exports of your school data</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {EXPORT_OPTIONS.map((opt) => (
          <div key={opt.type} className={`bg-white rounded-2xl border ${opt.color} shadow-sm p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#264020]/10 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-[#264020]" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#264020] text-base">{opt.label}</h2>
                <p className="text-sm text-[#264020]/60 mt-1">{opt.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload(opt.type)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#264020] hover:bg-[#1a2c15] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" /> Download CSV
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#F7F9F6] rounded-2xl border border-[#264020]/10 p-5">
        <h3 className="font-semibold text-[#264020] text-sm mb-2">ℹ️ About CSV Exports</h3>
        <ul className="text-xs text-[#264020]/60 space-y-1 list-disc list-inside">
          <li>Files are generated in real time directly from the database</li>
          <li>All exports are in UTF-8 CSV format, compatible with Excel, Google Sheets, and any BI tool</li>
          <li>Sensitive financial data is included — download on a secure network only</li>
          <li>Exports do not include passwords or authentication tokens</li>
        </ul>
      </div>
    </div>
  )
}
