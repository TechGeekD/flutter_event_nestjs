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
		participantId:
			this.participantId.toProfileJSON !== undefined
				? this.participantId.toProfileJSON()
				: this.participantId,
		eventId:
			this.eventId.toResponseJSON !== undefined
				? this.eventId.toResponseJSON()
				: this.eventId,
		matchId:
			this.matchId.toResponseJSON !== undefined
				? this.matchId.toResponseJSON()
				: this.matchId,
		result: this.result,
		status: this.status,
	};
};
