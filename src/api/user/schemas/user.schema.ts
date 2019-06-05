import * as mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	phoneNo: Number,
	address: String,
	token: String,
});
