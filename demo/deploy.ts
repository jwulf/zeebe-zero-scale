import { ZBClient } from "zeebe-node";

async function main() {
  const zbc = new ZBClient("localhost");
  const res = await zbc.deployWorkflow("./taskmap.bpmn");
  console.log(res);
}

main();
