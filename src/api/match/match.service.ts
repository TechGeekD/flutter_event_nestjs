import { firstBy } from "thenby";
import {
	Injectable,
	NotFoundException,
	ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateMatchDTO, IMatch, UpdateMatchDTO } from "./dto/create-match.dto";
import {
	CreateMatchResultDTO,
	UpdateMatchResultDTO,
	IMatchResult,
} from "./dto/create-match-result.dto";
import { ITeam, CreateTeamDTO } from "../user/dto/team.dto";
import { MatchQuery } from "./dto/match-query.dto";

@Injectable()
export class MatchService {
	constructor(
		@InjectModel("Match") private readonly matchModel: Model<IMatch>,
		@InjectModel("MatchResult")
		private readonly matchResultModel: Model<IMatchResult>,
		@InjectModel("Team") private readonly teamModel: Model<ITeam>,
	) {}

	async createNewMatch(createMatchDTO: CreateMatchDTO) {
		const teamMembers = [];
		const duplicate = {};

		const teamList: CreateTeamDTO[] = await this.teamModel.find({
			_id: { $in: createMatchDTO.participantId.map(p => Types.ObjectId(p)) },
		});

		if (teamList && teamList.length > 0) {
			teamList.forEach((team: CreateTeamDTO) => {
				team.teamMembers.forEach(tm => {
					teamMembers.push(tm.member.toString());
				});
			});

			teamMembers.forEach(member => {
				if (String(member) in duplicate) {
					duplicate[member] += 1;
				} else {
					duplicate[member] = 0;
				}
			});
			const duplicateValues = Object.keys(duplicate).filter(key => {
				return duplicate[key] > 0;
			});

			if (duplicateValues.length > 0) {
				throw new ConflictException("Two teams might have same participants");
			}
		}

		const createdMatch = new this.matchModel(createMatchDTO);
		await createdMatch.save();

		const matchJSON = createdMatch.toResponseJSON();

		return matchJSON;
	}

	async updateMatch(matchId: string, updateMatchDTO: UpdateMatchDTO) {
		if (updateMatchDTO.participantId) {
			const teamMembers = [];
			const duplicate = {};

			const team: any = await this.teamModel.find({
				_id: { $in: updateMatchDTO.participantId.map(p => Types.ObjectId(p)) },
			});
			team.forEach(element => {
				element.teamMembers.forEach(tm => {
					teamMembers.push(tm.member.toString());
				});
			});

			teamMembers.forEach(member => {
				if (String(member) in duplicate) {
					duplicate[member] += 1;
				} else {
					duplicate[member] = 0;
				}
			});
			const duplicateValues = Object.keys(duplicate).filter(key => {
				return duplicate[key] > 0;
			});

			if (duplicateValues.length > 0) {
				throw new ConflictException("Two teams might have same participants");
			}
		}

		const updatedMatch = await this.matchModel.findByIdAndUpdate(
			matchId,
			updateMatchDTO,
			{ new: true },
		);

		const matchJSON = updatedMatch.toResponseJSON();

		return matchJSON;
	}

	async getAllMatch(matchQuery: MatchQuery) {
		let query = {};
		const matchQueryUnEsc = {
			startDate: unescape(matchQuery.startDate)
				.split(" ")
				.join("T"),
			endDate: unescape(matchQuery.endDate)
				.split(" ")
				.join("T"),
			teamId: unescape(matchQuery.teamId),
		};
		const dateQuery = {
			$and: [
				{ date: { $gte: matchQueryUnEsc.startDate } },
				{ date: { $lte: matchQueryUnEsc.endDate } },
			],
		};
		const participantIdQuery = { participantId: matchQueryUnEsc.teamId };

		if (matchQuery.startDate && matchQuery.teamId) {
			query = {
				$and: [dateQuery, participantIdQuery],
			};
		} else if (!matchQuery.startDate && matchQuery.teamId) {
			query = participantIdQuery;
		} else if (matchQuery.startDate && !matchQuery.teamId) {
			query = dateQuery;
		}

		const allMatch = await this.matchModel
			.find(query)
			.populate("participantId");
		const matchResult = await this.matchResultModel.find({
			matchId: { $in: allMatch.map(match => match.id) },
		});

		if (!allMatch) {
			throw new NotFoundException("Error Event Match Not Found");
		}

		return allMatch.map(match => {
			match = match.toResponseJSON();

			match.participantId.forEach((participant: any) => {
				matchResult.forEach((result: any) => {
					if (result.participantId.toString() === participant.id.toString()) {
						participant.result = result.result;
					}
				});
			});

			return match;
		});
	}

