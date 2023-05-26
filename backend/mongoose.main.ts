import mongoose from "mongoose";

export type MongoDoc<T> = T & {
	_id: String;
};

export default async function connectDb() {
	try {
		if (mongoose.connections[0].readyState) {
			console.log("already connected");
			return "already connected";
		}
		if (!process.env.MONGO_URI) return "Unable to connect to MongoDB";
		const mongooseInstance = await mongoose.connect(process.env.MONGO_URI, {});
		console.log("connected");
	} catch (error) {
		console.log(error);
		return error;
	}
	return "connected";
}
