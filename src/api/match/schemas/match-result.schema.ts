import * as mongoose from "mongoose";

export const MatchResultSchema = new mongoose.Schema(
	{
		participantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
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
			extraValues: mongoose.Schema.Types.Mixed,
		},
		teamMemberResult: [
			{
				displayName: String,
				member: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				memberType: String,
				value: String,
				extraValues: mongoose.Schema.Types.Mixed,
			},
		],
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
			this.participantId.toResponseJSON !== undefined
				? this.participantId.toResponseJSON()
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
		teamMemberResult: this.teamMemberResult.map(result => {
			result.member =
				result.member.toProfileJSON !== undefined
					? result.member.toProfileJSON()
					: result.member;
			return result;
		}),
		status: this.status,
	};
};
