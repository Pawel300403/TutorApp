import {
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
    useRef,
} from "react";
import { useLogin } from "../features/auth/api/auth.api"
import { api } from "../shared/lib/axiosInstance"
import { jwtDecode } from "jwt-decode"

type LoginPayload = {
    username: string;
    password: string;
};

interface AuthContextProps {
    authenticated: boolean;
    accessToken: string;
    initializing: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    logout(): void;
}

const INITIAL_VALUES: AuthContextProps = {
    authenticated: false,
    accessToken: "",
    initializing: true,
    login: async () => { },
    logout: () => { },
};

export const AuthContext = createContext<AuthContextProps>(INITIAL_VALUES);

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [initializing, setInitializing] = useState(true);

    const { mutateAsync } = useLogin();

    const didBootstrap = useRef(false);

    useEffect(() => {
        if (didBootstrap.current) return;
        didBootstrap.current = true;

        const bootstrap = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/auth/refresh/", {
                    method: "POST",
                    credentials: "include",
                });

                if (!res.ok) {
                    setAccessToken("");
                    setAuthenticated(false);
                    return;
                }

                const data = await res.json();
                setAccessToken(data.access);
                setAuthenticated(true);
            } catch (err) {
                setAccessToken("");
                setAuthenticated(false);
            } finally {
                setInitializing(false);
            }
        };

        bootstrap();
    }, []);

    useEffect(() => {
        const id = api.interceptors.request.use(async (req) => {

            if (accessToken) {

                const { exp } = jwtDecode(accessToken)

                if (exp! < Math.floor(Date.now() / 1000) + 1) {
                    const res = await fetch("http://localhost:8000/api/auth/refresh/", {
                        method: "POST",
                        credentials: "include",
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setAccessToken(data.access)
                        req.headers.Authorization = `Bearer ${data.access}`;
                    } else {
                        setAuthenticated(false)
                    }
                }

            }

            return req;
        });

        return () => {
            api.interceptors.request.eject(id);
        };
    }, [accessToken]);

    const login = async (payload: LoginPayload) => {
        const result = await mutateAsync(payload);
        if (result?.access) {
            setAccessToken(result.access);
            setAuthenticated(true);
        }
    };

    const logout = () => {
        fetch("http://localhost:8000/api/auth/logout/", {
            method: "POST",
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                setAccessToken("");
                setAuthenticated(false);
            })
    };

    if (initializing) {
        return null
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                accessToken,
                initializing,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
