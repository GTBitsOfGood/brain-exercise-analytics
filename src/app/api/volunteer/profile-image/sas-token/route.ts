import APIWrapper from "@server/utils/APIWrapper";
import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req) => {
    const { searchParams } = new URL(req.url);
    const extension = searchParams.get("extension");
    if (!extension) {
      throw new Error("file extension of image is missing");
    }
    const accountName = process.env.AZURE_ACCOUNT_NAME as string;
    const accountKey = process.env.AZURE_ACCOUNT_KEY as string;
    const containerName = process.env.AZURE_CONTAINER_NAME as string;
    const expiryDate = new Date(new Date().getTime() + 86400);
    const storageCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );
    const blobName = `${uuidv4()}.${extension}`;
    const permissions = new BlobSASPermissions();
    permissions.write = true;
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions,
        expiresOn: expiryDate,
      },
      storageCredential,
    ).toString();

    return { sasToken, blobName, extension };
  },
});
