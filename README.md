# Zero Scale Zeebe

A Zeebe Worker for integration with Serverless (AWS / Azure Web Function / OpenWhisk). Allows you to run workers at zero-scale (nothing running when there is no work).

This worker listens for configured tasks and invokes remote lambda functions via a REST POST.

This worker loads up a JSON map of task types to lambda urls of this format:

```JSON
{
    "tasks": {
        "task-type": "https://lambda-url"
    }
}
```

The map is reloaded every 30 seconds, so the task type mapping can be updated.

Set the environment variable `ZEEBE_TASK_MAP_FILE` to point to this map, and set the environment variable `ZEEBE_GATEWAY_ADDRESS` to point to the Zeebe gRPC gateway.

Then run `node dst/index.js`

## Demo

To run the demo:

* Install dependencies:

```
npm i
npm i -g ts-node
```

* In Terminal 1 - Start a broker:

```
cd demo
docker-compose up
```

* In Terminal 2 - Start the Lambda Emulator REST Server. This server emulates an AWS Lambda / SQS or other endpoint.

```
cd demo
ts-node server.ts
```

* In Terminal 3 - Start the Zero-Scale worker:

```
ZEEBE_TASK_MAP_FILE=../demo/taskmap.json ZEEBE_GATEWAY_ADDRESS=localhost:26500 ts-node src/index.ts
```

* In Terminal 4 - deploy the test workflow:

```
cd demo
ts-node deploy.ts
```

* In Terminal 4 - start a workflow:

```
cd demo
ts-node start.ts
```