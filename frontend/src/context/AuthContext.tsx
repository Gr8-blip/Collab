import React, { useState, createContext, useContext, useEffect } from "react";
// @ts-ignore
import { getUserProfile } from "../api/client"

// Token info
interface TokenInfo {
    access: string,
    refresh: string,
}


interface AuthProviderProps {
    children: React.ReactNode;
}

type User = {
    id: number;
    email: string;
}

type AuthContextType = {
    authError: string,
    user: User | null,
    email: string,
    login: (
        tokens: TokenInfo,
        email: string
    ) => Promise<void>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    authInitializing: boolean;
    setAuthError: (error: string) => void
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [authError, setAuthError] = useState("");

    const [email, setEmail] = useState("");
    const [authInitializing, setAuthInitializing] = useState(true);
    const [loading, setLoading] = useState(false);


    const [user, setUser] = useState<User|null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setAuthError("");

            if (!localStorage.getItem("access_token")) {
                setAuthInitializing(false);
                return;
            }

            try {
                const data = await getUserProfile();
                setUser(data);
            } catch (e: any) {
                setAuthError(`Something went wrong! ${e.message || e}`)
            } finally {
                setAuthInitializing(false);
            }
        };

        fetchProfile();
    }, [])

    // Login
    const login = async (tokens: TokenInfo, email: string) => {
        localStorage.setItem("access_token", tokens.access)
        localStorage.setItem("refresh_token", tokens.refresh)
        setEmail(email);

        try {
            const data = await getUserProfile()
            setUser(data);
        } catch (e: any) {
            throw new Error(`Something went wrong! ${e.message || e}`);
        }
    }


    return (
        <AuthContext.Provider value={{ user, login, setLoading, authError, setAuthError, loading, authInitializing, email }}>
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}