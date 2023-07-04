const Express = require("express");
const {getAll,addmsg } = require("../Controller/MessageControler");

const router = Express.Router();

router.post("/addmsg",addmsg);
router.post('/getmsg',getAll)




module.exports = router;