import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const XAWS = AWSXRay.captureAWS(AWS);

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.TODOS_TABLE_GSI,
    private readonly todoBucket = process.env.TODOS_S3_BUCKET
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log("getting all todos for user with id", userId);
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      })
      .promise();

    const items = result.Items;
    return items as TodoItem[];
  }
  async getTodo(todoId: string, userId: string): Promise<TodoItem> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: "todoId = :todoId and userId = :userId",
        ExpressionAttributeValues: {
          ":todoId": todoId,
          ":userId": userId
        }
      })
      .promise();

    const item = result.Items[0];
    return item as TodoItem;
  }
  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem
      })
      .promise();

    return todoItem;
  }

  async updateTodoAttachmentUrl(
    userId: string,
    todoId: string,
    attachmentUrl: string
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: "set attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": `https://${this.todoBucket}.s3.amazonaws.com/${attachmentUrl}`
        }
      })
      .promise();
  }

  async deleteTodo(userId: string, todoId: string) {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise();
  }

  async updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest): Promise<void>{
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression:
          "set #todoName = :name, done = :done, dueDate = :dueDate",
        ExpressionAttributeNames: {
          "#todoName": "name"
        },
        ExpressionAttributeValues: {
          ":name": updatedTodo.name,
          ":done": updatedTodo.done,
          ":dueDate": updatedTodo.dueDate
        }
      })
      .promise();
  }
}
