import * as mongoose from "mongoose";

export const MatchSchema = new mongoose.Schema(
	{
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		match: { type: String, required: true },
		note: String,
		date: { type: String, required: true },
		participantId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
	},
	{
		timestamps: true,
	},
);

MatchSchema.methods.toResponseJSON = function() {
	return {
		id: this._id,
		eventId:
			this.eventId.toResponseJSON !== undefined
				? this.eventId.toResponseJSON()
				: this.eventId,
		match: this.match,
		note: this.note,
		participantId: this.participantId.map(e =>
			e.toProfileJSON !== undefined ? e.toProfileJSON() : e,
		),
		date: this.date,
	};
};
