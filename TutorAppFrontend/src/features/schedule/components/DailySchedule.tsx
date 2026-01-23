import { faChevronDown, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addMinutes, format, isToday, isTomorrow, parse } from 'date-fns'
import React, { useState } from 'react'
import type { Schedule } from '../types'
import ScheduleCard from './ScheduleCard'

type Props = {
    selectedDate: Date
    selectedSchedule: Schedule[]
}

const DailySchedule = ({ selectedDate, selectedSchedule }: Props) => {

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4 mt-6'>{isTomorrow(selectedDate) ? 'Tomorrow' : isToday(selectedDate) ? 'Today' : format(selectedDate, 'd MMMM')}</h1>
            {
                selectedSchedule.length > 0 ?
                    selectedSchedule.map((schedule) => (
                        <div className='my-6' key={schedule.id}>
                            <ScheduleCard schedule={schedule} />    
                        </div>
                    ))
                    : <p className='font-semibold text-gray-400'>There are no scheduled activities at the moment</p>
            }
        </div>
    )
}

export default DailySchedule