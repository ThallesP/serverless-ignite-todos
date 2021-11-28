import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamoDBClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users_todos",
      IndexName: "user_id_index",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    })
    .promise();

  const { Items: userTodos } = response;

  if (userTodos.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "User doesn't exists" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(userTodos),
  };
};
