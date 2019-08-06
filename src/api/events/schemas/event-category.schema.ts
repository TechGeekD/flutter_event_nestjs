import * as mongoose from "mongoose";

export const EventCategorySchema = new mongoose.Schema(
	{
		category: { type: String, required: true },
		displayName: { type: String, required: true },
		metadata: {
			score: {
				displayName: String,
			},
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

EventCategorySchema.methods.toResponseJSON = function() {
	return {
		id: this._id,
		category: this.category,
		displayName: this.displayName,
		metadata: this.metadata,
	};
};
