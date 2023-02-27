const dynamoose = require("dynamoose");

const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "ncaoduc",
    "secretAccessKey": "ncaoduc",
    "region": "us-east-1",
    "endpoint": "http://localhost:8000"
});

dynamoose.aws.ddb.local();

const characterSchema = new dynamoose.Schema({
    "id": String,
    "name": String,
});

const Character = dynamoose.model("Character", characterSchema);

module.exports = Character;