import {
  BlobServiceClient,
  BlobSASPermissions,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters
} from "@azure/storage-blob";
import path from "path";
import { randomUUID } from "crypto";

const connectionString =
  process.env.STORAGE_CONNECTION_STRING ||
  process.env.APPSETTING_STORAGE_CONNECTION_STRING || "";

const defaultContainerName =
  process.env.STORAGE_CONTAINER_NAME ||
  process.env.APPSETTING_STORAGE_CONTAINER_NAME ||
  "media";

const defaultReadSasExpiryMinutes = Number(
  process.env.BLOB_READ_SAS_EXPIRY_MINUTES ||
    process.env.APPSETTING_BLOB_READ_SAS_EXPIRY_MINUTES ||
    "60"
);

const getBlobServiceClient = (): BlobServiceClient => {
  if (!connectionString) {
    throw new Error("Storage connection string is not configured");
  }

  return BlobServiceClient.fromConnectionString(connectionString);
};

const getStorageAccountCredentials = (
  connString: string
): { accountName: string; accountKey: string } => {
  const values = new Map<string, string>();

  for (const segment of connString.split(";")) {
    const part = segment.trim();
    if (!part) {
      continue;
    }

    const separatorIndex = part.indexOf("=");
    if (separatorIndex < 0) {
      continue;
    }

    const key = part.slice(0, separatorIndex);
    const value = part.slice(separatorIndex + 1);
    values.set(key, value);
  }

  const accountName = values.get("AccountName") || "";
  const accountKey = values.get("AccountKey") || "";

  if (!accountName || !accountKey) {
    throw new Error(
      "AccountName/AccountKey not found in storage connection string"
    );
  }

  return { accountName, accountKey };
};

const getFileExtension = (fileName: string, mimeType: string): string => {
  const extension = path.extname(fileName).toLowerCase();

  if (extension) {
    return extension;
  }

  if (mimeType === "application/pdf") {
    return ".pdf";
  }

  return "";
};

type UploadMediaFileInput = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  containerName?: string;
};

type UploadMediaFileResult = {
  containerName: string;
  blobName: string;
  blobUrl: string;
  url: string;
  accessUrl: string;
  expiresInMinutes: number;
};

type BuildReadBlobUrlInput = {
  containerName: string;
  blobName: string;
  expiresInMinutes?: number;
};

export const buildReadBlobUrl = ({
  containerName,
  blobName,
  expiresInMinutes = defaultReadSasExpiryMinutes
}: BuildReadBlobUrlInput): string => {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const { accountName, accountKey } = getStorageAccountCredentials(
    connectionString
  );

  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  const safeExpiryMinutes = Math.max(1, expiresInMinutes);
  const startsOn = new Date(Date.now() - 5 * 60 * 1000);
  const expiresOn = new Date(Date.now() + safeExpiryMinutes * 60 * 1000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn,
      expiresOn,
      protocol: SASProtocol.Https
    },
    sharedKeyCredential
  ).toString();

  return `${blockBlobClient.url}?${sasToken}`;
};

export const uploadMediaFile = async ({
  buffer,
  originalName,
  mimeType,
  containerName = defaultContainerName
}: UploadMediaFileInput): Promise<UploadMediaFileResult> => {
  const blobServiceClient = getBlobServiceClient();
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const fileExtension = getFileExtension(originalName, mimeType);
  const blobName = `${Date.now()}-${randomUUID()}${fileExtension}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType
    }
  });

  const accessUrl = buildReadBlobUrl({
    containerName,
    blobName,
    expiresInMinutes: defaultReadSasExpiryMinutes
  });

  return {
    containerName,
    blobName,
    blobUrl: blockBlobClient.url,
    url: accessUrl,
    accessUrl,
    expiresInMinutes: Math.max(1, defaultReadSasExpiryMinutes)
  };
};

export default getBlobServiceClient;