'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

export default function Home() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    first_time: false,
    date: '',
    time: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Auto-initialize date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setForm(f => ({ ...f, date: today }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!form.email && !form.phone) {
      setErrorMsg('Please provide at least an email or phone number.')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('appointments').insert([form])
    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
      setSuccess(false)
    } else {
      setSuccess(true)
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        first_time: false,
        date: new Date().toISOString().split('T')[0],
        time: ''
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="bg-background text-text text-xl">
        Welcome to WebACU!
      </div>
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        {/* First + Last name side-by-side */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>

        {/* Date (auto-filled to today) */}
        <input
          type="date"
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          className="w-full p-2 border rounded"
          required
        />

        {/* Time */}
        <input
          type="time"
          value={form.time}
          onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
          className="w-full p-2 border rounded"
          required
        />

        {/* First-time checkbox */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.first_time}
            onChange={e => setForm(f => ({ ...f, first_time: e.target.checked }))}
          />
          <span>First-time patient?</span>
        </label>

        {/* Email */}
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full p-2 border rounded"
        />

        {/* Phone */}
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="w-full p-2 border rounded"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>

        {/* Messages */}
        {success && <p className="text-green-600 text-sm">Request submitted!</p>}
        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
      </form>
     
    </main>
    
  )
}
