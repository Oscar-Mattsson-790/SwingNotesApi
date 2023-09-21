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

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const { id } = event.pathParameters;

      await deleteNote(id);

      return sendResponse(200, { message: "Note deleted successfully!" });
    } catch (error) {
      return sendError(500, error.message);
    }
  });

module.exports = { handler };