	async getMatchDetails(matchId: string) {
		const matchDetails: IMatch = await this.matchModel
			.findById(matchId)
			.populate("participantId");

		if (!matchDetails) {
			throw new NotFoundException("Error Event Match Not Found");
		}
		const participants = matchDetails.participantId.map((participant: any) =>
			Types.ObjectId(participant.id),
		);
		let matchResults: any = await this.matchResultModel
			.aggregate([
				{
					$match: {
						participantId: {
							$in: participants,
						},
						matchId: Types.ObjectId(matchId),
					},
				},
			])
			.unwind("$teamMemberResult")
			.lookup({
				from: "users",
				localField: "teamMemberResult.member",
				foreignField: "_id",
				as: "teamMemberResult.member",
			})
			.unwind("$teamMemberResult.member")
			.project({
				teamMemberResult: {
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
				},
			})
			.lookup({
				from: "teams",
				localField: "participantId",
				foreignField: "_id",
				as: "participant",
			})
			.unwind("$participant")
			.project({
				participant: {
					__v: 0,
					createdAt: 0,
					updatedAt: 0,
					teamMembers: 0,
					user: 0,
				},
			})
			.group({
				_id: "$matchId",
				matchDetails: {
					$push: {
						participant: "$participant",
						result: "$result",
						teamMemberResult: "$teamMemberResult",
					},
				},
			});

		matchResults = matchResults[0];
		matchResults.matchDetails = matchResults.matchDetails.sort(firstBy((a , b) => {
			const aruns = Number(a.teamMemberResult.value);
			const bruns = Number(b.teamMemberResult.value);

			return bruns - aruns;

		}).thenBy((a, b) => {
			const aballs = Number(a.teamMemberResult.extraValues.ball);
			const bballs = Number(b.teamMemberResult.extraValues.ball);

			return aballs - bballs;
		}));

		const duplicateObj = {};
		matchResults.matchDetails.forEach(match => {
			match.participant.id = match.participant._id.toString();
			delete match.participant._id;
			duplicateObj[match.participant.id] = Object.assign(
				{},
				duplicateObj[match.participant.id],
				match,
			);
			const duplicate = duplicateObj[match.participant.id];

			duplicate.teamMemberResultArray = duplicate.teamMemberResultArray
				? duplicate.teamMemberResultArray
				: [];
			const getOver = balls => {
				const totalBalls = balls;
				const ballsLeftInOver = totalBalls % 6;

				const overs = (totalBalls - ballsLeftInOver) / 6;
				const ballsInThisOver = ballsLeftInOver / 10;
				const overWithBall = (overs + ballsInThisOver).toFixed(1);

				return overWithBall;
			};
			const memberResult = match.teamMemberResult;
			if (memberResult.memberType === "batsman") {
				const runs = Number(memberResult.value);
				const balls = Number(memberResult.extraValues.ball);
				let sr = 0.0;
				if (runs && balls) {
					sr =
						(Number(memberResult.value) /
							Number(memberResult.extraValues.ball)) *
						100;
				}
				memberResult.extraValues.sr = String(sr.toFixed(2));
			} else {
				const balls = Number(memberResult.extraValues.ball);
				let over: any = 0;
				if (balls) {
					over = getOver(balls);
				}
				const runs = Number(memberResult.value);
				let eco = 0;

				if(runs > 0 && over > 0) {
					eco = Number(memberResult.value) / over;
				}

				memberResult.extraValues.eco = String(eco.toFixed(2));
			}

			duplicate.teamMemberResultArray.push(match.teamMemberResult);

			delete duplicate.teamMemberResult;
		});

		const matchResultJSON = [];
		const pushedMatchResultArray = [];

		matchResults.matchDetails.forEach(match => {
			Object.keys(duplicateObj).forEach(key => {
				const participantId = match.participant.id;

				if (key === participantId && !pushedMatchResultArray.includes(key)) {
					pushedMatchResultArray.push(key);

					duplicateObj[key].teamMemberResult =
						duplicateObj[key].teamMemberResultArray;
					delete duplicateObj[key].teamMemberResultArray;

					duplicateObj[key].matchId = matchResults._id;

					matchResultJSON.push(duplicateObj[key]);
				}
			});
		});

		const matchJson = {
			details: {
				matchId: matchDetails.id,
				note: matchDetails.note,
				match: matchDetails.match,
				date: matchDetails.date,
			},
			result: matchResultJSON,
		};

		return matchJson;
	}

