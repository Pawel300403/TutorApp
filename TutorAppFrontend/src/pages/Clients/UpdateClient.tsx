import React from 'react'
import { useParams } from 'react-router'
import ClientForm from '../../features/clients/components/ClientForm'

function UpdateClient() {

    const { id } = useParams()
    return (
        <div>
            <ClientForm method='Update' idClient={Number(id)}/>
        </div>
    )
}

export default UpdateClient