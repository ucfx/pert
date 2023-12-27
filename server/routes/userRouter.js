const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

// router.get("/", userController.getAll);
router.post("/login", userController.login, auth.generateToken);
router.post("/register", userController.create);
router.post("/logout", userController.logout);
router.put("/:id", userController.update);
router.get("/user-info", auth.authenticate, userController.getUserInfo);
router.get("/check-is-available/:username", userController.checkIsAvailable);
// router.delete("/:id", userController.delete);

module.exports = router;
