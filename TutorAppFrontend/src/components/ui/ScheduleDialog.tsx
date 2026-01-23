import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import SelectOptions from './SelectOptions'
import { useClientActivities, useClients } from '../../features/clients/api/clients.api'
import { type Activity, type Client } from '../../features/clients/types'
import Input from './Input'
import { add, format, isBefore, isEqual, type Duration } from 'date-fns'

import { useCreateSchedule, useUpdateSchedule } from '../../features/schedule/api/schedule.api'
import type { Schedule } from '../../features/schedule/types'

type Props = {
    show: boolean
    setShow: (value: boolean) => void,
    editSchedule?: Schedule
}

type RecurrenceOption = {
    id:
    | "never"
    | "daily"
    | "weekdays"
    | "weekly"
    | "biweekly"
    | "monthly"
    name: string
    duration: Duration
    intervalFn: (start: Date, end: Date) => void
}

const RECURRENCEOPTIONS = [
    { id: "never", name: "One-time", duration: { days: 0 } },
    { id: "daily", name: "Daily", duration: { days: 1 } },
    { id: "weekly", name: "Weekly", duration: { weeks: 1 } },
    // { id: "biweekly", name: "Every two weeks", duration: { weeks: 2 } },
    { id: "monthly", name: "Monthly", duration: { months: 1 } },
] as RecurrenceOption[]

const ScheduleDialog = ({ show, editSchedule, setShow }: Props) => {

    const [selectedClient, setSelectedClient] = useState<Client | null>(editSchedule?.activity.client ?? null)
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(editSchedule?.activity as Activity ?? null)
    const { data: Clients } = useClients()
    const { data: Activities } = useClientActivities(selectedClient?.id)
    const { mutate: createSchedule } = useCreateSchedule()
    const { mutate: updateSchedule } = useUpdateSchedule()
    const [duration, setDuration] = useState<number>(editSchedule?.duration ?? 0)
    const [date, setDate] = useState<string>(editSchedule?.date ?? format(new Date(), 'yyyy-MM-dd'))
    const [time, setTime] = useState<string>(editSchedule?.time ?? format(new Date(), 'HH:mm'))
    const [recurrence, setRecurrence] = useState<RecurrenceOption | null>(RECURRENCEOPTIONS[0])
    const [endDate, setEndDate] = useState<string>('')

    useEffect(() => {
        if (!editSchedule)
            setSelectedActivity(null)
    }, [selectedClient])

    useEffect(() => {
        if (selectedActivity)
            setDuration(selectedActivity.base_duration)
        else
            setDuration(0)
    }, [selectedActivity])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editSchedule) {

            if (recurrence && selectedActivity?.id) {

                let schedule = []

                if (recurrence.id === 'never') {

                    schedule.push({
                        date: date,
                        time: time,
                        duration: duration,
                        status: 'zaplanowano',
                        p_status: 'nie zaplacono'
                    })

                } else {
                    let currentDate = new Date(date)
                    while (isBefore(currentDate, new Date(endDate)) || isEqual(currentDate, new Date(endDate))) {

                        schedule.push({
                            date: format(currentDate, 'yyyy-MM-dd'),
                            time: time,
                            duration: duration,
                            status: 'zaplanowano',
                            p_status: 'nie zaplacono'
                        })

                        currentDate = add(currentDate, recurrence?.duration)
                    }
                }

                createSchedule({ activityId: selectedActivity.id, data: schedule })
            }

        } else {
            updateSchedule({
                scheduleId: editSchedule.id,
                data: {
                    date: date,
                    time: time,
                    duration: duration
                }
            })
        }
    }

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [show]);

    return (
        <div className={`fixed inset-0 z-50 flex justify-center md:items-center items-end md:bg-white/80 transition-all duration-500 ease-out
                            ${show ? 'md:opacity-100 pointer-events-auto' : 'md:opacity-0 pointer-events-none'}
                        `}>
            <div className={`md:w-100 p-2 w-full md:h-3/5 h-11/12 bg-white md:rounded-2xl rounded-t-2xl shadow-xl border-2 border-gray-200
                            transition-transform duration-300 ease-out
                            ${show ? "translate-y-0" : "md:translate-y-8 translate-y-full"}
                        `}>
                <div className='overflow-y-auto h-full p-2'>

                    <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-4'>
                        <div className='flex justify-end items-center w-full'>
                            <FontAwesomeIcon icon={faXmark} className='cursor-pointer' onClick={() => setShow(false)} />
                        </div>

                        <Input
                            label='Date'
                            type='date'
                            required
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            max={format(add(new Date(), { years: 5 }), 'yyyy-MM-dd')}
                            className='text-black'
                        />
                        <Input
                            label='Time'
                            type='time'
                            required
                            step={300}
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className='text-black'
                        />
                        {!editSchedule &&
                            <>
                                <SelectOptions label='Clients' data={Clients ?? []} selected={selectedClient} setSelected={setSelectedClient} />
                                <SelectOptions label='Activities' data={Activities ?? []} selected={selectedActivity} setSelected={setSelectedActivity} />
                            </>
                        }
                        <Input
                            label='Duration (min)'
                            type='number'
                            min={selectedActivity?.base_duration ?? 0}
                            step={selectedActivity?.base_duration ?? 1}
                            value={duration}
                            onChange={e => setDuration(Number(e.target.value))}
                            required
                            className='text-black'
                        />
                        {!editSchedule &&
                            <SelectOptions label='Repeat' data={RECURRENCEOPTIONS} selected={recurrence} setSelected={setRecurrence} />
                        }
                        {recurrence?.id !== 'never' &&
                            <Input
                                label='Repeat to'
                                type='date'
                                value={endDate}
                                min={format(new Date(), 'yyyy-MM-dd')}
                                max={format(add(new Date(), { years: 5 }), 'yyyy-MM-dd')}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        }
                        <button className='my-8 bg-emerald-400/50 px-4 py-1 text-emerald-500 font-bold rounded-2xl cursor-pointer'>
                            {!editSchedule ? 'Add to schedule' : 'Save'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ScheduleDialog