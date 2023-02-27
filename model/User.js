const bcrypt = require("bcryptjs");
const dynamoose = require("dynamoose");

const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "ncaoduc",
    "secretAccessKey": "ncaoduc",
    "region": "us-east-1",
    "endpoint": "http://localhost:8000"
});

dynamoose.aws.ddb.local();

const userSchema = new dynamoose.Schema({
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
        type: "String",
        required: true,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
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

const User = dynamoose.model("User", userSchema);

User.methods.set("matchPassword", async function (enteredPassword) {
    return enteredPassword === this.password ? true : false;
});

// User.pre("save", async function (next) {
//     if (!this.isModified) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = bcrypt.hash(this.password, salt);
// });

module.exports = User;

