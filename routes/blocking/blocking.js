const express = require('express');
const router = express.Router();
const { isPassedBlocklistCheck, getBlockList, getBlockHistory, blockUser, addBlockHistory, deleteTable, getBlockListById, getBlockHistoryById } = require('../../controllers/BlockingController');

router.get('/blocklist', getBlockList);
router.get('/blocklist/:id', getBlockListById);
router.get('/blockhistory', getBlockHistory);
router.get('/blockhistory/:id', getBlockHistoryById);
router.post('/blocklist-check', isPassedBlocklistCheck);
router.post('/block', blockUser);
router.post('/blockhistory', addBlockHistory);
router.delete('/delete/:table', deleteTable);


module.exports = router;