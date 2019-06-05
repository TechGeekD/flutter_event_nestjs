import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthGuard as _AuthGuard } from "@nestjs/passport";

@Injectable()
export class AuthGuard extends _AuthGuard("jwt") {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		return this.validateRequest(context);
	}

	validateRequest(context: ExecutionContext) {
		// const request = context.switchToHttp().getRequest();
		return super.canActivate(context);
	}

	handleRequest(err: any, user: any, info: any) {
		// tslint:disable-next-line:no-console
		console.log("\nerr", err, "\nuser", user, "\ninfo", info);
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}
