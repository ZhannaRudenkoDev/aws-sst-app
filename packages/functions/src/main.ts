import { handler as addNote } from './addNote';
import TNote from "./graphql/note.type";

type AppSyncEvent = {
    info: {
        fieldName: string;
    };
    arguments: {
        value: TNote;
    };
};

export async function handler(event: AppSyncEvent) {
    switch (event.info.fieldName) {
        case "addNote":
            return await addNote(event.arguments.value);
        default:
            return null;
    }
}
