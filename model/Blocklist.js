const dynamoose = require("dynamoose");

const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "ncaoduc",
    "secretAccessKey": "ncaoduc",
    "region": "us-east-1",
    "endpoint": "http://localhost:8000"
});

dynamoose.aws.ddb.local();

const blockListSchema = new dynamoose.Schema({
    _id: {
        type: Number,
        validate: function (v) { return v > 0; },
        hashKey: true,
    },
    email: { type: "String", unique: true, required: true, rangeKey: true },
    mobile: { type: "String", required: true },
    firstName: { type: "String", required: true },
    lastName: { type: "String", required: true },
    ssn: { type: "String" },
},
    // {
    //     "timestamps": {
    //         "createdAt": {
    //             "created_at": {
    //                 "type": {
    //                     "value": Date,
    //                 }
    //             }
    //         },
    //         "updatedAt": {
    //             "updated": {
    //                 "type": {
    //                     "value": Date,
    //                 }
    //             }
    //         }
    //     }
    // }
);

const BlockList = dynamoose.model("BlockList", blockListSchema);

module.exports = BlockList;