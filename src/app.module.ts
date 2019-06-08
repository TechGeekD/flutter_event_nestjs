import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import config from "config";

import { AppController } from "./app.controller";

import { AppService } from "./app.service";

import { AuthModule } from "api/auth/auth.module";
import { UserModule } from "api/user/user.module";

@Module({
	imports: [
		AuthModule,
		UserModule,
		MongooseModule.forRoot(config.databaseURL, {
			useFindAndModify: false,
			useNewUrlParser: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
