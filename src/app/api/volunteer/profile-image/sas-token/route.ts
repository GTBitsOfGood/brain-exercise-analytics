import APIWrapper from "@server/utils/APIWrapper";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

export const GET = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async () => {
    const accountName = "beiaccount";
    const accountKey = "w7TfstwMdQh4bVQ7H2fTrlOgX3/5SBNkFunKA1aUm6MAzqY3dPkANcvGN0ISSSbuYTXOog5G4Wi0+AStREzOtw==";
    const storageCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const containerName = "profileimage";
    const blobName =  uuidv4();
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
  storageCredential
).toString();

     return {sasToken, blobName} ;
  },
});
