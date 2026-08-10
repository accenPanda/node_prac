// This file has no work here. 
// It is just a placeholder for the BlobPandaUploadTrigger function. 
// The actual implementation is in the BlobPandaUploadTrigger.js file in the src/controllers directory.
const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');
const crypto = require('crypto');

app.eventGrid('BlobPandaUploadTrigger', {
    handler: async (eventGridEvent, context) => {
        console.log("context - ", context);
        console.log("eventGridEvent - ", eventGridEvent);

        const client = new CosmosClient({
            endpoint: process.env.COSMOS_ENDPOINT,
            key: process.env.COSMOS_KEY
        });

        const database = client.database(
            process.env.COSMOS_DATABASE
        );

        const container = database.container(
            process.env.COSMOS_CONTAINER
        );

        const fileName =
            eventGridEvent.subject.split("/").pop();

        const document = {
            id: crypto.randomUUID(),
            type: "image",
            fileName,
            blobUrl: eventGridEvent.data.url,
            contentType: eventGridEvent.data.contentType,
            size: eventGridEvent.data.contentLength,
            uploadedAt: new Date().toISOString()
        };

        await container.items.create(document);

        context.log("Document inserted");
    }
});