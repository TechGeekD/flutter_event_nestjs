import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserCredsDTO } from "./dto/user-creds.dto";

import { IJwtPayload } from "./interfaces/jwt-payload.interface";
import { IUser } from "api/user/interfaces/user.interface";

@Injectable()
export class AuthService {
	constructor(@InjectModel("User") private readonly userModel: Model<IUser>) {}

	async ValidateUser(payload: IJwtPayload): Promise<any> {
		const foundUser: IUser = await this.userModel.findById(payload.id);

		return foundUser.toValidateUserJSON();
	}

	async AuthenticateUser(userCreds: UserCredsDTO) {
		const authUser: IUser = await this.userModel.findOne({
			username: userCreds.username,
		});

		const validPassword = authUser.validatePassword(userCreds.password);

		if (validPassword) {
			const userJson = authUser.toAuthJSON();
			await authUser.save();

			return userJson;
		}

		throw new UnauthorizedException();
	}

	async RegisterUser(userCredsDTO: UserCredsDTO) {
		const createdUser = new this.userModel(userCredsDTO);
		await createdUser.setPassword();
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
