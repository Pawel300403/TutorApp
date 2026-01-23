import React, { useEffect, useState, type FormEvent } from 'react'
import Input from '../../../components/ui/Input'
import type { Activity } from '../types'
import { useClientAcivitiy, useCreateActivity, useUpdateActivity } from '../api/clients.api'
import SuccessDialog from '../../../components/ui/SuccessDialog'
import { useNavigate } from 'react-router'

type FormProps = {
    idActivity?: number
    idClient: number
    method: 'Create' | 'Update'
}

const ActivityForm = ({ idActivity, idClient, method }: FormProps) => {

    const { data: clientActivity } = useClientAcivitiy(idClient, idActivity)

    const [activity, setActivity] = useState<Partial<Omit<Activity, "id">>>()

    const { mutate: createActivity } = useCreateActivity()
    const { mutate: updateActivity } = useUpdateActivity()
    const [showDialog, setShowDialog] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (clientActivity) {
            setActivity({
                name: clientActivity?.name,
                kind: clientActivity?.kind,
                base_duration: clientActivity?.base_duration,
                base_rate: clientActivity?.base_rate
            })
        }

    }, [clientActivity])


    const handleSubmit = (e: FormEvent) => {
        setShowDialog(true)
        e.preventDefault()
        if (method === 'Create') {
            createActivity({ id: idClient, data: activity as Omit<Activity, "id"> })

        } else {
            updateActivity({
                idClient: idClient,
                idActivity: clientActivity!.id,
                data: activity as Omit<Activity, "id">
            })
        }
        setTimeout(() => {
            navigate(-1)
        }, 1500)
    }

    return (

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

            <SuccessDialog show={showDialog} text={method + ' activity successful'} />

            <h1 className='font-bold text-2xl text-purple-400'>{method} activity</h1>
            <Input
                label='Name'
                required
                value={activity?.name ?? ""}
                onChange={(e) => setActivity({ ...activity, name: e.target.value })}
            />
            <Input
                label='Kind'
                required
                value={activity?.kind ?? ""}
                onChange={(e) => setActivity({ ...activity, kind: e.target.value })}
            />
            <Input
                label='Base duration (in minutes)'
                required
                type='number'
                value={activity?.base_duration ?? ""}
                onChange={(e) => setActivity({ ...activity, base_duration: Number(e.target.value) })}
            />
            <Input
                label='Base rate'
                required
                type='number'
                value={activity?.base_rate ?? ""}
                onChange={(e) => setActivity({ ...activity, base_rate: Number(e.target.value) })}
            />
            <button className='my-8 bg-emerald-400/50 px-4 py-1 text-emerald-500 font-bold rounded-2xl cursor-pointer'>
                {
                    method === 'Create' ? 'Create activity' : 'Save'
                }
            </button>
        </form >

    )
}

export default ActivityForm
