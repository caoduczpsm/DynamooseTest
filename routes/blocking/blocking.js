const express = require('express');
const router = express.Router();
const { checkUserInBlocklist, getBlockList, getBlockHistory, blockUser, addBlockHistory, deleteTable } = require('../../controllers/BlockingController');

router.post('/blocklist-check', checkUserInBlocklist);
router.get('/blocklist', getBlockList);
router.get('/blockhistory', getBlockHistory);
router.post('/block', blockUser);
router.post('/blockhistory', addBlockHistory);
router.delete('/delete/:table', deleteTable);


module.exports = router;