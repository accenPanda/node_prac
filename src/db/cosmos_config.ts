import { CosmosClient } from "@azure/cosmos";

const endpoint =
  process.env.COSMOS_ENDPOINT ||
  process.env.APPSETTING_COSMOS_ENDPOINT;

const key =
  process.env.COSMOS_PRIMARY_KEY ||
  process.env.APPSETTING_COSMOS_PRIMARY_KEY;

const client = new CosmosClient({
  endpoint,
  key
});

export default client;