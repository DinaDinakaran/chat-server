const Express = require("express");
const { Register ,Login,setAvatar,exportAll,forgetpassword,resetpassword} = require("../Controller/Auth");

const router = Express.Router();

router.post("/register",Register);
router.post("/resetpassword",resetpassword);
router.post("/forgetpassword",forgetpassword);
router.post("/login",Login);
router.post("/setAvatar/:id",setAvatar);
router.get("/getcontacts/:id",exportAll);




module.exports = router;