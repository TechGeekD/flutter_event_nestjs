
import { Model, Types } from "mongoose";
import {
	Injectable,
	NotFoundException,
	ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateEventDTO, IEvents } from "./dto/create-event.dto";
import { EventParticipateDTO, IEventParticipant } from "./dto/event-participate.dto";

import { ListAllEntities } from "api/user/dto/list-all-entities.dto";

@Injectable()
export class EventsService {
	constructor(
		@InjectModel("User") private readonly usersModel: Model<IEvents>,
		@InjectModel("Event") private readonly eventsModel: Model<IEvents>,
		@InjectModel("EventParticipant")
		private readonly eventParticipantModel: Model<IEventParticipant>,
	) {}

	async createNewEvent(id, createEventDTO: CreateEventDTO) {
		const createdEvent = new this.eventsModel(createEventDTO);
		id = await this.usersModel.findById(id);
		const eventJSON = createdEvent.toResponseJSON(id);
		await createdEvent.save();

		return eventJSON;
	}

	async getAllEvent(createdBy: string) {
		const allEvents = await this.eventsModel
			.find({ createdBy: { $ne: createdBy } })
			.populate("createdBy")
			.sort({ createdAt: -1 });

		return allEvents.map(event => {
			return event.toResponseJSON();
		});
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
		createEventDTO: CreateEventDTO,
		createdBy: string,
	) {
		const updatedEvent = await this.eventsModel
			.findOneAndUpdate({ _id: id, createdBy }, createEventDTO, {
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
					populate: {
						path: "createdBy",
					},
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
				from: "users",
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
}
