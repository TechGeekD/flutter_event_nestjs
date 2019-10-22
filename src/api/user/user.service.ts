import {
	Injectable,
	NotFoundException,
	ConflictException,
} from "@nestjs/common";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { CreateUserDTO, IUser } from "./dto/create-user.dto";
import { ITeam, CreateTeamDTO, UpdateTeamDTO } from "./dto/team.dto";
import { IMatchResult } from "api/match/dto/create-match-result.dto";

@Injectable()
export class UserService {
	constructor(
		@InjectModel("User") private readonly userModel: Model<IUser>,
		@InjectModel("Team") private readonly teamModel: Model<ITeam>,
		@InjectModel("MatchResult")
		private readonly matchResultModel: Model<IMatchResult>,
	) {}

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

	async getAllTeam() {
		const foundTeam = await this.teamModel
			.find()
			.populate("user")
			.populate("teamMembers.member");

		if (!foundTeam) {
			throw new NotFoundException("Error User Not Found");
		}

		return foundTeam.map(team => team.toResponseJSON());
	}

	async getTeamById(id: string) {
		// const foundTeam = await this.teamModel.findById(id);

		const teamResult = await this.matchResultModel
			.aggregate([
				{
					$match: { participantId: Types.ObjectId(id) },
				},
			])
			.lookup({
				from: "teams",
				localField: "participantId",
				foreignField: "_id",
				as: "teamDetails",
			})
			.unwind("$teamDetails")
			.project({
				teamDetails: {
					teamMembers: 0,
					user: 0,
					__v: 0,
					createdAt: 0,
					updatedAt: 0,
				},
			})
			.unwind("$teamMemberResult")
			.group({
				_id: "$teamMemberResult.member",
				status: {
					$first: "$status",
				},
				memberOverview: {
					$first: {
						runs: {
							$sum: {
								$toInt: "$teamMemberResult.value",
							},
						},
						balls: {
							$sum: {
								$toInt: "$teamMemberResult.extraValues.ball",
							},
						},
						the4s: {
							$sum: {
								$toInt: "$teamMemberResult.extraValues.4s",
							},
						},
						the6s: {
							$sum: {
								$toInt: "$teamMemberResult.extraValues.6s",
							},
						},
						wickets: {
							$sum: {
								$toInt: "$teamMemberResult.extraValues.wickets",
							},
						},
						maidens: {
							$sum: {
								$toInt: "$teamMemberResult.extraValues.maiden",
							},
						},
					},
				},
				teamDetails: { $first: "$teamDetails" },
			})
			.lookup({
				from: "users",
				localField: "_id",
				foreignField: "_id",
				as: "member",
			})
			.unwind("$member")
			.project({
				member: {
					_id: 0,
					__v: 0,
					createdAt: 0,
					updatedAt: 0,
					roles: 0,
					salt: 0,
					password: 0,
					token: 0,
				},
			})
			.group({
				_id: "$teamDetails._id",
				teamDetails: { $first: "$teamDetails" },
				status: { $push: "$status" },
				teamMembers: {
					$push: {
						details: "$member",
						overview: "$memberOverview",
					},
				},
			})
			.project({
				teamDetails: {
					_id: 0,
				},
			});

		if (!teamResult) {
			throw new NotFoundException("Error User Not Found");
		}

		teamResult.forEach(result => {
			result.teamOverview = {};

			result.status.forEach(element => {
				if (!(element in result.teamOverview)) {
					result.teamOverview[element] = 0;
				}

				Object.keys(result.teamOverview).forEach(key => {
					if (element === key) {
						result.teamOverview[key] += 1;
					}
				});
			});

			delete result.status;
		});

		return teamResult[0];
	}

	async getTeamByUserId(id: any) {
		const foundTeam = await this.teamModel
			.find({ user: id })
			.populate("user")
			.populate("teamMembers.member");

		if (!foundTeam) {
			throw new NotFoundException("Error User Not Found");
		}

		return foundTeam.map(team => team.toResponseJSON());
	}

	async createTeam(createTeamDTO: CreateTeamDTO) {
		const createdTeam = new this.teamModel(createTeamDTO);
		await createdTeam.save();

		return createdTeam.toResponseJSON();
	}

	async updateTeam(
		teamId: string,
		updateTeamDTO: UpdateTeamDTO,
		currentUserId: string,
	) {
		if (updateTeamDTO.teamMembers) {
			/* TODO: add role as lead & use roleName as i.e captain for genric
			 usercase of diffrent tournaments */
			const teamMembersCap = updateTeamDTO.teamMembers.filter(
				tm => tm.role === "captain",
			);

			if (teamMembersCap && teamMembersCap.length > 1) {
				throw new ConflictException("More then one player can't be captain");
			}
		}
		const updatedTeam = await this.teamModel.findOneAndUpdate(
			{ _id: teamId, user: currentUserId },
			updateTeamDTO,
			{ new: true },
		);

		if (!updatedTeam) {
			throw new NotFoundException("Error: Can Not Update This Team");
		}

		const teamJSON = updatedTeam.toResponseJSON();

		return teamJSON;
	}
}
