const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");

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

const handler = middy()
  .handler(async (event) => {
    try {
      if (event?.error && event?.error === "401") {
        return sendError(401, "Invalid token");
      }

      const { email, password } = JSON.parse(event.body);

      const user = await getUserByEmail(email);

      if (!user) {
        return sendError(404, "User not found");
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return sendError(401, "Invalid password");
      }

      const token = jwt.sign({ id: user.id }, "a1b1c1");
      return sendResponse(200, { token });
    } catch (error) {
      return sendError(500, error.message);
    }
  })
  .use(validateToken);

module.exports = { handler };
