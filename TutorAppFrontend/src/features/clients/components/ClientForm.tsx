import React, { useEffect, useState } from 'react'
import Input from '../../../components/ui/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faCross, faXmark } from '@fortawesome/free-solid-svg-icons'
import type { Client } from '../types'
import { useClient, useCreateClient, useUpdateClient } from '../api/clients.api'
import { useNavigate } from 'react-router'

type KeyValuePair = {
    key: string
    value: string
}

type FormParams = {
    method: 'Create' | 'Update'
    idClient?: number
}

const ClientForm = ({ method, idClient }: FormParams) => {

    const [name, setName] = useState<string>()
    const [pairs, setPairs] = useState<KeyValuePair[]>([{ key: "", value: "" }])
    const { mutate: createClient } = useCreateClient()
    const { mutate: updateClient } = useUpdateClient()
    const { data: client } = useClient(idClient || null)
    const navigate = useNavigate()

    useEffect(() => {
        if (client) {
            setPairs(
                Object.entries(client.info).map(([key, value]) => ({
                    key,
                    value: String(value),
                }))
            );
        }

    }, [client])

    const handleEditPair = (index: number, field: "key" | "value", value: string) => {
        setPairs((prev) =>
            prev.map((pair, i) =>
                i === index ? { ...pair, [field]: value } : pair
            )
        )
    }

    const addPair = () => {
        setPairs((prev) => [...prev, { key: "", value: "" }]);
    }

    const removePair = (index: number) => {
        setPairs((prev) => prev.filter((_, i) => i !== index));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const info = pairs.reduce<Record<string, string>>((acc, pair) => {
            if (pair.key) acc[pair.key] = pair.value
            return acc
        }, {})

        const data = {
            name: name || client?.name,
            info: info
        } as Client

        if (method === 'Create')
            createClient(data)
        else
            updateClient({ id: idClient!, data: data })
        setName('')
        setPairs([{ key: "", value: "" }])

        navigate('/clients')
    }

    return (
        <form className='grid grid-cols-2 gap-4' onSubmit={handleSubmit}>
            <h1 className='col-span-2 font-bold text-2xl text-purple-400'>{method} client</h1>
            <div className='col-span-2'>
                <Input label='Name'
                    required value={name}
                    onChange={(e) => setName(e.target.value)}
                    defaultValue={client?.name || ""}
                />
            </div>
            <p className="col-span-2 text-sm font-medium text-gray-700">Extra info</p>

            {
                pairs.map((pair, index) => (
                    <div key={index} className='col-span-2 grid grid-cols-[1fr_1fr_20px] gap-x-2 items-center'>
                        <Input
                            value={pair.key}
                            onChange={(e) =>
                                handleEditPair(index, "key", e.target.value)
                            }
                        />
                        <Input
                            value={pair.value}
                            onChange={(e) =>
                                handleEditPair(index, "value", e.target.value)
                            }
                        />
                        <FontAwesomeIcon icon={faXmark} color='red' onClick={() => removePair(index)} className='cursor-pointer' />
                    </div>
                ))
            }

            <FontAwesomeIcon icon={faCirclePlus} size='2x' className='col-span-2 place-self-center cursor-pointer' onClick={addPair} />

            <button className='my-8 col-span-2 bg-emerald-400/50 px-4 py-1 text-emerald-500 font-bold rounded-2xl cursor-pointer'>
            {
                method === 'Create' ? 'Create client' : 'Save'
            }
            </button>
        </form>
    )
}

export default ClientForm