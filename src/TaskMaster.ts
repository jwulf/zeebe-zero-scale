import axios from "axios";
import { ZBClient, ZBWorker } from "zeebe-node";

interface Workers {
  [taskType: string]: {
    url: string;
    worker: ZBWorker<any, any, any>;
  };
}

export class TaskMaster {
  client: ZBClient;
  workers: Workers;
  taskMapFilename: string;

  constructor(taskMapFilename: string, gatewayAddress: string) {
    this.workers = {};
    this.client = new ZBClient(gatewayAddress);
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
    Object.keys(this.workers).forEach(taskType => {
      if (!taskMap[taskType]) {
        console.log(`Removing worker for ${taskType}`);
        this.workers[taskType].worker.close();
        delete this.workers[taskType];
      }
    });
    // Update or create
    Object.keys(taskMap).forEach(taskType => {
      const newUrl = taskMap[taskType];
      if (this.workers[taskType]) {
        const currentUrl = this.workers[taskType].url;
        if (currentUrl != newUrl) {
          console.log(`Updating existing worker for ${taskType} to ${newUrl}`);
          this.workers[taskType].worker.close();
          this.createWorker(taskType, newUrl);
        }
      } else {
        console.log(`Creating new worker for ${taskType} at ${newUrl}`);
        this.createWorker(taskType, newUrl);
      }
    });
  }

  createWorker(taskType: string, url: string) {
    this.workers[taskType] = {
      url,
      worker: this.client.createWorker(taskType, taskType, (job, complete) => {
        axios
          .post(url, job)
          .then(({ data }) => complete.success(data))
          .catch(e => complete.failure(e));
      })
    };
  }
}
