import * as mongoose from "mongoose";
import { JwtService } from "@nestjs/jwt";

import config from "config";
import { RType } from "decorators/roles.decorator";

export const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		email: { type: String, required: true },
		firstName: String,
		lastName: String,
		phoneNo: String,
		address: String,
		token: String,
		roles: { type: [String], default: [RType.USER] },
	},
	{
		timestamps: true,
	},
);

UserSchema.methods.validPassword = function(password) {
	// ToDo: enable password encryption
	// let hash = crypto
	// 	.pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
	// 	.toString("hex");
	// return this.hash === hash;
	return this.password === password;
};

UserSchema.methods.setPassword = function(password) {
	// ToDo: enable password encryption
	// this.salt = crypto.randomBytes(16).toString("hex");
	// this.hash = crypto
	// 	.pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
	// 	.toString("hex");
	this.password = password;
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
		roles: this.roles,
	};
};

UserSchema.methods.toAuthJSON = function() {
	return {
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName,
		phoneNo: this.phoneNo,
		email: this.email,
		token: this.generateJWT(),
	};
};

UserSchema.methods.toProfileJSON = function() {
	return {
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName,
		phoneNo: this.phoneNo,
		email: this.email,
		address: this.address,
	};
};
