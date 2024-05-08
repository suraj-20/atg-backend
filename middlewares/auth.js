const { validateToken } = require("../services/authentication");

const fetchUser = async (req, res, next) => {
  const token = req.header("token");
  // console.log("token", token);

  if (!token) {
    res.status(401).json({ error: "Authenticate using valid token" });
  } else {
    try {
      const data = validateToken(token);
      req.user = data;
      next();
    } catch (error) {
      res.status(401).json({ error: "Authenticate using valid token" });
    }
  }
};

module.exports = {
  fetchUser,
};
