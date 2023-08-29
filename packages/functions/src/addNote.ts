import { ApiHandler } from 'sst/node/api';
import { TimestreamWriteClient, WriteRecordsCommand } from '@aws-sdk/client-timestream-write';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import * as https from 'https';
import { constants } from "@test-app-timestream/core/constants/constants";


const agent = new https.Agent({
    maxSockets: 5000,
});

const timestreamWriteClient = new TimestreamWriteClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: constants.ACCESS_KEY_ID,
        secretAccessKey: constants.SECRET_ACCESS_KEY,
    },
    customUserAgent: 'CustomAgent',
    requestHandler: new NodeHttpHandler({
        httpsAgent: agent,
    }),
});

export const handler = ApiHandler(async (_evt) => {
    const currentTime = Date.now().toString();

    const note = {
        Dimensions: [{
            Name: 'dimension',
            Value: `${_evt.dimension}`,
            DimensionValueType: 'VARCHAR',
        }],
        MeasureName: `${_evt.measure_name}`,
        MeasureValue: `${_evt.measure_value}`,
        MeasureValueType: "VARCHAR",
        Time: currentTime,
        Content: _evt.content
    };

    const params = {
        DatabaseName: 'notes',
        TableName: 'noteslist',
        Records: [note],
    };

    try {
        await timestreamWriteClient.send(new WriteRecordsCommand(params));
        console.log('Write records successful');
    } catch (error) {
        console.error('Error writing records', error);
        if (error.name === 'RejectedRecordsException') {
            const responsePayload = JSON.parse(error.$metadata.httpResponse.body.toString());
            console.log("RejectedRecords: ", responsePayload.RejectedRecords);
            console.log("Other records were written successfully. ");
        }
    }

    return { ..._evt, time: currentTime };
});

