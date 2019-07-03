import axios from "axios";
import { ZBClient, ZBWorker } from "zeebe-node";
import hash from "object-hash";

interface Workers {
  [taskType: string]: {
    hash: string;
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
      const { url, method, headers } = taskMap[taskType];
      const newOptions = { url, method, headers };
      if (this.workers[taskType]) {
        const currentHash = this.workers[taskType].hash;
        if (currentHash != this.createHash(newOptions)) {
          console.log(
            `Updating existing worker for ${taskType} at ${newOptions.url}`
          );
          this.workers[taskType].worker.close();
          this.createWorker(taskType, newOptions);
        }
      } else {
        console.log(`Creating new worker for ${taskType} at ${newOptions.url}`);
        this.createWorker(taskType, newOptions);
      }
    });
  }

  createHash({ url, method, headers }) {
    return hash({ url, method, headers });
  }

  createWorker(taskType: string, { url, method, headers }) {
    this.workers[taskType] = {
      hash: this.createHash({ url, method, headers }),
      worker: this.client.createWorker(taskType, taskType, (job, complete) => {
        axios({
          method: method,
          url: url,
          data: job.variables,
          headers: headers,
        })
          .then(({ data }) => complete.success(data))
          .catch(e => complete.failure(e));
      }),
    };
  }
}
