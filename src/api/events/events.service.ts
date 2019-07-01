import { Model } from "mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateEventDTO } from "./dto/create-event.dto";
import { EventParticipateDTO } from "./dto/event-participate.dto";

import { IEvents, IEventParticipant } from "./interfaces/events.interface";

@Injectable()
export class EventsService {
	constructor(
		@InjectModel("User") private readonly usersModel: Model<IEvents>,
		@InjectModel("Events") private readonly eventsModel: Model<IEvents>,
		@InjectModel("EventParticipants")
		private readonly eventParticipantModel: Model<IEventParticipant>,
	) {}

	async createNewEvent(id, createEventDTO: CreateEventDTO) {
		const createdEvent = new this.eventsModel(createEventDTO);
		id = await this.usersModel.findById(id);
		const eventJSON = createdEvent.toResponseJSON(id);
		await createdEvent.save();

		return eventJSON;
	}

	async getAllEvent() {
		const allEvents = await this.eventsModel
			.find()
			.populate("createdBy")
			.sort({ createdAt: -1 });

		return allEvents.map(event => {
			return event.toResponseJSON(null);
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
			return event.toResponseJSON(null);
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

		return foundEvent.toResponseJSON(null);
	}

	async getEventById(id: string) {
		const foundEvent = await this.eventsModel
			.findById(id)
			.populate("createdBy");

		if (!foundEvent) {
			throw new NotFoundException("Error: Can Not Delete This Event");
		}

		return foundEvent.toResponseJSON(null);
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

		return updatedEvent.toResponseJSON(null);
	}

	async deleteEvent(id: string, createdBy: string) {
		const deletedEvent = await this.eventsModel
			.findOneAndDelete({ _id: id, createdBy })
			.populate("createdBy");

		if (!deletedEvent) {
			throw new NotFoundException("Error: Can Not Delete This Event");
		}

		return deletedEvent.toResponseJSON(null);
	}

	async participateEvent(eventParticipantDTO: EventParticipateDTO) {
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
	}
}
