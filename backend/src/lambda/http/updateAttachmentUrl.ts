import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
  } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
  import "source-map-support/register";
  import { updateAttachmentUrl } from "../../bussinessLogic/todos";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";
  
const log = createLogger("updateAttachmentUrl");

  export const handler = middy(async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
  
    log.info(`TodoId ${todoId}`);
    await updateAttachmentUrl(todoId, userId);
  
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
  