import { SetMetadata } from "@nestjs/common";

export enum RType {
	ADMIN = "0",
	ADMIN_ROLE_NAME = "admin",
	USER = "1",
	USER_ROLE_NAME = "user",
}

export const Roles = (...args: string[]) => SetMetadata("roles", args);
