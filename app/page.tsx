'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Client = {
  id?: number
  animal: string
  created_at?: string
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState('')

  const animals = ['puppy', 'turtle', 'cat']

  useEffect(() => {
    async function fetchClients() {
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

    fetchClients()
  }, [])

  async function refetchClients() {
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

  async function addClient() {
    if (!selectedAnimal) return

    const { error } = await supabase
      .from('clients')
      .insert([{ animal: selectedAnimal }])

    if (error) {
      console.error('Error inserting client:', error)
    } else {
      setSelectedAnimal('')
      setShowAddModal(false)
      refetchClients()
    }
  }

  const filteredClients = clients.filter(client =>
    client.animal.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAnimalEmoji = (animal: string) => {
    const emojiMap: { [key: string]: string } = {
      puppy: '🐕',
      turtle: '🐢',
      cat: '🐱'
    }
    return emojiMap[animal.toLowerCase()] || '🐾'
  }

  return (
    <main className="min-h-screen bg-[#B8D8D8] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-[#4A6B6B] text-center mb-8">
          Clients
        </h1>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#D4EDED] border-2 border-[#A8C5C5] rounded-lg p-4 text-[#4A6B6B] placeholder-[#7A9B9B] focus:outline-none focus:border-[#8AB5B5]"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7A9B9B]">
            🔍
          </span>
        </div>

        {/* Note */}
        <p className="text-sm text-[#7A9B9B] mb-6 text-center">
          *only puppy is available right now
        </p>

        {/* Client Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-[#D4EDED] rounded-lg p-8 flex items-center justify-center aspect-square hover:bg-[#C4DDDD] transition-colors cursor-pointer"
            >
              <span className="text-6xl">{getAnimalEmoji(client.animal)}</span>
            </div>
          ))}
        </div>

        {/* Add Client Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-[#8AB5B5] hover:bg-[#7AA5A5] text-white font-semibold py-4 rounded-lg transition-colors"
        >
          Add Client
        </button>

        {/* HIPAA Notice */}
        <p className="text-xs text-[#7A9B9B] text-center mt-8">
          To be HIPAA compliant, clients are stored as animals and are not attached to any PHI
        </p>

        {/* Add Client Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#B8D8D8] rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#4A6B6B] mb-6 text-center">
                Select Animal Type
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {animals.map((animal) => (
                  <button
                    key={animal}
                    onClick={() => setSelectedAnimal(animal)}
                    className={`bg-[#D4EDED] rounded-lg p-8 flex flex-col items-center justify-center aspect-square hover:bg-[#C4DDDD] transition-colors ${
                      selectedAnimal === animal ? 'ring-4 ring-[#8AB5B5]' : ''
                    }`}
                  >
                    <span className="text-5xl mb-2">{getAnimalEmoji(animal)}</span>
                    <span className="text-[#4A6B6B] capitalize">{animal}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedAnimal('')
                  }}
                  className="flex-1 bg-[#A8C5C5] hover:bg-[#98B5B5] text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addClient}
                  disabled={!selectedAnimal}
                  className="flex-1 bg-[#8AB5B5] hover:bg-[#7AA5A5] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Client
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}