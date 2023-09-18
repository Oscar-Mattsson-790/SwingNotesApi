const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const middy = require("@middy/core");

async function deleteNote(id) {
  await db
    .delete({
      TableName: "Notes",
      Key: { id },
    })
    .promise();
}

const handler = middy()(async (event) => {
  try {
    const { id } = event.pathParameters;

    await deleteNote(id);

    return sendResponse(200, { message: "Note deleted successfully!" });
  } catch (error) {
    return sendError(500, error.message);
  }
}).use(validateToken);

module.exports = { handler };
