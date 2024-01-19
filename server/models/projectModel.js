const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    dependsOn: [
        {
            type: String,
        },
    ],
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
});

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },
    ],
    createdAt: { type: Date },
    updatedAt: { type: Date },
});

projectSchema.index({ title: 1, userId: 1 }, { unique: true });

projectSchema.pre("save", function (next) {
    const now = new Date();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

// pre remove project remove all tasks
projectSchema.pre("findOneAndDelete", async function (next) {
    console.log("pre remove project");
    try {
        const docToDelete = await this.model.findOne(this.getQuery());

        await mongoose.model("Task").deleteMany({ projectId: docToDelete._id });

        const User = mongoose.model("User");
        await User.findByIdAndUpdate(docToDelete.userId, {
            $pull: { projects: docToDelete._id },
        });

        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

projectSchema.pre("deleteMany", async function (next) {
    console.log("pre delete many project");
    try {
        const docsToDelete = await this.model.find(this.getQuery());

        const projectIds = docsToDelete.map((doc) => doc._id);

        await mongoose.model("Task").deleteMany({ projectId: projectIds });

        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

const Project = mongoose.model("Project", projectSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = { Project, Task };
