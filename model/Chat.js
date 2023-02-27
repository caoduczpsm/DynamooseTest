const dynamoose = require("dynamoose");
const UserModel = require('../model/User');
const MessageModel = require('../model/Message');

const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "ncaoduc",
    "secretAccessKey": "ncaoduc",
    "region": "us-east-1",
    "endpoint": "http://localhost:8000"
});

dynamoose.aws.ddb.local();

const chatSchema = new dynamoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    user: [{
        "type": String,
        "schema": [UserModel]
    }],
    latestMessage: {
        "type": String,
        "schema": [MessageModel]
    },
    groupAdmin: {
        "type": String,
        "schema": [MessageModel]
    },
},
    {
        "timestamps": {
            "createdAt": {
                "created_at": {
                    "type": {
                        "value": Date,
                        "settings": {
                            "storage": "iso"
                        }
                    }
                }
            },
            "updatedAt": {
                "updated": {
                    "type": {
                        "value": Date,
                        "settings": {
                            "storage": "seconds"
                        }
                    }
                }
            }
        }
    }
);

const Chat = dynamoose.model("Chat", chatSchema);

module.exports = Chat;
