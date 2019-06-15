import * as mongoose from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import * as argon2 from "argon2";

import config from "config";

export const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		salt: { type: String },
		email: { type: String, required: true },
		firstName: String,
		lastName: String,
		phoneNo: String,
		address: String,
		token: String,
		roles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Role",
			},
		],
	},
	{
		timestamps: true,
	},
);

UserSchema.methods.validatePassword = async function(password) {
	const validPassword = await argon2.verify(this.password, password);

	return validPassword;
};

UserSchema.methods.setRoleAndPassword = async function(role) {
	this.roles = [role];
	const salt = randomBytes(32);
	const hashedPassword = await argon2.hash(this.password, { salt });

	this.salt = salt.toString("hex");
	this.password = hashedPassword;
};

UserSchema.methods.generateJWT = function() {
	const jwtService = new JwtService({
		secret: config.jwtSecret,
		signOptions: {
			expiresIn: 3600,
		},
	});

	return (this.token = jwtService.sign({
		id: this._id,
		username: this.username,
		email: this.email,
		roles: this.roles,
	}));
};

UserSchema.methods.toValidateUserJSON = function() {
	if (!this.token) {
		return null;
	}

	return {
		id: this._id,
		username: this.username,
		email: this.email,
		roles: this.roles.map(role => role.toResponseJSON()),
	};
};

UserSchema.methods.toAuthJSON = function() {
	return {
		id: this._id,
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName,
		phoneNo: this.phoneNo,
		email: this.email,
		token: this.generateJWT(),
		roles: this.roles.map(role => role.toResponseJSON()),
	};
};

UserSchema.methods.toProfileJSON = function() {
	return {
		id: this._id,
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName,
		phoneNo: this.phoneNo,
		email: this.email,
		address: this.address,
	};
};
