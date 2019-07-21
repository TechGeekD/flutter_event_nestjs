import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateMatchDTO, IMatch } from "./dto/create-match.dto";
import { CreateMatchResultDTO } from "./dto/create-match-result.dto";

@Injectable()
export class MatchService {
	constructor(
		@InjectModel("Match") private readonly matchModel: Model<IMatch>,
		@InjectModel("MatchResult")
		private readonly matchResultModel: Model<IMatch>,
	) {}

	async createNewMatch(createMatchDTO: CreateMatchDTO) {
		const createdMatch = new this.matchModel(createMatchDTO);
		await createdMatch.save();

		const matchJSON = createdMatch.toResponseJSON();

		return matchJSON;
	}

	async getAllMatch() {
		const allMatch = await this.matchModel
			.find()
			.populate({
				path: "eventId",
				model: "Event",
				populate: [
					{
						path: "createdBy",
						model: "User",
					},
				],
			})
			.populate("participantId");

		if (!allMatch) {
			throw new NotFoundException("Error Event Match Not Found");
		}

		return allMatch.map(match => {
			return match.toResponseJSON();
		});
	}

	async getAllMatchById(eventId: string) {
		const allMatch = await this.matchModel.find({ eventId });

		if (!allMatch) {
			throw new NotFoundException("Error Event Match Not Found");
		}

		return allMatch.map(match => {
			return match.toResponseJSON();
		});
	}

	async createNewMatchResult(createMatchResultDTO: CreateMatchResultDTO) {
		const createdMatchResult = new this.matchResultModel(createMatchResultDTO);
		await createdMatchResult.save();

		const matchResultJSON = createdMatchResult.toResponseJSON();

		return matchResultJSON;
	}

	async getAllMatchResult() {
		const allMatchResult = await this.matchResultModel
			.find()
			.populate({
				path: "matchId",
				model: "Match",
				populate: [
					{
						path: "eventId",
						model: "Event",
						populate: [
							{
								path: "createdBy",
								model: "User",
							},
						],
					},
					{
						path: "participantId",
						model: "User",
					},
				],
			})
			.populate("participantId")
			.populate({
				path: "eventId",
				model: "Event",
				populate: [
					{
						path: "createdBy",
						model: "User",
					},
				],
			});

		if (!allMatchResult) {
			throw new NotFoundException("Error Event Match Result Not Found");
		}

		return allMatchResult.map(matchResult => {
			return matchResult.toResponseJSON();
		});
	}

	async getAllMatchResultById(matchId: string) {
		const allMatchResult = await this.matchResultModel.find({ matchId });

		if (!allMatchResult) {
			throw new NotFoundException("Error Event Match Result Not Found");
		}

		return allMatchResult.map(matchResult => {
			return matchResult.toResponseJSON();
		});
	}

	async getGlobalLeaderBoard() {
		const leaderBoardOfEvent = await this.matchResultModel
			.find({ status: "win" })
			.populate("participantId")
			.populate("matchId")
			.sort({ "result.value": -1 })
			.collation({ locale: "en_US", numericOrdering: true });

		if (!leaderBoardOfEvent) {
			throw new NotFoundException("Error Global LeaderBoard Data Not Found");
		}

		return leaderBoardOfEvent.map(leader => {
			return leader.toResponseJSON();
		});
	}

	async getLeaderBoardOfEvent(eventId: string) {
		const leaderBoardOfEvent = await this.matchResultModel
			.find({ eventId, status: "win" })
			.populate("participantId")
			.populate("matchId")
			.sort({ "result.value": -1 })
			.collation({ locale: "en_US", numericOrdering: true });

		if (!leaderBoardOfEvent) {
			throw new NotFoundException("Error Event LeaderBoard Data Not Found");
		}

		return leaderBoardOfEvent.map(leader => {
			return leader.toResponseJSON();
		});
	}
}
