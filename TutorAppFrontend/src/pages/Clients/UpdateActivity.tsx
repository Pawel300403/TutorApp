import React from 'react'
import ActivityForm from '../../features/clients/components/ActivityForm'
import { useParams } from 'react-router'

function UpdateActivity() {

    const { idClient, idActivity } = useParams()

    return (
        <div>
            <ActivityForm method='Update' idClient={Number(idClient)} idActivity={Number(idActivity)} />
        </div>
    )
}

export default UpdateActivity