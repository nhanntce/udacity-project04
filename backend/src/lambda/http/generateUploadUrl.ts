import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { createPresignedUrl } from "../../bussinessLogic/todos";
import { cors, httpErrorHandler } from "middy/middlewares";
import * as middy from "middy";

export const handler = middy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const uploadUrl = await createPresignedUrl(todoId);

  return {
    statusCode: 200,
    body: JSON.stringify({
        uploadUrl
    })
  };
})


handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
