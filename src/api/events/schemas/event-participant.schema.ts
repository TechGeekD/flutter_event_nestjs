import * as mongoose from "mongoose";

export const EventParticipantSchema = new mongoose.Schema(
	{
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		participantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

EventParticipantSchema.methods.toResponseJSON = function({
	eventUsers = false,
	usersEvent = false,
}: {
	eventUsers?: boolean;
	usersEvent?: boolean;
} = {}) {
	if (eventUsers) {
		return {
			event: this.eventId,
			participant: this.participantId.toResponseJSON(),
		};
	} else if (usersEvent) {
		return {
			event: this.eventId.toResponseJSON(),
			participant: this.participantId,
		};
	} else {
		return {
			event: this.eventId.toResponseJSON(),
			participant: this.participantId.toResponseJSON(),
		};
	}
};
