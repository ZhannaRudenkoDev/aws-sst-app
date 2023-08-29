import { ApiHandler } from "sst/node/api";
import { QueryCommand, TimestreamQuery } from "@aws-sdk/client-timestream-query";

import { constants } from "@test-app-timestream/core/constants/constants";

const queryClient = new TimestreamQuery({
    region: 'us-east-1',
    credentials: {
        accessKeyId: constants.ACCESS_KEY_ID,
        secretAccessKey: constants.SECRET_ACCESS_KEY,
    }
});

export const handler = ApiHandler(async (_evt) => {
    const params = {
        QueryString: 'SELECT * FROM "notes"."noteslist" ORDER BY "time" DESC',
    };

    try {
        const response = await queryClient.send(new QueryCommand(params));
        console.log('Success!');
        return response.Rows;
    } catch (error) {
        console.error('Error while querying:', error);
        return [];
    }
});
