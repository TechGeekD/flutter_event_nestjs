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
import { IMatchResult } from "../match/dto/create-match-result.dto";
import { firstBy } from "thenby";

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
			]).match({
				status: { $ne: "live" }
			})
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
				// memberOverview: {
				batsman: {
					$push: {
						$cond: {
							if: { $eq: ["$teamMemberResult.memberType", "batsman"] },
							then: {
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
										$toInt: "$teamMemberResult.extraValues.the4s",
									},
								},
								the6s: {
									$sum: {
										$toInt: "$teamMemberResult.extraValues.the6s",
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
							else: null,
						},
					},
				},
				bowler: {
					$push: {
						$cond: {
							if: {
								$eq: ["$teamMemberResult.memberType", "bowler"],
							},
							then: {
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
										$toInt: "$teamMemberResult.extraValues.the4s",
									},
								},
								the6s: {
									$sum: {
										$toInt: "$teamMemberResult.extraValues.the6s",
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
							else: null,
						},
					},
				},
				// },
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
			.addFields({
				memberOverallOverview: {
					batsman: {
						runs: { $sum: "$batsman.runs" },
						balls: { $sum: "$batsman.balls" },
						wickets: { $sum: "$batsman.wickets" },
						maidens: { $sum: "$batsman.maidens" },
						the4s: { $sum: "$batsman.the4s" },
						the6s: { $sum: "$batsman.the6s" },
					},
					bowler: {
						runs: { $sum: "$bowler.runs" },
						balls: { $sum: "$bowler.balls" },
						wickets: { $sum: "$bowler.wickets" },
						maidens: { $sum: "$bowler.maidens" },
						the4s: { $sum: "$bowler.the4s" },
						the6s: { $sum: "$bowler.the6s" },
					},
				},
			})
			.addFields({
				memberOverallOverview: {
					batsman: {
						sr: {
							$cond: {
								if: {
									$and: [
										{ $gt: ["$memberOverallOverview.batsman.runs", 0] },
										{ $gt: ["$memberOverallOverview.batsman.balls", 0] },
									],
								},
								then: {
									$multiply: [
										{
											$divide: [
												"$memberOverallOverview.batsman.runs",
												"$memberOverallOverview.batsman.balls",
											],
										},
										100,
									],
								},
								else: 0,
							},
						},
					},
					bowler: {
						eco: {
							$cond: {
								if: {
									$and: [
										{ $gt: ["$memberOverallOverview.bowler.runs", 0] },
										{ $gt: ["$memberOverallOverview.bowler.balls", 0] },
									],
								},
								then: {
									$divide: [
										"$memberOverallOverview.bowler.runs",
										"$memberOverallOverview.bowler.balls",
									],
								},
								else: 0,
							},
						},
					},
				},
			})
			.group({
				_id: "$teamDetails._id",
				teamDetails: { $first: "$teamDetails" },
				status: { $push: "$status" },
				teamMembers: {
					$push: {
						details: "$member",
						overview: "$memberOverallOverview",
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

		const status = await this.matchResultModel.aggregate([
			{
				$match: {
					status: {
						$ne: "live",
					},
					participantId: Types.ObjectId(id),
				},
			},
			{
				$group: {
					_id: "$participantId",
					status: {
						$push: "$status",
					},
				},
			},
		]);

		teamResult.forEach(result => {
			result.teamMembers = result.teamMembers.sort(firstBy((a , b) => {
				const aruns = Number(a.overview.batsman.runs);
				const bruns = Number(b.overview.batsman.runs);

				return bruns - aruns;

			}).thenBy((a, b) => {
				const aballs = Number(a.overview.batsman.balls);
				const bballs = Number(b.overview.batsman.balls);

				return aballs - bballs;
			}));

			result.teamOverview = {};
			result.status = status[0].status;
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
