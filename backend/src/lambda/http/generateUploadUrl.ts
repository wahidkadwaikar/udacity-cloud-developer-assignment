import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";

import { GenerateUploadUrlRequest } from "../../requests/GenerateUploadUrlRequest";

import { generateUploadUrl } from '../../businessLogic/todos'
import { getUserId } from "../utils";


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const url: GenerateUploadUrlRequest = JSON.parse(event.body);
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  
  
  const uploadUrl = await generateUploadUrl(userId, todoId, url);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  };
};
