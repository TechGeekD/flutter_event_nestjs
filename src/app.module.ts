import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "api/auth/auth.module";
import { MatchModule } from "./api/match/match.module";

import config from "config";

@Module({
	imports: [
		MongooseModule.forRoot(config.databaseURL, {
			useFindAndModify: false,
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		}),
		forwardRef(() => AuthModule),
		forwardRef(() => MatchModule),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
