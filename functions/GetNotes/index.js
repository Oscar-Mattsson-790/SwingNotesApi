const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const middy = require("@middy/core");

async function getNotes() {
  const result = await db.scan({ TableName: "Notes" }).promise();
  return result.Items;
}

const handler = middy()(async () => {
  try {
    const notes = await getNotes();
    return sendResponse(200, notes);
  } catch (error) {
    return sendError(500, error.message);
  }
}).use(validateToken);

module.exports = { handler };
