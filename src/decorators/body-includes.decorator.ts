import { createParamDecorator } from "@nestjs/common";

export const BodyIncludes = createParamDecorator((data: string, req) => {
	let body = req.body;
	const bodyKeyArray = Object.keys(body);

	if (data && Array.isArray(data) && data.length > 0) {
		body = {};

		data.forEach(key => {
			if (bodyKeyArray.includes(key)) {
				body[key] = req.body[key];
			}
		});
	}

	return body;
});
