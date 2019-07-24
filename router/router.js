const express = require('express');
const router = express.Router();
const {signup, login, userDetail}  = require('../controller/user')


router.get('/ok', (req, res)=>{
    res.send('Router file');
});

router.post('/login', login);
router.post('/signup', signup);
router.post('/getUserDetail', userDetail);

module.exports = router;
