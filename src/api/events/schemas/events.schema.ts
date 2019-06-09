import * as mongoose from "mongoose";

export const EventsSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		category: { type: String, required: true },
		description: String,
		secret: String,
		email: String,
		phoneNo: String,
		address: String,
		mode: { type: String, required: true },
		cost: { type: String, required: true },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		date: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);

EventsSchema.methods.toResponseJSON = function(createdBy = null) {
	if (createdBy) {
		this.createdBy = createdBy;
	}

	return {
		title: this.title,
		category: this.category,
		description: this.description,
		email: this.email,
		phoneNo: this.phoneNo,
		address: this.address,
		mode: this.mode,
		cost: this.cost,
		createdBy: this.createdBy.toProfileJSON(),
		date: this.date,
	};
};
