import { addMinutes, format, parse } from 'date-fns'
import type { Schedule } from '../../schedule/types'
import { useUpdateSchedule } from '../../schedule/api/schedule.api'

const STATUS_COLOR = [
    { key: "zaplanowano", color: "bg-yellow-300" },
    { key: "odbylo sie", color: "bg-emerald-300" },
    { key: "odwolano", color: "bg-red-300" }
]

type Props = {
    Schedule: Schedule[]
}

const ScheduleTable = ({ Schedule }: Props) => {

    const { mutate: updateSchedule } = useUpdateSchedule()

    return (
        <div className='p-4 md:p-0 flex flex-col ring-2 ring-purple-300 rounded-xl pb-2 divide-y-2 divide-gray-100 min-h-40'>
            <div className='hidden md:grid grid-cols-7 text-center py-3 bg-purple-300 rounded-t-xl text-purple-500 font-semibold'>
                <p>Date</p>
                <p>Time</p>
                <p>Client</p>
                <p>Activity</p>
                <p>Satus</p>
                <p>Amount</p>
                <p>Paid</p>
            </div>

            {
                Schedule.length > 0 &&
                Schedule.map(schedule => (
                    <div className='p-4 md:p-0 grid grid-cols-2 md:grid-cols-1' key={schedule.id}>

                        <div className='md:hidden font-semibold text-gray-400'>
                            <p>Date</p>
                            <p>Time</p>
                            <p>Client</p>
                            <p>Activity</p>
                            <p>Satus</p>
                            <p>Amount</p>
                            <p>Paid</p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-7 bg-white md:py-4 md:mx-2 text-center text-sm'>
                            <p>{schedule.date}</p>
                            <p>{format(parse(schedule.time, 'HH:mm:ss', new Date()), 'HH:mm')} - {format(addMinutes(parse(schedule.time, 'HH:mm:ss', new Date()), schedule.duration), 'HH:mm')}</p>
                            <p>{schedule.activity.client.name}</p>
                            <p>{schedule.activity.name}</p>
                            <p className={`${STATUS_COLOR.find(s => s.key === schedule.status)?.color} rounded-md`}>{schedule.status}</p>
                            <p>{schedule.amount_paid} zł</p>
                            <input
                                type="checkbox"
                                checked={schedule.p_status === "zaplacono"}
                                onChange={(e) => {
                                    const checked = e.target.checked;

                                    updateSchedule({
                                        scheduleId: schedule.id,
                                        data: checked
                                            ? { p_status: "zaplacono", amount_paid: schedule.charge }
                                            : { p_status: "nie zaplacono", amount_paid: 0 },
                                    });
                                }}
                            />
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default ScheduleTable