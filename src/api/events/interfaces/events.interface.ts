import { Document } from "mongoose";

export interface IEvents extends Document {
	title: string;
	category: string;
	description?: string;
	secret?: string;
	email?: string;
	phoneNo?: string;
	address?: string;
	mode: string;
	cost: string;
	createdBy: string;
	date: string;
	toResponseJSON?(id?): any;
}

export interface IEventParticipant extends Document {
	event: string;
	participant: string;
	toResponseJSON?(responseType?: {
		usersEvent?: boolean;
		eventUsers?: boolean;
	}): any;
}
