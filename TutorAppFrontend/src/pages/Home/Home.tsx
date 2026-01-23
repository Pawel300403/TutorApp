import { useState } from "react"
import DailySchedule from "../../features/schedule/components/DailySchedule"
import MonthCalendar from "../../features/schedule/components/MonthCalendar"
import { startOfToday} from "date-fns"
import type { Schedule } from "../../features/schedule/types"


function Home() {

    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule[]>([])

    return (
        <div className='grid md:grid-cols-[1fr_300px] md:gap-x-8'>
            <div >
                <MonthCalendar selectedDate={selectedDate} setSelectedDate={(newDate) => setSelectedDate(newDate)} setSelectedSchedule={(schedule) => setSelectedSchedule(schedule)} />
            </div>
            <div className="order-first md:order-last md:mb-0 mb-8">
                <DailySchedule selectedDate={selectedDate} selectedSchedule={selectedSchedule} />
            </div>
        </div>
    )
}

export default Home