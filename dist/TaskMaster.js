"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMaster = void 0;
const axios_1 = __importDefault(require("axios"));
const zeebe_node_1 = require("zeebe-node");
const object_hash_1 = __importDefault(require("object-hash"));
class TaskMaster {
    constructor(taskMapFilename) {
        this.workers = {};
        this.client = new zeebe_node_1.ZBClient();
        this.taskMapFilename = taskMapFilename;
        this.loadTaskMap();
        setInterval(() => this.loadTaskMap(), 30000);
    }
    loadTaskMap() {
        const taskMapConfig = require(this.taskMapFilename);
        const taskMap = taskMapConfig.tasks;
        if (!taskMap) {
            console.log("No tasks found!");
            return;
        }
        // Remove any workers that were removed in the task map
        Object.keys(this.workers).forEach((taskType) => {
            if (!taskMap[taskType]) {
                console.log(`Removing worker for ${taskType}`);
                this.workers[taskType].worker.close();
                delete this.workers[taskType];
            }
        });
        // Update or create
        Object.keys(taskMap).forEach((taskType) => {
            const { url, method, headers } = taskMap[taskType];
            const newOptions = { url, method, headers };
            if (this.workers[taskType]) {
                const currentHash = this.workers[taskType].hash;
                if (currentHash != this.createHash(newOptions)) {
                    console.log(`Updating existing worker for ${taskType} at ${newOptions.url}`);
                    this.workers[taskType].worker.close();
                    this.createWorker(taskType, newOptions);
                }
            }
            else {
                console.log(`Creating new worker for ${taskType} at ${newOptions.url}`);
                this.createWorker(taskType, newOptions);
            }
        });
    }
    createHash({ url, method, headers }) {
        return (0, object_hash_1.default)({ url, method, headers });
    }
    createWorker(taskType, { url, method, headers }) {
        this.workers[taskType] = {
            hash: this.createHash({ url, method, headers }),
            worker: this.client.createWorker({
                taskType,
                taskHandler: job => (0, axios_1.default)({
                    method,
                    url,
                    data: job.variables,
                    headers,
                })
                    .then(({ data }) => job.complete(data))
                    .catch(e => job.fail(e)),
            }),
        };
    }
}
exports.TaskMaster = TaskMaster;
