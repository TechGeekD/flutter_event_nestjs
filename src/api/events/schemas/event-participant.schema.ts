import * as mongoose from "mongoose";

export const EventParticipant = new mongoose.Schema(
	{
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Events",
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

EventParticipant.methods.toResponseJSON = function() {
	return {
		event: this.eventId.toResponseJSON(),
		participant: this.participantId.toProfileJSON(),
	};
};
