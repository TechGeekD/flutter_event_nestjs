import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserService } from "../user/user.service";
import { UserCredsDTO } from "./dto/user-creds.dto";

import { IJwtPayload } from "./interfaces/jwt-payload.interface";
import { IUser } from "../user/interfaces/user.interface";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private readonly jwtService: JwtService,
		@InjectModel("User") private readonly userModel: Model<IUser>,
	) {}

	async ValidateUser(payload: IJwtPayload): Promise<any> {
		return await this.usersService.getUserById(payload.id);
	}

	async AuthenticateUser(userCreds: UserCredsDTO) {
		const user: IUser = await this.userModel.findOne({
			username: userCreds.username,
			password: userCreds.password,
		});

		const jwtPayload: IJwtPayload = {
			id: user.id,
			username: user.username,
			email: user.email,
		};

		if (user) {
			const token = this.jwtService.sign(jwtPayload);
			this.usersService.updateUser(user.id, { token });
			return { ...jwtPayload, token };
		} else {
			throw new UnauthorizedException();
		}
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
