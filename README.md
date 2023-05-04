# Zero Scale Zeebe

A Zeebe Worker for integration with Serverless (AWS / Azure Web Function / OpenWhisk) or other JSON-based HTTP APIs. Allows you to run workers at zero-scale (nothing running when there is no work).

OK, it's not zero scale, because you need this one worker running. But it is one worker for multiple task types - not one worker per-task type.

This worker is configured via a JSON file containing a map of task types to REST endpoints.

It polls for configured tasks and invokes remote HTTP endpoints via GET or POST.

This configuration file looks like this:

```JSON
{
  "tasks": {
    "test-task": {
      "url": "http://localhost:3000/getExample?foo=bar&baz=foo",
      "method": "get",
      "headers": { "Content-Type": "application/json" }
    },
    "test-task2": {
      "url": "http://localhost:3000/postExample",
      "method": "post",
      "headers": { "X-My-Custom-Header": "woopWoop" }
    }
  }
}

```

The map is reloaded every 30 seconds, so the task type mapping can be updated.

## Usage

Install dependencies: 

```bash
npm i
```

Build: 

```bash 
npm run build
```

Set the environment variable `ZEEBE_TASK_MAP_FILE` to point to your JSON map (there is an example in the `demo` subdirectory).

Then run `npm start`

## Demo

To run the demo:

- Install dependencies:

```
npm i
npm i -g typescript ts-node
```

- In Terminal 1 - Start a broker:

```
cd demo
docker-compose up
```

- In Terminal 2 - Start the Lambda Emulator REST Server. This server emulates an AWS Lambda / SQS or other endpoint.

```
cd demo
ts-node server.ts
```

- In Terminal 3 - Start the Zero-Scale worker:

```
ZEEBE_TASK_MAP_FILE=../demo/taskmap.json ts-node src/index.ts
```

- In Terminal 4 - start a workflow:

```
cd demo
ts-node start-work.ts
```
