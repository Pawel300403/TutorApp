import type { ActivityWithClient } from "../clients/types"

export type Schedule = {
    id: number
    date: string
    time: string
    duration: number
    status: string
    p_status: string
    charge: number
    amount_paid: number
    activity: ActivityWithClient
}