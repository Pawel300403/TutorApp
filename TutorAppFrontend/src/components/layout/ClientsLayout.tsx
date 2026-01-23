import React from 'react'

function ClientsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 py-8 space-y-8'>
        {children}
    </div>
  )
}

export default ClientsLayout