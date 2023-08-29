import { StackContext, Api as ApiGateway } from "sst/constructs";

export function ApiGatewayStack({ stack }: StackContext) {
    const apiGateway = new ApiGateway(stack, "ApiGateway", {
        routes: {
            "GET /notes": "packages/functions/src/notes.handler",
        },
    });

    stack.addOutputs({
        ApiEndpoint: apiGateway.url,
    });
}
