import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
const AWSXRay = require("aws-xray-sdk");

import { TodoItem } from "../models/TodoItem";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);

const log = createLogger("Todo Access");

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE
  ) {}

  async getTodosByUserId(userId: string): Promise<TodoItem[]> {
    log.info(`[START] Get to do by user id: ${userId}`);
    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();
    return result.Items as TodoItem[];
  }

  async createTodo(item: TodoItem): Promise<TodoItem> {
    log.info(`[START] Create todo: ${JSON.stringify(item)}`);
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: item,
      })
      .promise();

    return item;
  }

  async updateTodo(item: TodoItem): Promise<TodoItem> {
    log.info(`[START] Update todo: ${JSON.stringify(item)}`);
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: { todoId: item.todoId, userId: item.userId },
        UpdateExpression:
          "set #name = :name, #done = :done, #dueDate = :dueDate",
        ExpressionAttributeNames: {
          "#name": "name",
          "#done": "done",
          "#dueDate": "dueDate",
        },
        ExpressionAttributeValues: {
          ":name": item.name,
          ":done": item.done,
          ":dueDate": item.dueDate,
        }
      })
      .promise();

    return item;
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    log.info(`[START] Delete todo id: ${todoId}`);
    await this.docClient
      .delete({
        TableName: this.todoTable,
        Key: {
          todoId,
          userId,
        },
      })
      .promise();

    return;
  }

  async updateAttachmentUrl(todoId: string, userId: string, attachmentUrl: string): Promise<void> {
    log.info(`[START] Update attachment url todoId: ${todoId}`);
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: { todoId, userId },
        UpdateExpression:
          "set #attachmentUrl = :attachmentUrl",
        ExpressionAttributeNames: {
          "#attachmentUrl": "attachmentUrl"
        },
        ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl
        }
      })
      .promise();

  }
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient();
}
