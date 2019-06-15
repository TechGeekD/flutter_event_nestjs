import * as mongoose from "mongoose";

export const RolesSchema = new mongoose.Schema({
	roleName: String,
	roleId: String,
});

RolesSchema.methods.toResponseJSON = function() {
	return {
		roleName: this.roleName,
		roleId: this.roleId,
	};
};
