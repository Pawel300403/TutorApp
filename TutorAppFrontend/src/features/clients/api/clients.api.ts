import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../providers/AuthProvider";
import { api } from "../../../shared/lib/axiosInstance";
import type { Activity, Client } from "../types";

export const useClients = () => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["allclients"],
    enabled: accessToken !== "",
    queryFn: async () => {
      const { data, status } = await api.get("clients/", {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (status !== 200) {
        throw new Error("Nie udało się pobrać klientów");
      }

      return data as Client[];
    },
  });
};

export const useClient = (id: number | null) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["client", id],
    enabled: accessToken !== "" && id !== null,
    queryFn: async () => {
      const { data, status } = await api.get(`client/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (status !== 200) {
        throw new Error("Nie udało się pobrać klientów");
      }

      return data as Client;
    },
  });
}

export const useCreateClient = () => {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Client) => {
      return api.post('newclient/', data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allclients"],
      })
    }
  })

}

export const useUpdateClient = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: Client }) => {
      return api.put(`client/${id}/update/`, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    }
  })

}

export const useDeleteClient = () => {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idClient: number) => {
      return api.delete(`client/${idClient}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allclients"],
      })
    }
  })
}


export const useClientActivities = (id?: number) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["clientActivities", id],
    enabled: accessToken !== "" && id !== undefined,
    queryFn: async () => {
      const { data, status } = await api.get(`client/${id}/activities/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (status !== 200) {
        throw new Error("Nie udało się pobrać aktywności");
      }

      return data as Activity[]
    },
  });

}

export const useClientAcivitiy = (id: number, idActivity?: number) => {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["clientActivity", id, idActivity],
    enabled: accessToken !== "" && idActivity !== undefined,
    queryFn: async () => {
      const { data, status } = await api.get(`client/${id}/activities/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (status !== 200) {
        throw new Error("Nie udało się pobrać klientów");
      }

      return (data as Activity[]).find(activity => activity.id === idActivity)
    },
  });

}

export const useCreateActivity = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: Omit<Activity, "id"> }) => {
      return api.post(`client/${id}/newactivity/`, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    }
  })

}

export const useUpdateActivity = () => {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: ({ idClient, idActivity, data }: { idClient: number, idActivity: number, data: Omit<Activity, "id"> }) => {
      return api.put(`client/${idClient}/activity/${idActivity}/`, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    }
  })
}

export const useDeleteActivity = () => {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ idClient, idActivity }: { idClient: number, idActivity: number }) => {
      return api.delete(`client/${idClient}/activity/${idActivity}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clientActivities", variables.idClient],
      })
    }
  })
}



