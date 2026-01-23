import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../providers/AuthProvider";
import { api } from "../../../shared/lib/axiosInstance";

export const useReport = () => {
    const { accessToken } = useAuth()

    return useMutation({
        mutationFn: (data: { client_id: number, month: string }) => {
            return api.post('report/', data, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
        },
        onSuccess: (res) => {
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            window.open(url)
        }
    })
}