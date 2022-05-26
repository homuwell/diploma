import {subscriptionField, list} from "nexus";
/*
export const updateSchemaResults = subscriptionField('updateSchemaResults', {
    type: list('SchemaResults'),
    subscribe() {
        return (async function*() {
            while (true) {
                await new Promise(res => setTimeout(res, 1000))
                yield Math.random() > 0.5
            }
        })()
    },
    resolve(eventData) {
        return eventData;
    }
})

 */