const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");

async function updateNote(id, title, text, modifiedAt) {
  await db
    .update({
      TableName: "Notes",
      Key: { id },
      UpdateExpression:
        "set title = :title, text = :text, modifiedAt = :modifiedAt",
      ExpressionAttributeValues: {
        ":title": title,
        ":text": text,
        ":modifiedAt": modifiedAt,
      },
    })
    .promise();
}

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, text } = JSON.parse(event.body);
    const timestamp = new Date().toISOString();

    await updateNote(id, title, text, timestamp);

    return sendResponse(200, { message: "Note updated sucessfully" });
  } catch (error) {
    return sendError(500, error.message);
  }
};
