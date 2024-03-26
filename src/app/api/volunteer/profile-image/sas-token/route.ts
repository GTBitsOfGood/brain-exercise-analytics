import APIWrapper from "@server/utils/APIWrapper";
import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async () => {
    const accountName = process.env.AZURE_ACCOUNT_NAME as string;
    const accountKey = process.env.AZURE_ACCOUNT_KEY as string;
    const containerName = process.env.AZURE_CONTAINER_NAME as string;

    const storageCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );
    const blobName = uuidv4();
    const expiryDate = new Date(new Date().getTime() + 86400);
    const permissions = new BlobSASPermissions();
    permissions.write = true;
    permissions.read = true;
    permissions.delete = true;

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions,
        expiresOn: expiryDate,
      },
      storageCredential,
    ).toString();

    return { sasToken, blobName };
  },
});
