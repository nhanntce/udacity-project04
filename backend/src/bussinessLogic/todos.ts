import * as uuid from "uuid";

import { TodoAccess } from "../dataLayer/todoAccess";
import { AttachMentUtils } from "../helper/attachmentUtils";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const todoAccess = new TodoAccess();

const attachmentUtils = new AttachMentUtils();

const BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET;

const getTodosByUserId = async (userId: string): Promise<TodoItem[]> => {
  return todoAccess.getTodosByUserId(userId);
};

const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  const todoId = uuid.v4() as string;

  return await todoAccess.createTodo({
    todoId,
    userId,
    name: createTodoRequest.name,
    done: false,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
  });
};

const updateTodo = async (
  updateTodoRequest: UpdateTodoRequest,
  userId: string,
  todoId: string
): Promise<void> => {
  await todoAccess.updateTodo({
    todoId,
    userId,
    name: updateTodoRequest.name,
    done: updateTodoRequest.done,
    createdAt: null,
    dueDate: updateTodoRequest.dueDate,
  });
};

const deleteTodo = async (userId: string, todoId: string): Promise<void> => {
  await todoAccess.deleteTodo(userId, todoId);
  const objectExisted = await attachmentUtils.isObjectExisted(todoId);
  if(objectExisted) {
    await attachmentUtils.deleteObject(todoId);
  }
};

const createPresignedUrl = async (fileName: string): Promise<string> => {
  return await attachmentUtils.createPresignedUrl(fileName);
};

const updateAttachmentUrl = async (todoId: string, userId: string): Promise<void> => {
  const attachmentUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${todoId}`;
  await todoAccess.updateAttachmentUrl(todoId, userId, attachmentUrl);
};

const updateTodoName = async (
  userId: string,
  todoId: string,
  name: string
): Promise<void> => {
  await todoAccess.updateTodoName(userId, todoId, name);
};

export {
  getTodosByUserId,
  createTodo,
  updateTodo,
  deleteTodo,
  createPresignedUrl,
  updateAttachmentUrl, 
  updateTodoName
};
