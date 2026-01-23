import React, { useEffect, useState } from 'react'
import {
    previousMonday,
    nextSunday,
    isMonday,
    isSunday,
    endOfMonth,
    eachDayOfInterval,
    format,
    addMonths,
    isToday,
    isSameDay,
    isSameMonth
} from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useMonthSchedule } from '../api/schedule.api'
import type { Schedule } from '../types'
import ScheduleDialog from '../../../components/ui/ScheduleDialog'

type Props = {
    setSelectedDate: (date: Date) => void
    setSelectedSchedule: (schedule: Schedule[]) => void
    selectedDate: Date
}

type Calendar = {
    day: Date
    schedule?: Schedule[]
}

const MonthCalendar = ({ selectedDate, setSelectedDate, setSelectedSchedule }: Props) => {

    const [date, setDate] = useState(new Date())
    const [calendar, setCalendar] = useState<Calendar[]>()
    const [showDialog, setShowDialog] = useState(false)

    const { data: monthSchedule } = useMonthSchedule(date)

    const daysInMonthView = (month: number, year: number) => {

        const start = new Date(year, month, 1)
        const end = endOfMonth(start)

        const startInterval = isMonday(start) ? start : previousMonday(start)
        const endInterval = isSunday(end) ? end : nextSunday(end)

        return eachDayOfInterval({
            start: startInterval,
            end: endInterval
        })
    }

    useEffect(() => {
        setCalendar(
            daysInMonthView(date.getMonth(), date.getFullYear())
                .map(day => ({
                    day: day,
                    schedule: monthSchedule?.filter(s => isSameDay(new Date(s.date), day))
                })))

        if (isToday(selectedDate) && isSameMonth(selectedDate, date)) {
            setSelectedSchedule(monthSchedule?.filter(s => isSameDay(new Date(s.date), selectedDate)) ?? [])
        }

    }, [date, monthSchedule])

    return (
        <div className='md:px-4'>

            <ScheduleDialog show={showDialog} setShow={setShowDialog} />

            <div className='flex justify-between items-center my-5'>

                <div className='flex items-center space-x-4'>
                    <p className='font-bold text-2xl text-purple-500 w-30 md:w-48'>{format(date, 'LLLL yyyy')}</p>
                    <FontAwesomeIcon icon={faAngleLeft} className='bg-purple-300 p-1 px-0.5 rounded-full text-purple-600 cursor-pointer' onClick={() => setDate(addMonths(date, -1))} />
                    <FontAwesomeIcon icon={faAngleRight} className='bg-purple-300 p-1 px-0.5 rounded-full text-purple-600 cursor-pointer' onClick={() => setDate(addMonths(date, 1))} />
                </div>

                <button className='font-semibold text-purple-500 bg-purple-300 px-2 rounded-md cursor-pointer' onClick={() => setShowDialog(true)}>
                    <FontAwesomeIcon icon={faPlus} size='xs' />
                    Add
                </button>
            </div>

            <div className='mb-2 grid grid-cols-7 border-b border-gray-300 text-center md:text-sm text-[12px] font-semibold'>
                <p>Mon</p>
                <p>Tue</p>
                <p>Wed</p>
                <p>Thu</p>
                <p>Fri</p>
                <p className='text-red-500'>Sat</p>
                <p className='text-red-500'>Sun</p>
            </div>

            <div className='grid grid-cols-7 grid-rows-6 gap-1'>
                {calendar && calendar.map((c, index) => (
                    <div className='hover:bg-gray-100 active:bg-gray-100 rounded-md cursor-pointer'
                        key={index}
                        onClick={() => {
                            setSelectedDate(c.day)
                            setSelectedSchedule(c.schedule ?? [])
                        }}>
                        <p className={
                            `aspect-square w-7 mb-0.5
                            flex justify-center items-center
                            md:text-base text-sm md:font-semibold 
                            ${c.day.getMonth() === date.getMonth() ? 'text-black' : 'text-gray-300'}
                            ${isToday(c.day) ? 'bg-purple-300 rounded-full' : ''}
                            `} >
                            {c.day.getDate()}
                        </p>
                        <div className={`flex flex-col space-y-1 h-[74px]`}>
                            {
                                c.schedule && c.schedule.slice(0, 3).map((s, index) => (
                                    <div key={index} className='truncate bg-amber-200 rounded-sm px-1 text-[10px]'>{s.activity.name}</div>
                                ))
                            }
                            {
                                c.schedule && c.schedule.length > 3 ? < p className='text-[10px] text-center'>{`+${c.schedule.length - 3}`}</p> : <></>

                            }
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default MonthCalendar