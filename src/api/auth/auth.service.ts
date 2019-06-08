import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserService } from "api/user/user.service";
import { UserCredsDTO } from "./dto/user-creds.dto";

import { IJwtPayload } from "./interfaces/jwt-payload.interface";
import { IUser } from "api/user/interfaces/user.interface";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private readonly jwtService: JwtService,
		@InjectModel("User") private readonly userModel: Model<IUser>,
	) {}

	async ValidateUser(payload: IJwtPayload): Promise<any> {
		const foundUser: IUser = await this.userModel.findById(payload.id);

		return foundUser.toValidateUserJSON();
	}

	async AuthenticateUser(userCreds: UserCredsDTO) {
		const authedUser: IUser = await this.userModel.findOne({
			username: userCreds.username,
			password: userCreds.password,
		});

		if (authedUser) {
			const userJson = authedUser.toAuthJSON();
			await authedUser.save();

			return userJson;
		}

		throw new UnauthorizedException();
	}

	async RegisterUser(userCredsDTO: UserCredsDTO) {
		const createdUser = new this.userModel(userCredsDTO);

		const userJson = createdUser.toAuthJSON();
		await createdUser.save();

		return userJson;
	}

	async UnAuthenticateUser(token) {
		const id = this.jwtService.verify(token).id;
		const user: IUser = await this.userModel.findOneAndUpdate(
			{ _id: id, token },
			{ token: null },
			{ new: true },
		);

		return user ? (user.token ? false : true) : false;
	}
}
