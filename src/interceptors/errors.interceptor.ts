import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	InternalServerErrorException,
	BadRequestException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const debugLogger = (err: any) => {
			if (process.env.LOG_LEVEL === "debug") {
				const flattenObject = (obj, prefix = "") =>
					Object.keys(obj).reduce((acc, k) => {
						const pre = prefix.length ? prefix + "." : "";
						if (typeof obj[k] === "object") {
							Object.assign(acc, flattenObject(obj[k], pre + k));
						} else {
							acc[pre + k] = obj[k];
						}
						return acc;
					}, {});

				// tslint:disable: no-console
				console.error(err);
				console.log("*****************");
				console.table(flattenObject(err));
				console.log("*****************");
				// tslint:enable: no-console
			}
		};

		return next.handle().pipe(
			catchError(err => {
				debugLogger(err);
				return throwError(err);
			}),
		);
	}
}
