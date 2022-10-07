import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { updateTodo } from "../../bussinessLogic/todos";
import { getUserId } from "../utils";
import { cors, httpErrorHandler } from "middy/middlewares";
import * as middy from "middy";

export const handler = middy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  await updateTodo(updatedTodo, userId, todoId);

  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
