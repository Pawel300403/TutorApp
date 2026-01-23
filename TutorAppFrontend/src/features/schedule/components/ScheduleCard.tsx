import React, { useState } from 'react'
import type { Schedule } from '../types'
import Input from '../../../components/ui/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faClock, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import SelectOptions from '../../../components/ui/SelectOptions'
import { addMinutes, format, parse } from 'date-fns'
import { useDeleteSchedule, useUpdateSchedule } from '../api/schedule.api'
import ScheduleDialog from '../../../components/ui/ScheduleDialog'
import DeleteDialog from '../../../components/ui/DeleteDialog'

const STATUS_OPTIONS = [
    { id: "zaplanowano", name: "Zaplanowano" },
    { id: "odbylo sie", name: "Odbyło się" },
    { id: "odwolano", name: "Odwołano" }
]

const ScheduleCard = ({ schedule }: { schedule: Schedule }) => {

    const [selectedStatus, setSelectedStatus] = useState<{ id: string, name: string } | null>(STATUS_OPTIONS.find(s => s.id === schedule.status) ?? null)
    const [open, setOpen] = useState(false)
    const [toggleSwitch, setToggleSwitch] = useState(schedule.amount_paid !== 0)
    const [payment, setPayment] = useState(schedule.amount_paid === schedule.charge ? 'all' : schedule.amount_paid === 0 ? '' : 'partial')
    const [partialPayment, setPartialPAyment] = useState(schedule.amount_paid)
    const [showDialog, setShowDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const { mutate: updateSchedule } = useUpdateSchedule()
    const { mutate: deleteSchedule } = useDeleteSchedule()

    const submitUpdate = () => {
        updateSchedule({
            scheduleId: schedule.id,
            data: {
                status: selectedStatus?.id,
                p_status: toggleSwitch && payment !== '' ? 'zaplacono' : 'nie zaplacono',
                amount_paid: toggleSwitch && payment === 'all' ? schedule.charge : partialPayment
            }
        })
        // console.log({
        //     status: selectedStatus?.id,
        //     p_status: toggleSwitch && payment !== '' ? 'zaplacono' : 'nie zaplacono',
        //     amount_paid: toggleSwitch && payment === 'all' ? schedule.charge : partialPayment
        // })
    }

    return (
        <div className='grid grid-cols-2 text-sm text-gray-400 bg-gray-100 p-2 rounded-md  relative pt-3'>

            <ScheduleDialog show={showDialog} setShow={setShowDialog} editSchedule={schedule} />
            <DeleteDialog
                text='Are you sure to delete schedule'
                closeSignal={() => setShowDeleteDialog(prev => !prev)}
                show={showDeleteDialog}
                deleteFn={() => deleteSchedule(schedule.id)}
            />

            <div className='absolute right-0 -top-3 h-6 w-16 rounded-md bg-gray-300 flex justify-around items-center'>
                <FontAwesomeIcon onClick={() => setShowDialog(true)} icon={faEdit} className='text-white cursor-pointer' />
                <FontAwesomeIcon onClick={() => setShowDeleteDialog(true)} icon={faTrashAlt} className='text-red-500 cursor-pointer' />
            </div>
            <h1 className='text-purple-600 font-semibold '>{schedule.activity.name}</h1>
            <div className='flex items-center justify-end space-x-2'>
                <FontAwesomeIcon icon={faClock} />
                <a>{format(parse(schedule.time, 'HH:mm:ss', new Date()), 'HH:mm')} - {format(addMinutes(parse(schedule.time, 'HH:mm:ss', new Date()), schedule.duration), 'HH:mm')}</a>
            </div>
            <p className='col-span-2'>{schedule.activity.client.name}</p>
            <p className='col-span-2'>Price: {schedule.charge}zł</p>
            {open &&
                <div className='grid grid-cols-2 col-span-2 gap-y-4 items-center border-t border-gray-300 pt-2 mt-2'>
                    <div className='col-span-2 flex items-center space-x-4'>
                        <a className='font-semibold '>Activity status: </a>
                        <SelectOptions
                            data={STATUS_OPTIONS}
                            selected={selectedStatus}
                            setSelected={setSelectedStatus}
                        />
                    </div>
                    <p className='font-semibold'>Payment: </p>
                    <div onClick={() => setToggleSwitch(!toggleSwitch)} className={`h-8 w-16 rounded-full flex items-center place-self-end p-1 cursor-pointer ${toggleSwitch ? 'bg-purple-600' : 'bg-white'} transition duration-300`}>
                        <div className={`bg-white size-6 rounded-full outline-2 outline-purple-600 ${toggleSwitch ? 'translate-x-8' : ''} transition duration-300`} />
                    </div>
                    {toggleSwitch && <>
                        <button className={`mr-2 outline-2 outline-purple-600 rounded-md h-8 ${payment === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} font-semibold cursor-pointer transition duration-300 hover:bg-purple-600 hover:text-white`}
                            onClick={() => setPayment('all')}
                        >
                            All paid
                        </button>
                        <button className={`ml-2 outline-2 outline-purple-600 rounded-md h-8 ${payment === 'partial' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} font-semibold cursor-pointer transition duration-300 hover:bg-purple-600 hover:text-white`}
                            onClick={() => setPayment('partial')}
                        >
                            Partial paid
                        </button>

                        {payment === 'partial' &&
                            <div className='col-span-2'>
                                <Input
                                    label='Amount'
                                    className='bg-white'
                                    type='number'
                                    min={0}
                                    value={partialPayment}
                                    onChange={(e) => setPartialPAyment(Number(e.target.value))}
                                />
                            </div>
                        }
                    </>
                    }
                    <button onClick={submitUpdate} className='col-span-2 font-semibold bg-white text-purple-600 outline-2 outline-purple-600 rounded-md h-8 cursor-pointer transition duration-300 hover:bg-purple-600 hover:text-white active:bg-purple-600 active:text-white'>Save</button>
                </div>
            }
            <div className={`col-span-2 flex items-center justify-center mt-2 ${open ? 'rotate-180' : 'rotate-0'} transition duration-500`}>
                <FontAwesomeIcon icon={faChevronDown} className='cursor-pointer' onClick={() => setOpen(!open)} />
            </div>
        </div>
    )
}

export default ScheduleCard