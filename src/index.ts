import { TaskMaster } from "./TaskMaster";
const taskMapFileName = process.env.ZEEBE_TASK_MAP_FILE;
const gatewayAddress = process.env.ZEEBE_GATEWAY_ADDRESS || "localhost";

if (!taskMapFileName) {
  console.log("No value found for ZEEBE_TASK_MAP_FILE!");
  process.exit(1);
}

if (!gatewayAddress) {
  console.log("No value found for ZEEBE_GATEWAY_ADDRESS!");
  process.exit(1);
}

const taskMaster = new TaskMaster(taskMapFileName!, gatewayAddress!);
