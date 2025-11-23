'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Client = {
  id?: number
  name: string
  animal: string
  created_at?: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [name, setName] = useState('')
  const [animal, setAnimal] = useState('')

  // 🔥 FIX: React-approved pattern
  useEffect(() => {
    async function loadClients() {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching clients:', error)
      } else {
        setClients(data || [])
      }
    }

    loadClients()
  }, [])

  async function addClient() {
    if (!name || !animal) return

    const { error } = await supabase
      .from('clients')
      .insert([{ name, animal }])

    if (error) {
      console.error('Error adding client:', error)
    } else {
      setName('')
      setAnimal('')

      // Re-fetch clients after adding
      const { data } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      setClients(data || [])
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Animal name (ex: Puppy)"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Animal type (dog, cat, etc.)"
          value={animal}
          onChange={e => setAnimal(e.target.value)}
        />

        <button
          onClick={addClient}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <ul className="list-disc ml-6">
        {clients.map(c => (
          <li key={c.id}>
            {c.name} — {c.animal}
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-500 mt-6">
        Clients are stored as animals only for HIPAA compliance.
      </p>
    </main>
  )
}
