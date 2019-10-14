import * as mongoose from "mongoose";

export const EventResultSchema = new mongoose.Schema(
	{
		eventId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		tournamentResultDetails: [
			{
				displayName: { type: String, required: true },
				value: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Team",
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

EventResultSchema.methods.toResponseJSON = function() {
	return {
		id: this._id,
		event:
			this.eventId.toResponseJSON !== undefined
				? this.eventId.toResponseJSON()
				: this.eventId,
		tournamentResultDetails: this.tournamentResultDetails.map(details => {
			details.value =
				details.value.toResponseJSON !== undefined
					? details.value.toResponseJSON()
					: details.value;
			return details;
		}),
	};
};
