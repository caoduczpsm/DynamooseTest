const express = require('express');
const AWS = require("aws-sdk");
const app = express();

const CharacterModel = require('./model/character');

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
});

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
});

const TABLE_NAME = "Character";

// const {
//     addOrUpdateCharacter,
//     getCharacters,
//     deleteCharacter,
//     getCharacterById,
// } = require('./config/connect');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Get All Records
app.get('/characters', async (req, res) => {
    try {
        const characters = await CharacterModel.scan().exec();
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

// Post one record
app.post('/characters', async (req, res) => {
    const newCharacter = req.body;
    try {
        const characters = await CharacterModel.create(newCharacter);
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

// Get one record by id
app.get('/characters/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const characters = await CharacterModel.get(id);
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

// Delete one record by id
app.delete('/characters/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const characters = await CharacterModel.delete(id);
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

// Update one record by id
app.put('/characters/:id', async (req, res) => {
    const id = req.params.id;
    const newCharacter = req.body;
    try {
        const characters = await CharacterModel.update({ "id": id }, { "name": newCharacter.name });
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

//Delete all record
app.delete('/characters', async (req, res) => {
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
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});