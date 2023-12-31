const { sendError } = require("../responses/index");
const jwt = require("jsonwebtoken");

const validateToken = {
  before: async (request) => {
    try {
      const token = request.event.headers.authorization.replace("Bearer ", "");

      if (!token) throw new Error("Token not provided");

      const data = jwt.verify(token, "a1b1c1");
      request.event.userId = data.id;
    } catch (error) {
      throw new Error("401 Unauthorized");
    }
  },
  onError: async (request) => {
    if (request.error.message === "401 Unauthorized") {
      return sendError(401, "Unauthorized");
    }

    throw request.error;
  },
};

module.exports = { validateToken };
