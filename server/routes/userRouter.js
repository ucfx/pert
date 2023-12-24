const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

router.get("/", userController.getAll);
router.post("/login", userController.login, auth.generateToken);
router.post("/register", userController.create);
router.get("/:id", userController.getOne);
router.put("/:id", userController.update);
router.get("/check-is-available/:username", userController.checkIsAvailable);
router.delete("/:id", userController.delete);

module.exports = router;
