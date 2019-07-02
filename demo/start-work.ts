import { ZBClient } from "zeebe-node";

async function main() {
  const zbc = new ZBClient("localhost");
  const res = await zbc.createWorkflowInstance("test-workflow", {
    test: "data",
    variable: "value"
  });
  console.log(res);
}

main();
