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

exports.handler = async (event) => {
  try {
    const { title, text } = JSON.parse(event.body);
    const timestamp = new Date().toISOString();

    if (!title || !text) {
      return sendError(400, "Title and text are required");
    }

    const newNote = await createNote(title, text, timestamp, timestamp);

    return sendResponse(200, newNote);
  } catch (error) {
    return sendError(500, error.message);
  }
};
