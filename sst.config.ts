import { SSTConfig } from "sst";
import { ApiGatewayStack } from "./stacks/ApiGateway";
import { AppSyncStack } from "./stacks/AppSyncStack";

export default {
  config(_input) {
    return {
      name: "test-app-timestream",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(ApiGatewayStack).stack(AppSyncStack);
  }
} satisfies SSTConfig;
