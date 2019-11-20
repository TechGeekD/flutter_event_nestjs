import { Model, Types } from "mongoose";
import {
	Injectable,
	NotFoundException,
	ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateEventDTO, IEvents } from "./dto/create-event.dto";
import {
	EventParticipateDTO,
	IEventParticipant,
} from "./dto/event-participate.dto";
import { IEventCategory, EventCategoryDTO } from "./dto/event-category.dto";
import { IEventResult, EventResultDTO } from "./dto/event-result.dto";
import { IMatchResult } from "../match/dto/create-match-result.dto";

import { ListAllEntities } from "../user/dto/list-all-entities.dto";

@Injectable()
export class EventsService {
	constructor(
		@InjectModel("User") private readonly usersModel: Model<IEvents>,
		@InjectModel("Event") private readonly eventsModel: Model<IEvents>,
		@InjectModel("EventResult")
		private readonly eventResultsModel: Model<IEventResult>,
		@InjectModel("EventParticipant")
		private readonly eventParticipantModel: Model<IEventParticipant>,
		@InjectModel("EventCategory")
		private readonly eventCategoryModel: Model<IEventCategory>,
		@InjectModel("MatchResult")
		private readonly matchResultModel: Model<IMatchResult>,
	) {}

	async createNewEvent(currentUserId: string, createEventDTO: CreateEventDTO) {
		const createdById = await this.usersModel.findById(currentUserId);

		const createdEvent = new this.eventsModel({
			...createEventDTO,
			createdBy: createdById,
		});
		await createdEvent.save();

		const eventJSON = createdEvent.toResponseJSON();

		return eventJSON;
	}

