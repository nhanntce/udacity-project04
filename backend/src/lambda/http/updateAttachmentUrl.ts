import {
    APIGatewayProxyEvent,
    APIGatewayProxyHandler,
    APIGatewayProxyResult,
  } from "aws-lambda";
  import "source-map-support/register";
  import { updateAttachmentUrl } from "../../bussinessLogic/todos";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";
  
const log = createLogger("updateAttachmentUrl");

  export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
  
    log.info(`TodoId ${todoId}`);
    await updateAttachmentUrl(todoId, userId);
  
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    };
  };
  