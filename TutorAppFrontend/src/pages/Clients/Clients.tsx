import React from 'react'
import ClientsList from '../../features/clients/components/ClientsList'
import ClientsLayout from '../../components/layout/ClientsLayout'
import { useNavigate } from 'react-router'

const Clients = () => {
  const navigaet = useNavigate()

  return (
    <ClientsLayout>
      <h1 className='font-bold text-2xl text-purple-400 flex justify-between items-center'>
        List of clients
        <button className='bg-emerald-400/50 px-4 py-1 text-base text-emerald-500 font-bold rounded-2xl'
          onClick={() => navigaet('create')}
        >
          Add client
        </button>
      </h1>
      <ClientsList />
    </ClientsLayout>
  )
}

export default Clients