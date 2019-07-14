import * as mongoose from "mongoose";

export const MatchResultSchema = new mongoose.Schema(
	{
		participantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		matchId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Match",
			required: true,
		},
		result: {
			displayName: String,
			value: String,
		},
		status: String,
	},
	{
		timestamps: true,
	},
);

MatchResultSchema.methods.toResponseJSON = function() {
	return {
		id: this._id,
		participant: this.participantId.toProfileJSON(),
		event: this.eventId.toResponseJSON(),
		match: this.matchId.toResponseJSON(),
		result: this.result,
		status: this.status,
	};
};
