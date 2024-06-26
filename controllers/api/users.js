const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const Closet = require("../../models/closet");

module.exports = {
  create,
  login,
  checkToken,
  deleteAcc,
};

function checkToken(req, res) {
  // req.user will always be there for you when a token is sent
  console.log("req.user", req.user);
  res.json(req.exp);
}

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.status(201).json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.sendStatus(404); //page not found

    const isPasswordSame = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordSame) return res.sendStatus(403); // forbidden

    const token = createJWT(user);
    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function createJWT(user) {
  const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: "2d" });
  return token;
}

async function deleteAcc(req, res) {
  try {
    const deletedCloset = await Closet.deleteMany({
      user: req.user._id,
    });

    const deletedUser = await User.findOneAndDelete({
      _id: req.user._id,
    });

    res.status(200).json({ deletedCloset, deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
