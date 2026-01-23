import React from 'react'
import { useClients } from '../api/clients.api'
import Card from '../../../components/ui/Card'

const ClientsList = () => {

    const { data: Clients } = useClients()

    return (
        <div className='grid gap-4'>
            {Clients && Clients.map(client => (
                <Card name={client.name} id={client.id}/>
            ))}
        </div>
    )
}

export default ClientsList