import * as mongoose from "mongoose";

export const EventsSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "EventCategory",
			required: true,
		},
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

EventsSchema.methods.toResponseJSON = function(mapCategory: boolean = false) {
	return {
		id: this._id,
		title: this.title,
		category:
			this.category && this.category.toResponseJSON !== undefined && mapCategory
				? this.category.toResponseJSON()
				: this.category,
		description: this.description,
		email: this.email,
		phoneNo: this.phoneNo,
		address: this.address,
		mode: this.mode,
		cost: this.cost,
		createdBy:
			this.createdBy && this.createdBy.toProfileJSON !== undefined
				? this.createdBy.toProfileJSON()
				: this.createdBy,
		date: this.date,
	};
};
