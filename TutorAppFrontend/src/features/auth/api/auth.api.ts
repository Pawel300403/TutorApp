import { useMutation } from "@tanstack/react-query";

export interface LoginPayload {
  username: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (user: LoginPayload) => {
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error("Nieprawidłowy login lub hasło");
      }

      return res.json(); // TU ZWRACASZ TOKENY / DANE
    },
  });
}