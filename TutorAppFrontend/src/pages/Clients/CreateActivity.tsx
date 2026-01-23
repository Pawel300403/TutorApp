import React from 'react'
import ActivityForm from '../../features/clients/components/ActivityForm'
import { useParams } from 'react-router'

function CreateActivity() {

    const { id } = useParams()

    return (
        <div>
            <ActivityForm idClient={Number(id)} method='Create' />
        </div>
    )
}

export default CreateActivity