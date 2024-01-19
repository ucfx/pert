const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
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
                    message: (props) =>
                        `${props.value} is not a valid username`,
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
    },
    { strictPopulate: false }
);

// pre remove user remove all projects and tasks
userSchema.pre("findOneAndDelete", async function (next) {
    console.log("pre remove user");
    try {
        const docToDelete = await this.model.findOne(this.getQuery());

        await mongoose.model("Project").deleteMany({ userId: docToDelete._id });

        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
