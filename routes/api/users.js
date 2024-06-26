const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/users");
// require the authorization middleware function
const ensureLoggedIn = require("../../config/ensureLoggedIn");

router.post("/", usersCtrl.create);
router.post("/login", usersCtrl.login);
router.delete("/delete", usersCtrl.deleteAcc);
router.get("/check-token", ensureLoggedIn, usersCtrl.checkToken);

module.exports = router;
