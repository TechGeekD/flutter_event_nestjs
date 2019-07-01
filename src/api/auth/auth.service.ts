import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { RType } from "decorators/roles.decorator";

import { LoginCredsDTO } from "./dto/login-creds.dto";
import { RegisterCredsDTO } from "./dto/register-creds.dto";

import { IJwtPayload } from "./interfaces/jwt-payload.interface";
import { IUser } from "api/user/interfaces/user.interface";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel("User") private readonly userModel: Model<IUser>,
		@InjectModel("Role") private readonly roleModel: Model<IUser>,
	) {}

	async ValidateUser(payload: IJwtPayload): Promise<any> {
		const foundUser: IUser = await this.userModel
			.findById(payload.id)
			.populate("roles");

		return foundUser.toValidateUserJSON();
	}

	async AuthenticateUser(userCreds: LoginCredsDTO) {
		const authUser: IUser = await this.userModel
			.findOne({
				$or: [{ username: userCreds.username }, { email: userCreds.email }],
			})
			.populate("roles");

		if (authUser) {
			const validPassword = authUser.validatePassword(userCreds.password);

			if (validPassword) {
				const userJson = authUser.toAuthJSON();
				await authUser.save();

				return userJson;
			}
		}

		throw new UnauthorizedException();
	}

	async RegisterUser(userCredsDTO: RegisterCredsDTO) {
		const createdUser = new this.userModel(userCredsDTO);
		const role = await this.roleModel
			.findOne({
				roleName: RType.USER_ROLE_NAME,
			})
			.populate("roles");

		await createdUser.setRoleAndPassword(role);
		const userJson = createdUser.toAuthJSON();
		await createdUser.save();

		return userJson;
	}

	async UnAuthenticateUser(id, token) {
		const user: IUser = await this.userModel.findOneAndUpdate(
			{ _id: id, token },
			{ token: null },
			{ new: true },
		);

		return user ? (user.token ? false : true) : false;
	}
}
