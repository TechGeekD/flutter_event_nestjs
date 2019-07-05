import * as mongoose from "mongoose";

export const EventParticipant = new mongoose.Schema(
	{
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		participantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

EventParticipant.methods.toResponseJSON = function({
	eventUsers = false,
	usersEvent = false,
}: {
	eventUsers?: boolean;
	usersEvent?: boolean;
} = {}) {
	if (eventUsers) {
		return {
			event: this.eventId,
			participant: this.participantId.toProfileJSON(),
		};
	} else if (usersEvent) {
		return {
			event: this.eventId.toResponseJSON(),
			participant: this.participantId,
		};
	} else {
		return {
			event: this.eventId.toResponseJSON(),
			participant: this.participantId.toProfileJSON(),
		};
	}
};
