import React, { useEffect, useState } from "react";
import type { Schedule } from "../../schedule/types";

type BillingSummaryCardProps = {
    schedule: Schedule[],
    clientName: string,
    generateReport(): void
}

export default function BillingSummary({ schedule, clientName, generateReport }: BillingSummaryCardProps) {

    const [scheduleTable, setScheduleTable] = useState<Schedule[]>(schedule)

    useEffect(() => {
        setScheduleTable(schedule)
    }, [schedule])

    const lessons = (): number => {
        let lessons = 0
        scheduleTable.map(s => s.status === 'odbylo sie' && (lessons += s.duration / s.activity.base_duration))
        return lessons
    }

    const paid = (): number => {
        let paid = 0
        scheduleTable.map(s => paid += s.amount_paid)
        return paid
    }

    const outstanding = (): number => {
        let outstanding = 0
        scheduleTable.map(s => s.status !== 'odwolano' && (outstanding += s.charge - s.amount_paid))
        return outstanding
    }

    return (
        <section className="bg-white ring-2 ring-purple-300 rounded-xl p-6 relative">
            <div className="grid gap-6">
                {/* Left */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900">Billing summary - {clientName}</h2>
                    <div className="mt-4 h-0.5 bg-gray-100" />

                    <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 text-sm">
                        {/* <div className="text-gray-400 font-medium">Lessons:</div>
                        <div className="text-gray-900 font-semibold text-lg">
                            {lessons()}
                        </div> */}

                        <div className="text-gray-400 font-medium">Paid:</div>
                        <div className="font-semibold text-lg text-emerald-400">
                            {paid()}
                        </div>

                        <div className="text-gray-400 font-medium">Outstanding:</div>
                        <div className="font-semibold text-lg text-red-400">
                            {outstanding()}
                        </div>
                    </div>

                    <div className="mt-5 h-0.5 bg-gray-100" />

                    <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-x-8">
                        <div className="text-gray-700 font-semibold text-base">Total:</div>
                        <div className="text-purple-500 font-bold text-2xl">
                            {paid() + outstanding()}
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div className="shrink-0 place-self-center md:absolute md:top-4 md:right-4">
                    <button
                        type="button"
                        onClick={generateReport}
                        disabled={clientName === 'All'}
                        className={[
                            "h-10 px-6 rounded-xl font-semibold text-white",
                            "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
                            "shadow-sm transition-colors",
                            "disabled:opacity-30 disabled:cursor-not-allowed",
                            "whitespace-nowrap",
                            "cursor-pointer"
                        ].join(" ")}
                    >
                        {false ? "Generating..." : "Generate raport PDF"}
                    </button>
                </div>
            </div>
        </section>
    );
}
