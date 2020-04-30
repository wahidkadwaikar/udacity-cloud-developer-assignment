import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";
import { getUserIdFromEvent } from "../../auth/utils";
import { getAllTodos } from "../../businessLogic/todos";
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodosHandler');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  logger.info('Get all todos', event);
  const userId = getUserIdFromEvent(event);

  const items = await getAllTodos(userId);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      items
    })
  }
};
