const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');


//auth
router.post("/signup",authController.signup);
router.post("/login",authController.login);
router.get("/logout",authController.logout);


//users
// **get all users
router.get('/',userController.getAllUsers);
// **update user
router.put("/:id",userController.updateUser)
// **delete user
router.delete('/:id',userController.deleteUser);
// **get user
router.get('/:id',userController.getUser);
// **follow user
// **unfollow user


module.exports = router;