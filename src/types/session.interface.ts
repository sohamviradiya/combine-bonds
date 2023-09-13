import { User } from "@/types/portfolio.interface";

export type SessionInterface = {
    portfolio: string,
    expiration: Date,
}

export type SessionInterfaceWithId = SessionInterface & {
    _id: string,
}

export type SessionValues = {
    portfolio: {
        user: User
    }
    expiration: Date,
}
