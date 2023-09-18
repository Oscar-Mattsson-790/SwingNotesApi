const { sendError } = require("../responses/index");

const validateToken = {
  before: async (request) => {
    try {
      const token = request.event.headers.authorization.replace("Bearer ", "");

      console.log("Extracted token:", token);
      if (!token) throw new Error("Token not provided");

      const data = jwt.verify(token, "a1b1c1");
      request.event.id = data.id;
      request.event.username = data.username;
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
