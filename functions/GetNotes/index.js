const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");

async function getNotes() {
  const result = await db.scan({ TableName: "Notes" }).promise();
  return result.Items;
}

exports.handler = async () => {
  try {
    const notes = await getNotes();
    return sendResponse(200, notes);
  } catch (error) {
    return sendError(500, error.message);
  }
};
