const dynamoose = require("dynamoose");
const { v4: uuidv4 } = require('uuid');

const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "ncaoduc",
    "secretAccessKey": "ncaoduc",
    "region": "us-east-1",
    "endpoint": "http://localhost:8000"
});

dynamoose.aws.ddb.local();

const blockHistorySchema = new dynamoose.Schema({
    id: {
        type: Number,
        validate: function (v) { return v > 0; },
        hashKey: true,
    },
    author: { type: String, required: true },
    reason: { type: String, required: true },
    state: { type: String, required: true },
    blocklist_id: { type: Number, required: true, rangeKey: true },
},
    {
        "timestamps": {
            "createdAt": {
                "created_at": {
                    "type": {
                        "value": Date,
                    }
                }
            },
            "updatedAt": {
                "updated": {
                    "type": {
                        "value": Date,
                    }
                }
            }
        }
    }
);

const BlockHistory = dynamoose.model("BlockHistory", blockHistorySchema);
module.exports = BlockHistory;