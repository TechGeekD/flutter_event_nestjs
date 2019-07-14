import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { IMatch } from "./interfaces/match.interface";
import { CreateMatchDTO } from "./dto/create-match.dto";
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

		// const populatedMatch = await createdMatch
		// 	.populate({
		// 		path: "eventId",
		// 		model: "Event",
		// 		populate: [
		// 			{
		// 				path: "createdBy",
		// 				model: "User",
		// 			},
		// 		],
		// 	})
		// 	.populate("participantId")
		// 	.execPopulate();

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
			throw new NotFoundException("Error Event Not Found");
		}

		return allMatch.map(match => {
			return match.toResponseJSON();
		});
	}

	async getAllMatchById(eventId: string) {
		const allMatch = await this.matchModel
			.find({ eventId });
			// .populate({
			// 	path: "eventId",
			// 	model: "Event",
			// 	populate: [
			// 		{
			// 			path: "createdBy",
			// 			model: "User",
			// 		},
			// 	],
			// })
			// .populate("participantId");

		if (!allMatch) {
			throw new NotFoundException("Error Event Not Found");
		}

		return allMatch.map(match => {
			return match.toResponseJSON();
		});
	}

	async createNewMatchResult(createMatchResultDTO: CreateMatchResultDTO) {
		const createdMatchResult = new this.matchResultModel(createMatchResultDTO);
		await createdMatchResult.save();

		const populatedMatchResult = await createdMatchResult
			.populate({
				path: "matchId",
				model: "Match",
				populate: [
					{
						path: "eventId",
						model: "Event",
						populate: {
							path: "createdBy",
							model: "User",
						},
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
			})
			.execPopulate();

		const matchResultJSON = populatedMatchResult.toResponseJSON();

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
			throw new NotFoundException("Error Event Not Found");
		}

		return allMatchResult.map(matchResult => {
			return matchResult.toResponseJSON();
		});
	}
}
