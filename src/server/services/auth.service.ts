import SessionModel from "@/server/models/session.schema";
import { verifyIDPassword } from "@/server/services/portfolio.service";
import { SessionInterface, SessionInterfaceWithId } from "@/types/session.interface";
import crypto from "crypto";

const SECRET_KEY = process.env.SESSION_SECRET_KEY || "khandar-estrada-khandos-indactu";

function encrypt(text: string) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), crypto.randomBytes(16));
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(text: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), crypto.randomBytes(16));
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

export async function addSession(name: string, password: string) {
    const { portfolio, message } = await verifyIDPassword(name, password);
    if (!portfolio) { return { session: null, message }; }
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 1);
    const newSession = new SessionModel({
        portfolio,
        expiration,
    });
    const session = await newSession.save() as SessionInterfaceWithId;
    const encryptedSessionID = encrypt(session._id);
    return {
        message, session: {
            ...session,
            _id: encryptedSessionID,
        }
    }
};

export async function getSessionById(encryptedSessionID: string) {
    const session_id = decrypt(encryptedSessionID);
    const session = await SessionModel.findById(session_id).exec() as SessionInterfaceWithId;
    if (session.expiration < new Date()) {
        await deleteSessionById(encryptedSessionID);
        return null;
    }
    return {
        ...session,
        _id: encryptedSessionID,
    };
};

export async function deleteSessionById(encryptedSessionID: string) {
    const session_id = decrypt(encryptedSessionID); 
    return await SessionModel.findByIdAndDelete(session_id).exec() as SessionInterface;
};