import { UpdateUserDTO } from "./dto/update-user.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { IUser } from "./interfaces/user.interface";

@Injectable()
export class UserService {
	constructor(@InjectModel("User") private readonly userModel: Model<IUser>) {}

	async getAllUser() {
		const allUser = await this.userModel.find().exec();

		return allUser.map(user => {
			user = user.toObject();

			Reflect.deleteProperty(user, "password");
			Reflect.deleteProperty(user, "__v");
			Reflect.deleteProperty(user, "token");

			return user;
		});
	}

	async findOneByEmail(userCreds) {
		return await this.userModel.findOne({ email: userCreds.email });
	}

	async getUserById(id: string) {
		return await this.userModel.findById(id);
	}

	async setNewUser(createUserDTO: CreateUserDTO) {
		const createdUser = new this.userModel(createUserDTO);
		return await createdUser.save();
	}

	async updateUser(id: string, updateUserDTO: UpdateUserDTO) {
		const fields = {
			password: 0,
			__v: 0,
		};

		return await this.userModel.findByIdAndUpdate(id, updateUserDTO, {
			fields,
			new: true,
		});
	}

	async deleteUser(id: any) {
		return await this.userModel.findByIdAndDelete(id);
	}
}
