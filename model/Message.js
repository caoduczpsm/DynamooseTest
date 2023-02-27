const dynamoose = require("dynamoose");
const UserModel = require('../model/User');
const ChatModel = require('../model/Chat');

const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "ncaoduc",
    "secretAccessKey": "ncaoduc",
    "region": "us-east-1",
    "endpoint": "http://localhost:8000"
});

dynamoose.aws.ddb.local();

const messageSchema = new dynamoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    sender: {
        "type": String,
        "schema": [UserModel]
    },
    content: { type: String, trim: true },
    chat: {
        "type": String,
        "schema": [ChatModel]
    },
    readBy: {
        "type": String,
        "schema": [UserModel]
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

const Message = dynamoose.model("Message", messageSchema);

module.exports = Message;

