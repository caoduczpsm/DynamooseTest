const asyncHandler = require('express-async-handler');
const AWS = require("aws-sdk");
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

getBlockList = asyncHandler(async (req, res, next) => {
    try {
        const blocklist = await BlockListModel.scan().exec();
        res.json(blocklist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

getBlockHistory = asyncHandler(async (req, res, next) => {
    try {
        const blockhistory = await BlockHistoryModel.scan().exec();
        res.json(blockhistory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});


blockUser = asyncHandler(async (req, res, next) => {
    const { email, mobile, firstName, lastName } = req.body;
    const response = await BlockListModel.scan().count().exec();
    const currentId = response.count + 1;
    try {
        const newBlockList = {
            "_id": currentId,
            "email": email,
            "mobile": mobile,
            "firstName": firstName,
            "lastName": lastName,
        };
        const blocklist = await BlockListModel.create(newBlockList);
        res.json(blocklist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

addBlockHistory = asyncHandler(async (req, res, next) => {
    const newBlockHistoryRequest = req.body;
    const response = await BlockHistoryModel.scan().count().exec();
    const currentId = response.count + 1;
    try {
        const newBlockHistory = {
            "_id": currentId,
            "author": newBlockHistoryRequest.author,
            "reason": newBlockHistoryRequest.reason,
            "blockstate": newBlockHistoryRequest.blockstate,
            "blocklist_id": newBlockHistoryRequest.blocklist_id,
        };
        const blockhistory = await BlockHistoryModel.create(newBlockHistory);
        res.json(blockhistory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
})

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


checkUserInBlocklist = asyncHandler(async (req, res, next) => {
    const { email, mobile } = req.body;
    await BlockListModel.scan({ "email": email, "mobile": mobile }).exec(async (err, blockListResult) => {
        if (err) {
            console.log(err);
        } else {
            await BlockHistoryModel.scan({ "blocklist_id": blockListResult[0]._id }).exec((error, historyResoult) => {
                if (error) {
                    console.log(err);
                } else {
                    if (historyResoult[0].blockstate === "BLOCKED") {
                        res.status(403);
                        res.json({ message: "Please contact to admin system to book this rom!" });
                    } else {
                        //next();
                        res.json({ message: "Success" });
                    }
                }
            });
        }
    });

});

module.exports = { checkUserInBlocklist, getBlockList, getBlockHistory, blockUser, addBlockHistory, deleteTable };