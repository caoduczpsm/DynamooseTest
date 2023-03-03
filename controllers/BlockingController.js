const asyncHandler = require('express-async-handler');
const AWS = require("aws-sdk");
const { SortOrder } = require("dynamoose/dist/General");
const BlockListModel = require('../model/Blocklist');
const BlockHistoryModel = require('../model/BlockHistory');

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
});

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
});

// GET: All Block List
// URL: http://localhost:3000/api/blocking/blocklist
getBlockList = asyncHandler(async (req, res, next) => {
    try {
        const blocklist = await BlockListModel.scan().exec();
        res.json(blocklist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

// GET: Block List By User Id
// URL: http://localhost:3000/api/blocking/blocklist
getBlockListById = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;
    const blockListById = await BlockListModel.get(parseInt(userId, 10));
    if (blockListById) {
        res.json(blockListById);
    } else {
        res.status(404).json({ err: 'User not found' });
    }
});

// GET: All Block History
// URL: http://localhost:3000/api/blocking/blockhistory
getBlockHistory = asyncHandler(async (req, res, next) => {
    try {
        const blockhistory = await BlockHistoryModel.scan().exec();
        res.json(blockhistory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

// GET: Block List By Block List Id
// URL: http://localhost:3000/api/blocking/blockhistory/:id
getBlockHistoryById = asyncHandler(async (req, res, next) => {
    const blockListId = req.params.id;
    BlockHistoryModel.scan({ "blocklist_id": parseInt(blockListId, 10) }).exec((err, blockHistoryResult) => {
        if (err) {
            res.status(404).json({ err: 'Block History not found' });
        } else {
            res.json(blockHistoryResult);
        }
    });

});

// POST: Block User
// URL: http://localhost:3000/api/blocking/block
blockUser = asyncHandler(async (req, res, next) => {
    const { email, mobile, first_name, last_name } = req.body;
    const response = await BlockListModel.scan().count().exec();
    const currentId = response.count + 1;
    try {
        const newBlockList = {
            "id": currentId,
            "email": email,
            "mobile": mobile,
            "first_name": first_name,
            "last_name": last_name,
        };
        const blocklist = await BlockListModel.create(newBlockList);
        res.json(blocklist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

// POST: Add One Record Block History
// URL: http://localhost:3000/api/blocking/blockhistory
addBlockHistory = asyncHandler(async (req, res, next) => {
    const newBlockHistoryRequest = req.body;
    const response = await BlockHistoryModel.scan().count().exec();
    const currentId = response.count + 1;
    try {
        const newBlockHistory = {
            "id": currentId,
            "author": newBlockHistoryRequest.author,
            "reason": newBlockHistoryRequest.reason,
            "state": newBlockHistoryRequest.state,
            "blocklist_id": newBlockHistoryRequest.blocklist_id,
        };
        const blockhistory = await BlockHistoryModel.create(newBlockHistory);
        res.json(blockhistory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
})

// DELETE: Delete Table By Table Name
// URL: http://localhost:3000/api/blocking/delete/:table
deleteTable = asyncHandler(async (req, res, next) => {
    let TABLE_NAME = req.params.table;
    var params = {
        TableName: TABLE_NAME
    };

    ddb.deleteTable(params, function (err, data) {
        if (err && err.code === 'ResourceNotFoundException') {
            res.status(500).json({ message: "Error: Table not found" });
        } else if (err && err.code === 'ResourceInUseException') {
            res.status(500).json({ message: "Error: Table in use" });
        } else {
            res.status(200).json({ message: "Success" });
        }
    });
})

// POST: Check User Is In Block List By Email and Mobile
// URL: http://localhost:3000/api/blocking/blocklist-check
isPassedBlocklistCheck = asyncHandler(async (req, res, next) => {
    const { email, mobile } = req.body;
    await BlockListModel.scan("email").eq(email).and().where("mobile").eq(mobile).exec(async (err, blockListResult) => {
        if (err) {
            res.json({ "error": err })
        } else {
            if (!(blockListResult.count === 0)) {
                await BlockHistoryModel.scan({ "blocklist_id": blockListResult[0].id }).exec((error, historyResult) => {
                    if (error) {
                        res.json({ "error": error })
                    } else {
                        historyResult.sort((history1, history2) => {
                            if (history1.id < history2.id) {
                                return -1;
                            }
                        })
                        if (historyResult[historyResult.length - 1].state === "BLOCKED") {
                            res.status(403);
                            res.json({ message: "Please contact to admin system to book this rom!" });
                        } else {
                            //next();
                            res.json({ message: "Success" });
                        }
                    }
                });
            } else {
                //next();
                res.json({ message: "Success" });
            }

        }
    });

});

module.exports = {
    isPassedBlocklistCheck, getBlockList, getBlockHistory,
    blockUser, addBlockHistory, deleteTable, getBlockListById, getBlockHistoryById
};