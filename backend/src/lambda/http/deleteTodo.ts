import "source-map-support/register";

import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    APIGatewayProxyHandler
} from "aws-lambda";

import { deleteTodo } from "../../businessLogic/todos";
import { getUserId } from "../utils";

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);

    await deleteTodo(userId, todoId);

    return {
        statusCode: 202,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({})
    };
};