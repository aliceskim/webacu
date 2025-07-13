'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

type Appointment = {
  id: string
  first_name: string
  last_name: string
  date: string
  time: string
  email: string | null
  phone: string | null
  first_time: boolean
  status: string
}

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching appointments:', error.message)
    } else {
      setAppointments(data)
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id)
  
    if (error) {
      alert('Error updating status: ' + error.message)
    } else {
      fetchAppointments() // refresh list after update
    }
  }
  

  useEffect(() => {
    fetchAppointments()
  }, [])

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading && <p>Loading appointments...</p>}
      {appointments.length === 0 && !loading && (
        <p>No appointment requests yet.</p>
      )}

      <ul className="space-y-4">
        {appointments.map(app => (
          <li
            key={app.id}
            className="border rounded p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
          >
            <div>
              <p>
                <strong>{app.first_name} {app.last_name}</strong>{' '}
                {app.first_time && <span className="text-xs bg-yellow-200 px-1 ml-1 rounded">First-Time</span>}
              </p>
              <p>{app.date} @ {app.time}</p>
              <p>
                {app.email && <>Email: {app.email} </>}
                {app.phone && <>Phone: {app.phone}</>}
              </p>
              <p>
  Status:{' '}
  <span className={`font-medium ${
    app.status === 'pending'
      ? 'text-yellow-500'
      : app.status === 'approved'
      ? 'text-green-600'
      : app.status === 'reschedule_requested'
      ? 'text-yellow-600'
      : 'text-gray-600'
  }`}>
    {app.status === 'pending'
      ? 'Pending'
      : app.status === 'approved'
      ? 'Confirmed'
      : app.status === 'reschedule_requested'
      ? 'Reschedule Requested'
      : app.status}
  </span>
</p>
            </div>
            {app.status === 'pending' && (
  <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
    <button
      onClick={() => updateStatus(app.id, 'approved')}
      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
    >
      Confirm Appointment
    </button>
    <button
      onClick={() => updateStatus(app.id, 'reschedule_requested')}
      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
    >
      Unavailable – Please Reschedule
    </button>
  </div>
)}
          </li>
        ))}
      </ul>
    </main>
  )
}
