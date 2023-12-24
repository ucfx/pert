const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const userSchema = new mongoose.Schema({
    _id: Number,
    username: {
        type: String,
        required: true,
        unique: true,
        validate: [
            {
                validator: function (value) {
                    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
                        return false;
                    }
                    if (/\s/.test(value)) {
                        return false;
                    }
                    return true;
                },
                message: (props) => `${props.value} is not a valid username`,
            },
            {
                validator: async function (value) {
                    const count = await this.model("User").countDocuments({
                        username: value,
                    });
                    return count === 0;
                },
                message: (props) => `${props.value} is already taken!`,
            },
        ],
    },
    password: {
        type: String,
        required: true,
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
    ],
});

userSchema.plugin(AutoIncrement, { id: "user_counter", inc_field: "_id" });

const User = mongoose.model("User", userSchema);

module.exports = User;
