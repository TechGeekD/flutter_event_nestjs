import * as mongoose from "mongoose";

export const TeamsSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		teamName: { type: String, required: true },
		teamDesc: String,
		teamMembers: [
			{
				member: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				role: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

TeamsSchema.methods.toResponseJSON = function() {
	return {
		id: this._id,
		user:
			this.user.toProfileJSON !== undefined
				? this.user.toProfileJSON()
				: this.user,
		teamName: this.teamName,
		teamDesc: this.teamDesc,
		teamMembers: this.teamMembers.map(team => {
			team.member =
				team.member.toProfileJSON !== undefined
					? team.member.toProfileJSON()
					: team.member;
			return team;
		}),
	};
};
