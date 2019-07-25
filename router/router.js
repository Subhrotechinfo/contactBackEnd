const express = require('express');
const router = express.Router();
const {signup, login, userDetail,updateUserProfile , 
    addContact, getSingleContact, getAllContacts, 
    deletSingleContact, singleContactUpdate}  = require('../controller/user')


router.get('/ok', (req, res)=>{
    res.send('Router file');
});

router.post('/login', login);
router.post('/signup', signup);
router.post('/getUserDetail', userDetail);
router.put('/updateUserProfile',updateUserProfile);

router.post('/addContact', addContact);
router.post('/getSingleContact', getSingleContact);
router.post('/getAllContacts', getAllContacts);
router.post('/deleteSingleContact', deletSingleContact);
router.put('/singleUpdate', singleContactUpdate)

module.exports = router;
