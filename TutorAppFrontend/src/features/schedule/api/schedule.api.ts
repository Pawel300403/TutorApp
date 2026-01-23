import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../../../providers/AuthProvider"
import { api } from "../../../shared/lib/axiosInstance"
import type { Schedule } from "../types"

export const useMonthSchedule = (date: Date) => {

    const { accessToken } = useAuth()

    return useQuery({
        queryKey: ['monthSchedule', date],
        queryFn: async () => {
            const { data, status } = await api.get("schedule/month/", {
                params: {
                    date: date.toISOString().slice(0, 10)
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (status !== 200) {
                throw new Error("Nie udało się pobrać planu");
            }

            return data as Schedule[]
        }
    })
}

export const useDailySchedule = () => {

    const { accessToken } = useAuth()

    return useQuery({
        queryKey: ['dailySchedule'],
        queryFn: async () => {
            const { data, status } = await api.get("schedule/today/", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (status !== 200) {
                throw new Error("Nie udało się pobrać planu");
            }

            return data as Schedule[]
        }
    })
}

export const useCreateSchedule = () => {
    const { accessToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ activityId, data }: { activityId: number, data: Pick<Schedule, 'date' | 'time' | 'duration' | 'status' | 'p_status'>[] }) => {
            return api.post(`schedule/${activityId}/`, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['monthSchedule']
            })
        }
    })
}

export const useUpdateSchedule = () => {
    const { accessToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ scheduleId, data }: { scheduleId: number, data: Partial<Schedule> }) => {
            return api.patch(`schedule/edit/${scheduleId}/`, data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['monthSchedule', new Date(variables.data.date!!)]
            })
        }
    })
}

export const useDeleteSchedule = () => {
    const { accessToken } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (scheduleId: number) => {
            return api.delete(`schedule/delete/${scheduleId}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['monthSchedule']
            })
        }
    })
}