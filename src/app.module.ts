import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "api/auth/auth.module";

import config from "config";

@Module({
	imports: [
		MongooseModule.forRoot(config.databaseURL, {
			useFindAndModify: false,
			useNewUrlParser: true,
		}),
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
