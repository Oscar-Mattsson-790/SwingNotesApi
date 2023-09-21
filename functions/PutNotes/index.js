const middy = require("@middy/core");
const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const { validateToken } = require("../../middleware/auth");

async function updateNote(id, title, text, modifiedAt) {
  await db
    .update({
      TableName: "Notes",
      Key: { id },
      UpdateExpression:
        "set title = :title, #textAttribute = :text, modifiedAt = :modifiedAt",
      ExpressionAttributeNames: {
        "#textAttribute": "text",
      },
      ExpressionAttributeValues: {
        ":title": title,
        ":text": text,
        ":modifiedAt": modifiedAt,
      },
    })
    .promise();
}

const handler = middy()
  .handler(async (event) => {
    try {
      const { id } = event.pathParameters;
      const { title, text } = JSON.parse(event.body);
      const timestamp = new Date().toISOString().slice(0, 10);

      if (title && title.length > 50) {
        return sendError(400, "Title should not exceed 50 characters");
      }

      if (text && text.length > 300) {
        return sendError(400, "text should not exceed 300 characters");
      }

      await updateNote(id, title, text, timestamp);

      return sendResponse(200, { message: "Note updated sucessfully" });
    } catch (error) {
      return sendError(500, error.message);
    }
  })
  .use(validateToken);

module.exports = { handler };
