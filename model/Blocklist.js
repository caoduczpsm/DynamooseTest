const dynamoose = require("dynamoose");

const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "ncaoduc",
    "secretAccessKey": "ncaoduc",
    "region": "us-east-1",
    "endpoint": "http://localhost:8000"
});

dynamoose.aws.ddb.local();

const blockListSchema = new dynamoose.Schema({
    id: {
        type: Number,
        validate: function (v) { return v > 0; },
        hashKey: true,
    },
    email: { type: "String", unique: true, required: true },
    mobile: { type: "String", required: true },
    first_name: { type: "String", required: true },
    last_name: { type: "String", required: true },
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