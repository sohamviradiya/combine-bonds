import SessionModel from "@/server/models/session.schema";
import { verifyIDPassword } from "@/server/services/portfolio.service";
import { SessionInterface, SessionInterfaceWithId, SessionLocalStorage } from "@/types/session.interface";

// const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
// const initVector = crypto.randomBytes(16);

// const cipher = crypto.createCipheriv(algorithm, key, initVector);
// const decipher = crypto.createDecipheriv(algorithm, key, initVector);



const encrypt = (text: string) => {
    return text;
};

const decrypt = (text: string) => {
    // let decrypted = decipher.update(text, 'hex', 'utf-8');
    // decrypted += decipher.final('utf-8');
    return text;
};

export const addSession = async (name: string, password: string) => {
    const { portfolio, message } = await verifyIDPassword(name, password);
    if (!portfolio) { return { session: null, message }; }
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 1);
    try {
        await SessionModel.findOneAndDelete({ portfolio }).exec();

        const newSession = new SessionModel({
            portfolio,
            expiration,
        });
        const session_document = await newSession.save();
        return {
            message,
            session: {
                _id: encrypt(String(session_document._id)),
                portfolio: session_document.portfolio.toString(),
                expiration: session_document.expiration,
            } as SessionLocalStorage,
        };
    }
    catch (err: any) {
        return { session: null, message: err.message };
    }
};

export const getSessionById = async (encryptedSessionID: string) => {
    const session_id = decrypt(encryptedSessionID);
    const session = await SessionModel.findById(session_id).exec();
    if (!session) return null;
    if (new Date(session.expiration) < new Date()) {
        await deleteSessionById(encryptedSessionID);
        return null;
    }

    return {
        _id: encryptedSessionID,
        portfolio: session.portfolio.toString(),
        expiration: session.expiration,
    };
};

export const deleteSessionById = async (encryptedSessionID: string) => {
    const session_id = decrypt(encryptedSessionID);
    return await SessionModel.findByIdAndDelete(session_id).exec() as SessionInterface;
};