import { useEffect, useState } from 'react'
import CircleDiagram from '../../features/reports/components/CircleDiagram'
import RaportsCard from '../../features/reports/components/RaportsCard'
import { faCalendarDays, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import RaportsLayout from '../../components/layout/RaportsLayout'
import ScheduleTable from '../../features/reports/components/ScheduleTable'
import Input from '../../components/ui/Input'
import { addMonths, format, parse } from 'date-fns'
import { useMonthSchedule } from '../../features/schedule/api/schedule.api'
import BillingSummary from '../../features/reports/components/BillingSummary'
import SelectOptions from '../../components/ui/SelectOptions'
import { useClients } from '../../features/clients/api/clients.api'
import type { Client } from '../../features/clients/types'
import type { Schedule } from '../../features/schedule/types'
import { useReport } from '../../features/reports/api/reports.api'

const Raports = () => {

    const [date, setDate] = useState(format(new Date(), "yyyy-MM"))
    const [selectedClient, setSelectedClient] = useState<Client | null>({ id: 0, name: "All", info: {} })
    const [clientSchedule, setClietSChedule] = useState<Schedule[]>()

    const { data: Schedule } = useMonthSchedule(addMonths(parse(date + '-01', "yyyy-MM-dd", new Date()), 1))
    const { data: clients } = useClients()
    const { mutate: generateReport } = useReport()

    useEffect(() => {
        setClietSChedule(selectedClient?.id ? Schedule?.filter(s => s.activity.client.id == selectedClient.id) : Schedule)
    }, [Schedule, selectedClient])

    const earnings = (): number => {
        let earnings = 0

        if (Schedule) {
            Schedule.map(s => earnings += s.amount_paid)
        }
        return earnings
    }

    const targetEarnings = (): number => {
        let targetEarnings = 0

        if (Schedule) {
            Schedule.map(s => targetEarnings += s.charge)
        }

        return targetEarnings
    }

    return (
        <RaportsLayout
            label={
                <div className='flex justify-between pb-4 border-b-2 border-gray-100'>
                    <h1 className='text-2xl font-bold text-purple-500'>Monthly Overview</h1>
                    <div>
                        <Input
                            type='month'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
            }

            circleDiagram={
                <CircleDiagram
                    title='Earnings'
                    value={earnings()}
                    max={targetEarnings() !== 0 ? targetEarnings() : 1}
                    size={250}
                    thickness={10}
                />
            }

            raportsCards={
                <>
                    <RaportsCard
                        title='Completed activities'
                        value={Schedule?.filter(s => s.status === 'odbylo sie').length ?? 0}
                        icon={faCircleCheck}
                        iconStyle='text-emerald-400 text-2xl'
                    />
                    <RaportsCard
                        title='Planned activities'
                        value={Schedule?.length ?? 0}
                        icon={faCalendarDays}
                        iconStyle='text-yellow-400 text-2xl'
                    />
                    <RaportsCard
                        title='Canceled activities'
                        value={Schedule?.filter(s => s.status === 'odwolano').length ?? 0}
                        icon={faCircleXmark}
                        iconStyle='text-red-400 text-2xl'
                    />
                </>
            }

            clientsFilter={
                <SelectOptions
                    data={[{ id: 0, name: "All", info: {} }].concat(clients ?? [])}
                    selected={selectedClient}
                    setSelected={setSelectedClient}
                    label='Client'
                />
            }

            billingSummary={
                <BillingSummary
                    schedule={clientSchedule ?? []}
                    clientName={selectedClient?.name!!}
                    generateReport={() => generateReport({ client_id: selectedClient?.id!!, month: date })}
                />
            }

            scheduleTable={
                <ScheduleTable
                    Schedule={clientSchedule ?? []}
                />
            }
        />
    )
}

export default Raports