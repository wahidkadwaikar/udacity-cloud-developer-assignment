import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import {  updateTodo } from "../../businessLogic/todos";
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  await updateTodo(userId, todoId, updatedTodo);

  return {
    statusCode: 202,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({})
  };
};