import { UpdateUserDTO } from "./dto/update-user.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { Model } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { IUser } from "./interfaces/user.interface";

@Injectable()
export class UserService {
	constructor(@InjectModel("User") private readonly userModel: Model<IUser>) {}

	async getAllUser(id) {
		const allUser = await this.userModel
			.find({ _id: { $ne: id } })
			.populate("roles");

		return allUser.map(user => {
			return user.toProfileJSON();
		});
	}

	async findOneByEmail(userCreds) {
		const foundUser = await this.userModel.findOne({ email: userCreds.email });

		if (!foundUser) {
			throw new NotFoundException("Error User Not Found");
		}

		return foundUser.toProfileJSON();
	}

	async getUserById(id: string) {
		const foundUser = await this.userModel.findById(id);

		if (!foundUser) {
			throw new NotFoundException("Error User Not Found");
		}

		return foundUser.toProfileJSON();
	}

	async setNewUser(createUserDTO: CreateUserDTO) {
		const createdUser = new this.userModel(createUserDTO);
		await createdUser.save();

		return createdUser.toProfileJSON();
	}

	async updateUser(id: string, updateUserDTO: UpdateUserDTO) {
		const updatedUser = await this.userModel.findByIdAndUpdate(
			id,
			updateUserDTO,
			{
				new: true,
			},
		);

		if (!updatedUser) {
			throw new NotFoundException("Error User Not Found");
		}

		return updatedUser.toProfileJSON();
	}

	async deleteUser(id: any) {
		const deletedUser = await this.userModel.findByIdAndDelete(id);

		if (!deletedUser) {
			throw new NotFoundException("Error User Not Found");
		}

		return deletedUser.toProfileJSON();
	}
}
