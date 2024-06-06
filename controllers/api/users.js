async function create(req, res) {
  return res.json({
    name: req.body.username,
    email: req.body.email,
  });
}

module.exports = {
  create,
};
