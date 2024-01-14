import { User } from "@/types/portfolio.interface";
import { ObjectId } from "mongoose";

export type SessionInterface = {
    portfolio: string | ObjectId,
    expiration: Date,
}

export type SessionInterfaceWithId = SessionInterface & {
    _id: string,
}

export type SessionLocalStorage = {
    portfolio: string,
    expiration: Date,
    _id: string,
}

export type SessionValues = {
    portfolio: {
        user: User
    }
    expiration: Date,
}
