const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
});



var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const createTable = function () {
    var params = {
        AttributeDefinitions: [
            {
                AttributeName: 'id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'name',
                AttributeType: 'S'
            }
        ],
        KeySchema: [
            {
                AttributeName: 'id',
                KeyType: 'HASH'
            },
            {
                AttributeName: 'name',
                KeyType: 'RANGE'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        },
        TableName: TABLE_NAME,
        StreamSpecification: {
            StreamEnabled: false
        }
    };

    // Call DynamoDB to create the table
    ddb.createTable(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Table Created", data);
        }
    });
}



const deleteTable = function () {
    var params = {
        TableName: TABLE_NAME
    };

    ddb.deleteTable(params, function (err, data) {
        if (err && err.code === 'ResourceNotFoundException') {
            console.log("Error: Table not found");
        } else if (err && err.code === 'ResourceInUseException') {
            console.log("Error: Table in use");
        } else {
            console.log("Success", data);
        }
    });
}

// createTable();
deleteTable();


