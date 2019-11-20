import { Handler, Context } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import { eventContext } from "aws-serverless-express/middleware";
import { Server } from "http";
import { ExpressAdapter } from "@nestjs/platform-express";

import { NestFactory } from "@nestjs/core";

import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { ErrorsInterceptor } from "./interceptors/errors.interceptor";

import { AppModule } from "./app.module";

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on("unhandledRejection", reason => {
	// tslint:disable-next-line:no-console
	console.error(reason);
});

process.on("uncaughtException", reason => {
	// tslint:disable-next-line:no-console
	console.error(reason);
});

async function bootstrap(): Promise<Server> {
	if (!cachedServer) {
		try {
			const expressApp = require("express")();
			const adapter = new ExpressAdapter(expressApp);
			const nestApp = await NestFactory.create(AppModule, adapter);

			nestApp.useGlobalInterceptors(
				new TransformInterceptor(),
				new ErrorsInterceptor(),
			);

			nestApp.use(eventContext());
			nestApp.enableCors();

			await nestApp.init();

			cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	return Promise.resolve(cachedServer);
}

export const handler: Handler = async (event: any, context: Context) => {
	cachedServer = await bootstrap();

	return proxy(cachedServer, event, context, "PROMISE").promise;
};
