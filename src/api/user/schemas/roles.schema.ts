import * as mongoose from "mongoose";

export const RolesSchema = new mongoose.Schema({
	roleName: String,
	roleId: String,
});
