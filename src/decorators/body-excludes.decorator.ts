import { createParamDecorator } from "@nestjs/common";

export const BodyExcludes = createParamDecorator((data: string, req) => {
	if (data && Array.isArray(data) && data.length > 0) {
		data.forEach(key => {
			Reflect.deleteProperty(req.body, key);
		});
	}

	return req.body;
});
