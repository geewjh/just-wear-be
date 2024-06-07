const jwt = require("jsonwebtoken");
const User = require("../../models/user");

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function createJWT(user) {
  const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: "2d" });
  return token;
}

module.exports = {
  create,
};
