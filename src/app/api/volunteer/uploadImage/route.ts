import APIWrapper from "@server/utils/APIWrapper";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

type RequestData = {
  email: string;
  fileName: string;
};


export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req) => {
    const requestData = (await req.json()) as RequestData;
    if (!requestData) {
      throw new Error("Missing request data");
    }
    if (!requestData.email || !requestData.fileName) {
      throw new Error("Missing email or file name");
    }

    const accountName = "beiaccount";
    const accountKey = "w7TfstwMdQh4bVQ7H2fTrlOgX3/5SBNkFunKA1aUm6MAzqY3dPkANcvGN0ISSSbuYTXOog5G4Wi0+AStREzOtw==";
    const storageCredential = new StorageSharedKeyCredential(accountName, accountKey);
    // const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, storageCredential);
    const containerName = "profileimage";


    // const uniqueBlob = uuidv4();

    // const blobName = requestData.fileName; 
    const blobName =  uuidv4();
    const expiryDate = new Date(new Date().getTime() + 86400);
    const permissions = new BlobSASPermissions();
    permissions.write = true;

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
