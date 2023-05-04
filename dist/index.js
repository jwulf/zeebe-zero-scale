"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TaskMaster_1 = require("./TaskMaster");
const taskMapFileName = process.env.ZEEBE_TASK_MAP_FILE;
if (!taskMapFileName) {
    console.log("No value found for ZEEBE_TASK_MAP_FILE!");
    process.exit(1);
}
const taskMaster = new TaskMaster_1.TaskMaster(taskMapFileName);
