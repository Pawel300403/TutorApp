import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import ClientsLayout from '../../components/layout/ClientsLayout'
import { useClient, useClientActivities, useDeleteActivity, useDeleteClient } from '../../features/clients/api/clients.api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import DeleteDialog from '../../components/ui/DeleteDialog'

export const Client = () => {

    const { id } = useParams()
    const { data: client } = useClient(Number(id))
    const { data: activities } = useClientActivities(Number(id))
    const { mutate: deleteActivity } = useDeleteActivity()
    const { mutate: deleteClient } = useDeleteClient()
    const [showDeleteClientDialog, setShowDeleteClientDialog] = useState(false)
    const [activityToDeleteId, setActivityToDeleteId] = useState<number | null>(null)

    const navigate = useNavigate()

    const handleDeleteClient = () => {
        if (client) {
            deleteClient(client.id)
            navigate('/clients')
        }
    }

    return (
        <ClientsLayout>

            <DeleteDialog
                show={showDeleteClientDialog}
                text="Are you sure to delete client?"
                deleteFn={handleDeleteClient}
                closeSignal={() => setShowDeleteClientDialog(prev => !prev)}

            />

            <DeleteDialog
                show={activityToDeleteId !== null}
                text="Are you sure to delete activity?"
                deleteFn={() => {
                    if (!activityToDeleteId) return
                    deleteActivity({ idClient: client!.id, idActivity: activityToDeleteId })
                    setActivityToDeleteId(null)
                }}
                closeSignal={() => setActivityToDeleteId(null)}

            />

            <h1 className='font-bold text-2xl text-purple-400 flex items-center justify-between'>
                {client?.name}
                <FontAwesomeIcon icon={faEdit} color='black' onClick={() => navigate(`/clients/update/${client?.id}`)} />
            </h1>
            <div className="px-4 sm:px-0">
                <i><h3 className="text-base/7 font-semibold text-gray-900">Details</h3></i>
                <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal client details.</p>
            </div>
            <div className="mt-6 border p-2 rounded-2xl border-gray-200">
                <dl className="divide-y divide-gray-100">
                    {client?.info && Object.entries(client.info).map(([key, value]) => (
                        <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm/6 font-medium text-gray-900">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <div className="px-4 sm:px-0 flex justify-between">
                <i><h3 className="text-base/7 font-semibold text-gray-900">Activities</h3></i>
                <button className='bg-emerald-400/50 px-4 py-1 text-emerald-500 font-bold rounded-2xl'
                    onClick={() => navigate(`activity/create`)}
                >
                    Add activity
                </button>
            </div>
            {
                activities && activities.map(activity => (
                    <div className="mt-6 border p-6 rounded-2xl border-gray-200 relative">
                        <p className="text-sm/6 font-medium text-gray-900">{activity.name}</p>
                        <p className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Rodzaj: {activity.kind}</p>
                        <p className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Podstawowy czas: {activity.base_duration} min</p>
                        <p className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">Stawka: {activity.base_rate} zł</p>
                        <div className='absolute top-2 right-2 space-x-2'>
                            <FontAwesomeIcon icon={faEdit} size='lg' onClick={() => navigate(`activity/${activity.id}/update`)} />
                            <FontAwesomeIcon icon={faTrashAlt} color='red' size='lg' onClick={() => setActivityToDeleteId(activity.id)} />
                        </div>

                    </div>
                ))
            }
            <div className='place-content-center grid'>
                <button className='bg-red-400/50 px-4 py-1 text-red-500 font-bold rounded-2xl cursor-pointer' onClick={() => setShowDeleteClientDialog(true)}>Delete client</button>
            </div>

        </ClientsLayout>
    )
}
