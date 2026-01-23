export type Client = {
    id: number
    name: string
    info: Record<string, any>
}

export type Activity = {
    id: number
    name: string
    kind: string
    base_duration: number
    base_rate: number
}

export type ActivityWithClient = Activity & { client: Client };