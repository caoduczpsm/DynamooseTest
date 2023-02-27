const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
    region: "us-east-1",
    accessKeyId: "ncaoduc",
    secretAccessKey: "ncaoduc",
    sessionToken: "ncaoduc",
    endpoint: "http://localhost:8000",
});

const TABLE_NAME = "testDynamodb";

var dynamodb = new AWS.DynamoDB();

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

// var params = {
//     TableName: TABLE_NAME,
//     KeySchema: [
//         { AttributeName: "id", KeyType: "HASH" },  //Partition key
//     ],
//     AttributeDefinitions: [
//         { AttributeName: "id", AttributeType: "N" },
//     ],
//     ProvisionedThroughput: {
//         ReadCapacityUnits: 5,
//         WriteCapacityUnits: 5
//     }
// };
// dynamodb.createTable(params, function (err, data) {
//     if (err) {
//         console.error("Error JSON.", JSON.stringify(err, null, 2));
//     } else {
//         console.log("Created table.", JSON.stringify(data, null, 2));
//     }
// });


const dynamoClient = new AWS.DynamoDB.DocumentClient();
const getCharacters = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
    const characters = await dynamoClient.scan(params).promise();
    return characters;
};

const getCharacterById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    return await dynamoClient.get(params).promise();
};

const addOrUpdateCharacter = async (character) => {
    const params = {
        TableName: TABLE_NAME,
        Item: character,
    };
    return await dynamoClient.put(params).promise();
};

const deleteCharacter = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    return await dynamoClient.delete(params).promise();
};

module.exports = {
    dynamoClient,
    getCharacters,
    getCharacterById,
    addOrUpdateCharacter,
    deleteCharacter,
};