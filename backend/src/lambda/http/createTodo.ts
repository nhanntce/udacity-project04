import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { createTodo } from "../../bussinessLogic/todos";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { getUserId } from "../utils";
import { cors, httpErrorHandler } from "middy/middlewares";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body);

    const userId = getUserId(event);

    const item = await createTodo(createTodoRequest, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        item,
      }),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
