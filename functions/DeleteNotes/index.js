const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");

async function deleteNote(id) {
  await db
    .delete({
      TableName: "Notes",
      Key: { id },
    })
    .promise();
}

exports.handler = async (event) => {
  try {
    const { id } = event.pathParameters;

    await deleteNote(id);

    return sendResponse(200, { message: "Note deleted successfully!" });
  } catch (error) {
    return sendError(500, error.message);
  }
};
