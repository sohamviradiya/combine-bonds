"use server";

import { addSession, deleteSessionById, getSessionById } from "@/server/services/auth.service";

export async function createSession({ name, password }: { name: string, password: string }) {
    return await addSession(name, password);
};

export async function getSession({ id }: { id: string }) {
    return await getSessionById(id);
};

export async function deleteSession({ id }: { id: string }) {
    return await deleteSessionById(id);
};


