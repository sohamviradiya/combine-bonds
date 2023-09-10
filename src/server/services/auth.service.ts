import SessionModel from "@/server/models/session.schema";
import { verifyIDPassword } from "@/server/services/portfolio.service";
import { SessionInterface } from "@/types/session.interface";

export async function createSession(name: string, password: string) {
    const { portfolio, message } = await verifyIDPassword(name, password);
    if (!portfolio) { return { session: null, message }; }
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 1);
    const newSession = new SessionModel({
        portfolio,
        expiration,
    });
    const session = await newSession.save() as SessionInterface;

    return { session, message };
}

export async function getSessionById(_id: string) {
    return await SessionModel.findById(_id).exec() as SessionInterface;
};