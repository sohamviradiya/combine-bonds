"use client";
import { SessionInterfaceWithId, SessionLocalStorage } from "@/types/session.interface";
import { createContext, useContext, useEffect, useState } from "react";
import { createSession, deleteSession } from "@/context/action";

const SessionContext = createContext({
    session: {} as SessionLocalStorage,
    setSession: (session: SessionLocalStorage) => { },
});

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<SessionLocalStorage>({} as SessionLocalStorage);
    useEffect(() => {
        const session = localStorage.getItem("session");
        if (session) {
            setSession(JSON.parse(session));
        }
    }, []);
    useEffect(() => {
        if (session)
            localStorage.setItem("session", JSON.stringify(session));
        else
            localStorage.removeItem("session");
    }, [session]);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export function useAuth() {
    const { session, setSession } = useContext(SessionContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const login = async ({ name, password }: { name: string, password: string }) => {
        const { session, message } = await createSession({ name, password });
        setIsLoading(false);
        if (session) {
            setError("");
            setSession(session);
        }
        else {
            setError(message);
            setSession({} as SessionLocalStorage);
        }
        return {
            session,
            message,
        };
    }

    const logout = async () => {
        await deleteSession({ id: session._id });
        setSession({} as SessionLocalStorage);
    };


    return {
        session,
        login,
        logout,
        isLoading,
        error,
    };
};