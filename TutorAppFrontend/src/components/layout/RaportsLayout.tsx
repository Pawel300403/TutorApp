import React from 'react'

type Props = {
    circleDiagram: React.ReactNode,
    raportsCards: React.ReactNode,
    scheduleTable: React.ReactNode,
    label: React.ReactNode,
    billingSummary: React.ReactNode,
    clientsFilter: React.ReactNode
}

function RaportsLayout({ circleDiagram, raportsCards, scheduleTable, label, billingSummary, clientsFilter }: Props) {
    return (
        <div className='grid md:grid-cols-[auto_1fr] gap-8 justify-center'>
            <div className='md:col-span-2'>
                {label}
            </div>
            <div>
                {circleDiagram}
            </div>
            <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'>
                {raportsCards}
            </div>
            <div className=''>
                    {clientsFilter}
            </div>
            <div className='md:col-span-2'>
                {billingSummary}
            </div>
            <div className='md:col-span-2'>
                {scheduleTable}
            </div>
        </div>
    )
}

export default RaportsLayout