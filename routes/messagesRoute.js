const { addMsg, getAllMsg } = require("../controllers/messagesController.js");

const router = require("express").Router();

router.post("/addmsg/",addMsg);

router.post("/getAllMsg/",getAllMsg);

module.exports = router;