import { Document } from "mongoose";

export interface IEvents extends Document {
	title: string;
	category: string;
	description?: string;
	secret?: string;
	email?: string;
	phoneNo?: string;
	address?: string;
	mode: string;
	cost: string;
	createdBy: string;
	date: string;
	toResponseJSON?(id): any;
}
