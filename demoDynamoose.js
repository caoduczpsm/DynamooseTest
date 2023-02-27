const dynamoose = require("dynamoose");

// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "ncaoduc",
    "secretAccessKey": "ncaoduc",
    "region": "us-east-1",
    "endpoint": "http://localhost:8000"
});

dynamoose.aws.ddb.local();

const User = dynamoose.model("User",
    {
        "id": Number,
        "name": String
    });

User.create({ "id": 1, "name": "Duc" });

const getUser = async function () {
    const myUser = await User.get(1);
    console.log(myUser);
}

getUser();
