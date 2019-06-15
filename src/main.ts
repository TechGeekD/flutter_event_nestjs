import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import config from "config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const options = new DocumentBuilder()
		.setTitle("Flutter Event NestJs API")
		.setDescription("The API created using NestJs for Flutter Event App")
		.setVersion("1.0")
		.addTag("Misc")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("api", app, document);

	await app.listen(config.port);
}

bootstrap();
