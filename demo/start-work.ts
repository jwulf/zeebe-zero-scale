import { ZBClient } from "zeebe-node";

async function main() {
  const zbc = new ZBClient();
  await zbc.deployProcess("./taskmap.bpmn");
  const res = await zbc.createProcessInstance("test-workflow", {
    test: "data",
    variable: "value"
  });
  console.log(res);
}

main();
