const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

async function createUser(email, password) {
  const userId = nanoid();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: userId,
    email,
    password: hashedPassword,
  };

  await db
    .put({
      TableName: "Users",
      Item: user,
    })
    .promise();

  return user;
}

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return sendError(400, "Email and password are required");
    }

    const newUser = await createUser(email, password);

    return sendResponse(200, { userId: newUser.id, email: newUser.email });
  } catch (error) {
    return sendError(500, error.message);
  }
};
