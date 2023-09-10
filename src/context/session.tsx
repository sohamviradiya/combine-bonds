
import { SessionInterfaceWithId } from "@/types/session.interface";
import { createContext, useContext, useEffect, useState } from "react";
import { createSession, deleteSession } from "./auth";

const SessionContext = createContext({
    session: {} as SessionInterfaceWithId,
    setSession: (session: SessionInterfaceWithId) => { },
});

export default function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<SessionInterfaceWithId>({} as SessionInterfaceWithId);
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
        }
        return {
            session,
            message,
        };
    }

    const logout = async () => { 
        await deleteSession({ id: session._id });
        setSession({} as SessionInterfaceWithId);
    };


    return {
        session,
        login,
        logout,
        isLoading,
        error,
    };
};