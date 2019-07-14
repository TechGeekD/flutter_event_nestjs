import { Document } from "mongoose";

export interface IMatch extends Document {
	eventId: string;
	match: string;
	note?: string;
	participantId: string;
	date: string;
	toResponseJSON?(): any;
}

export interface IMatchResult extends Document {
	eventId: string;
	matchId: string;
	result: {
		displayName: string;
		value: string;
	};
	status: string;
	participantId: string;
	toResponseJSON?(): any;
}
