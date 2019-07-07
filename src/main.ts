import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import config from "config";
import { AppModule } from "./app.module";

import { TransformInterceptor } from "interceptors/transform.interceptor";
import { ErrorsInterceptor } from "interceptors/errors.interceptor";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalInterceptors(
		new TransformInterceptor(),
		new ErrorsInterceptor(),
	);

	const options = new DocumentBuilder()
		.setTitle("Flutter Event NestJs API")
		.setDescription("The API created using NestJs for Flutter Event App")
		.setVersion("1.0")
		.addTag("Misc")
		.addBearerAuth()
		.setSchemes("http", "https")
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("api", app, document);

	await app.listen(process.env.PORT || config.port);
}

bootstrap();
