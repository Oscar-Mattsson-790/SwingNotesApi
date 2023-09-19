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

async function checkUserExists(email) {
  const result = await db
    .scan({
      TableName: "Users",
      FilterExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    })
    .promise();

  return result.Items && result.Items.length > 0;
}

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return sendError(400, "Email and password are required");
    }

    const userExists = await checkUserExists(email);
    if (userExists) {
      return sendError(400, "A user with this email already exists");
    }

    const newUser = await createUser(email, password);

    return sendResponse(200, { userId: newUser.id, email: newUser.email });
  } catch (error) {
    return sendError(500, error.message);
  }
};