	async getAllEvent(createdBy: string) {
		const allEvents = await this.eventsModel
			.aggregate([
				// {
				// 	$match: {
				// 		createdBy: { $ne: createdBy },
				// 	},
				// },
			])
			.lookup({
				from: "matches",
				localField: "_id",
				foreignField: "eventId",
				as: "matches",
			})
			.addFields({
				id: "$_id",
				matchDates: {
					$map: {
						input: "$matches",
						as: "match",
						in: "$$match.date",
					},
				},
			})
			.project({ matches: 0, __v: 0 })
			.lookup({
				from: "users",
				localField: "createdBy",
				foreignField: "_id",
				as: "createdBy",
			})
			.unwind("createdBy")
			.project({
				createdBy: {
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
				_id: 0,
			})
			.sort({
				createdAt: -1,
			});

		allEvents.forEach(event => {
			const matchDateList = event.matchDates.map(
				(date: any) => date.split("T")[0],
			);
			event.matchDates = [...new Set(matchDateList)];
		});
		return allEvents;
	}

	async getAllEventsByUser(createdBy: string) {
		const allEvents = await this.eventsModel
			.find({ createdBy })
			.populate("createdBy");

		if (!allEvents) {
			throw new NotFoundException("Error Event Not Found");
		}

		return allEvents.map(event => {
			return event.toResponseJSON();
		});
	}

	async findOneByEmail(userCreds) {
		const foundEvent = await this.eventsModel
			.findOne({
				email: userCreds.email,
			})
			.populate("createdBy");

		if (!foundEvent) {
			throw new NotFoundException("Error Event Not Found");
		}

		return foundEvent.toResponseJSON();
	}

	async getEventById(id: string) {
		const foundEvent = await this.eventsModel
			.findById(id)
			.populate("createdBy");

		if (!foundEvent) {
			throw new NotFoundException("Error: Event Not Found");
		}

		return foundEvent.toResponseJSON();
	}

	async updateEvent(
		id: string,
		updateEventDTO: CreateEventDTO,
		createdBy: string,
	) {
		const updatedEvent = await this.eventsModel
			.findOneAndUpdate({ _id: id, createdBy }, updateEventDTO, {
				new: true,
			})
			.populate("createdBy");

		if (!updatedEvent) {
			throw new NotFoundException("Error: Can Not Update This Event");
		}

		return updatedEvent.toResponseJSON();
	}

	async deleteEvent(id: string, createdBy: string) {
		const deletedEvent = await this.eventsModel
			.findOneAndDelete({ _id: id, createdBy })
			.populate("createdBy");

		if (!deletedEvent) {
			throw new NotFoundException("Error: Can Not Delete This Event");
		}

		return deletedEvent.toResponseJSON();
	}

	async participateEvent(eventParticipantDTO: EventParticipateDTO) {
		const existParticipant = await this.eventParticipantModel.findOne({
			$and: [
				{ participantId: eventParticipantDTO.participantId },
				{ eventId: eventParticipantDTO.eventId },
			],
		});

		if (!existParticipant) {
			const eventParticipate = new this.eventParticipantModel(
				eventParticipantDTO,
			);

			const savedParticipant = await eventParticipate.save();
			const populatedParticipant = await savedParticipant
				.populate({
					path: "eventId",
					populate: [
						{
							path: "createdBy",
						},
					],
				})
				.populate("participantId")
				.execPopulate();

			return populatedParticipant.toResponseJSON();
		} else {
			throw new ConflictException();
		}
	}

	async getParticipantOfEvent(eventId: string, query: ListAllEntities) {
		const limit = Math.max(
			10,
			isNaN(query.limit) ? 0 : Number(query.limit) || 0,
		);
		const page = Math.max(
			0,
			isNaN(query.pageNumber) ? 0 : Number(query.pageNumber) - 1 || 0,
		);

		const allParticipant = await this.eventParticipantModel
			.aggregate([{ $match: { eventId: Types.ObjectId(eventId) } }])
			.skip(limit * page)
			.limit(limit)
			.lookup({
				from: "teams",
				localField: "participantId",
				foreignField: "_id",
				as: "participant",
			})
			.unwind("$participant")
			.addFields({
				participant: {
					id: "$participant._id",
				},
			})
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
			.group({
				_id: "$eventId",
				participant: { $push: "$participant" },
				totalRecords: { $sum: 1 },
			})
			.project({
				_id: 0,
				id: "$_id",
				participant: 1,
				totalRecords: 1,
			});

		if (!allParticipant || !allParticipant.length) {
			throw new NotFoundException("Error: No Participant Found ");
		}

		return allParticipant[0];
	}

	async getEventParticipatedByUser(
		participantId: string,
		query: ListAllEntities,
	) {
		const limit = Math.max(
			10,
			isNaN(query.limit) ? 0 : Number(query.limit) || 0,
		);
		const page = Math.max(
			0,
			isNaN(query.pageNumber) ? 0 : Number(query.pageNumber) - 1 || 0,
		);

		const allParticipatedEvent = await this.eventParticipantModel
			.aggregate([{ $match: { participantId: Types.ObjectId(participantId) } }])
			.skip(limit * page)
			.limit(limit)
			.lookup({
				from: "events",
				localField: "eventId",
				foreignField: "_id",
				as: "event",
			})
			.unwind("$event")
			.sort({ createdAt: -1 })
			.lookup({
				from: "users",
				localField: "event.createdBy",
				foreignField: "_id",
				as: "event.createdBy",
			})
			.unwind("$event.createdBy")
			.addFields({
				event: {
					id: "$event._id",
					createdBy: {
						id: "$createdBy._id",
					},
				},
			})
			.project({
				event: {
					createdAt: 0,
					updatedAt: 0,
					__v: 0,
					_id: 0,
					createdBy: {
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
			.group({
				_id: "$participantId",
				event: { $push: "$event" },
				totalRecords: { $sum: 1 },
			})
			.project({
				_id: 0,
				id: "$_id",
				event: 1,
				totalRecords: 1,
			});

		if (!allParticipatedEvent || !allParticipatedEvent.length) {
			throw new NotFoundException("Error: No Events Found");
		}

		return allParticipatedEvent[0];
	}

	async createEventCategory(
		eventCategoryDTO: EventCategoryDTO,
		currentUser: string,
	) {
		const existCategory = await this.eventCategoryModel.findOne({
			category: eventCategoryDTO.category,
		});

		if (existCategory) {
			throw new ConflictException("Category Already Exist");
		}

		const currentUserId = await this.usersModel.findById(currentUser);

		const createdEventCategory = new this.eventCategoryModel({
			...eventCategoryDTO,
			createdBy: currentUserId,
		});
		await createdEventCategory.save();

		const eventCategoryJSON = createdEventCategory.toResponseJSON();

		return eventCategoryJSON;
	}

	async getEventCategory() {
		const allEventCategory = await this.eventCategoryModel.find();

		return allEventCategory.map(eventCategory => {
			return eventCategory.toResponseJSON();
		});
	}

	async getEventLeagueTable(eventId: string) {
		let allEventMatchResult = await this.matchResultModel
			.aggregate([
				{
					$match: { eventId: Types.ObjectId(eventId) },
				},
			])
			.group({
				_id: "$participantId",
				status: { $push: "$status" },
				matchesPlayed: { $sum: 1 },
			})
			.lookup({
				from: "teams",
				localField: "_id",
				foreignField: "_id",
				as: "team",
			})
			.unwind("team")
			.project({
				status: 1,
				teamName: "$team.teamName",
				matchesPlayed: 1,
			});

		allEventMatchResult.forEach((e, index) => {
			e.statusObj = {};
			e.points = 0;

			e.status.forEach((stat: string) => {
				e.statusObj[stat] = e.statusObj[stat] ? (e.statusObj[stat] += 1) : 1;
			});

			e.recentMatches = e.status.filter((stat: string, i: number) => {
				if (i < 3) {
					return stat;
				}
			});

			e.statusObj.won = e.statusObj.won ? e.statusObj.won : 0;
			e.statusObj.lost = e.statusObj.lost ? e.statusObj.lost : 0;
			e.statusObj.draw = e.statusObj.draw ? e.statusObj.draw : 0;

			e.points += e.statusObj.won * 2 + e.statusObj.draw;

			e.status = e.statusObj;
			delete e.statusObj;
		});

		allEventMatchResult = allEventMatchResult.sort((a, b) => {
			return Number(b.points) - Number(a.points);
		});

		return allEventMatchResult;
	}

	async getAllEventResult() {
		const allEventResults = await this.eventResultsModel
			.find()
			.populate("eventId")
			.populate("tournamentResultDetails.value");

		return allEventResults.map(eventResult => {
			return eventResult.toResponseJSON();
		});
	}

	async getEventResultById(id: string) {
		const eventResult = await this.eventResultsModel
			.findById(id)
			.populate("eventId")
			.populate("tournamentResultDetails.value");

		return eventResult.toResponseJSON();
	}

	async getEventResultByEventId(id: string) {
		const eventResults = await this.eventResultsModel
			.find({ eventId: id })
			.populate("eventId")
			.populate("tournamentResultDetails.value");

		return eventResults.map(eventResult => eventResult.toResponseJSON());
	}

	async createEventResult(eventResultDTO: EventResultDTO) {
		const existEventResult = await this.eventResultsModel.findOne({
			$and: [
				{
					"tournamentResultDetails.value": {
						$in: [
							...eventResultDTO.tournamentResultDetails.map(trd => trd.value),
						],
					},
				},
				{ eventId: eventResultDTO.eventId },
			],
		});

		if (existEventResult) {
			throw new ConflictException("Result Already Exist");
		}

		const createdEventResult = new this.eventResultsModel(eventResultDTO);
		await createdEventResult.save();

		const eventResultJSON = createdEventResult.toResponseJSON();

		return eventResultJSON;
	}
}
