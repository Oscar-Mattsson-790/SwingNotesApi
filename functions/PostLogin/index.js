const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function getUserByEmail(email) {
  const result = await db
    .scan({
      TableName: "Users",
      FilterExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    })
    .promise();
  return result.Items[0];
}

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const user = await getUserByEmail(email);

    if (!user) {
      return sendError(404, "User not found");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return sendError(401, "Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, "a1b1c1");

    return sendResponse(200, { token });
  } catch (error) {
    await validateToken.onError({ event, response: {} });

    if (event.error) {
      return sendError(401, "Unauthorized");
    }
    return sendError(500, error.message);
  }
};