	async getAllMatchByEventId(eventId: string, matchQuery: MatchQuery) {
		let query = {};
		let startDate: any = matchQuery.startDate ? unescape(matchQuery.startDate)
		.split(" ")
		.join("T") + "Z" : null;

		startDate = new Date(startDate).toISOString();

		let endDate: any = matchQuery.endDate ? unescape(matchQuery.endDate)
		.split(" ")
		.join("T") + "Z" : null;

		endDate = new Date(endDate);

		const matchQueryUnEsc = {
			startDate,
			endDate: new Date(endDate.setDate(endDate.getDate() + 1)).toISOString(),
			teamId: unescape(matchQuery.teamId),
		};
		const dateQuery = {
			$and: [
				{ date: { $gte: matchQueryUnEsc.startDate } },
				{ date: { $lt: matchQueryUnEsc.endDate } },
			],
		};
		const participantIdQuery = { participantId: matchQueryUnEsc.teamId };

		if (matchQuery.startDate && matchQuery.teamId) {
			query = {
				$and: [dateQuery, participantIdQuery],
			};
		} else if (!matchQuery.startDate && matchQuery.teamId) {
			query = participantIdQuery;
		} else if (matchQuery.startDate && !matchQuery.teamId) {
			query = dateQuery;
		}

		const allMatch = await this.matchModel
			.find(query)
			.populate("participantId");
		const matchResult = await this.matchResultModel.find({
			matchId: { $in: allMatch.map(match => match.id) },
		});

		if (!allMatch) {
			throw new NotFoundException("Error Event Match Not Found");
		}

		return allMatch.map(match => {
			match = match.toResponseJSON();

			match.participantId.forEach((participant: any) => {
				matchResult.forEach((result: any) => {
					if (result.participantId.toString() === participant.id.toString()) {
						participant.result = result.result;
					}
				});
			});

			return match;
		});
	}

	async createNewMatchResult(createMatchResultDTO: CreateMatchResultDTO) {
		const createdMatchResult = new this.matchResultModel(createMatchResultDTO);
		await createdMatchResult.save();

		const matchResultJSON = createdMatchResult.toResponseJSON();

		return matchResultJSON;
	}

	async updateMatchResult(
		matchResultId: string,
		updateMatchResultDTO: UpdateMatchResultDTO,
	) {
		const updatedMatchResult = await this.matchResultModel.findByIdAndUpdate(
			matchResultId,
			updateMatchResultDTO,
			{ new: true },
		);

		const matchResultJSON = updatedMatchResult.toResponseJSON();

		return matchResultJSON;
	}

	async getAllMatchResult() {
		const allMatchResult = await this.matchResultModel
			.find()
			.populate("matchId")
			.populate("participantId")
			.populate("eventId")
			.populate({
				path: "teamMemberResult",
				populate: [
					{
						path: "member",
					},
				],
			});

		if (!allMatchResult) {
			throw new NotFoundException("Error Event Match Result Not Found");
		}

		return allMatchResult.map(async matchResult => {
			matchResult = await matchResult.execPopulate();
			return matchResult.toResponseJSON();
		});
	}

	async getAllMatchResultById(id: string) {
		const allMatchResult = await this.matchResultModel.findById(id);
		// .populate("matchId")
		// .populate("participantId")
		// .populate("eventId");

		if (!allMatchResult) {
			throw new NotFoundException("Error Event Match Result Not Found");
		}

		return allMatchResult.toResponseJSON();
	}

	async getMatchResultByMatchId(matchId: string) {
		const matchResult = await this.matchResultModel.findOne({
			matchId: Types.ObjectId(matchId),
		});

		if (!matchResult) {
			throw new NotFoundException("Error Event Match Result Not Found");
		}

		return matchResult.toResponseJSON();
	}

	async getGlobalLeaderBoard() {
		const leaderBoardOfEvent = await this.matchResultModel
			.aggregate([
				{
					$match: {
						status: "win",
					},
				},
			])
			.group({
				_id: "$participantId",
				result: {
					$push: {
						matchId: "$matchId",
						eventId: "$eventId",
						value: "$result.value",
					},
				},
				matchWon: {
					$sum: 1,
				},
			})
			.lookup({
				from: "users",
				localField: "_id",
				foreignField: "_id",
				as: "participant",
			})
			.unwind("$participant")
			.project({
				participant: {
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
			.project({
				result: 1,
				highScore: {
					$max: "$result.value",
				},
				participant: 1,
				matchWon: 1,
			})
			.sort({
				matchWon: -1,
				highScore: -1,
			})
			.collation({ locale: "en_US", numericOrdering: true });

		if (!leaderBoardOfEvent) {
			throw new NotFoundException("Error Global LeaderBoard Data Not Found");
		}

		return leaderBoardOfEvent;
	}

	async getLeaderBoardOfEvent(eventId: string) {
		const leaderBoardOfEvent = await this.matchResultModel
			.aggregate([
				{
					$match: {
						eventId,
						status: "win",
					},
				},
			])
			.group({
				_id: "$participantId",
				result: {
					$push: {
						matchId: "$matchId",
						eventId: "$eventId",
						value: "$result.value",
					},
				},
				matchWon: {
					$sum: 1,
				},
			})
			.project({
				result: 1,
				highScore: {
					$max: "$result.value",
				},
				matchWon: 1,
			})
			.sort({
				matchWon: -1,
				highScore: -1,
			})
			.collation({ locale: "en_US", numericOrdering: true });

		if (!leaderBoardOfEvent) {
			throw new NotFoundException("Error Event LeaderBoard Data Not Found");
		}

		return leaderBoardOfEvent;
	}
}
