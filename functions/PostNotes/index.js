const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const { nanoid } = require("nanoid");

async function createNote(title, text, createdAt, modifiedAt) {
  const noteId = nanoid();

  const note = {
    id: noteId,
    title,
    text,
    createdAt,
    modifiedAt,
  };

  await db
    .put({
      TableName: "Notes",
      Item: note,
    })
    .promise();

  return note;
}

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const { title, text } = JSON.parse(event.body);
      const timestamp = new Date().toISOString().slice(0, 10);

      if (!title || !text) {
        return sendError(400, "Title and text are required");
      }

      if (title.length > 50) {
        return sendError(400, "Title should not exceed 50 characters");
      }

      if (text.length > 300) {
        return sendError(400, "Text should not exceed 300 characters");
      }

      const newNote = await createNote(title, text, timestamp, timestamp);
      return sendResponse(200, newNote);
    } catch (error) {
      return sendError(500, error.message);
    }
  });

module.exports = { handler };
