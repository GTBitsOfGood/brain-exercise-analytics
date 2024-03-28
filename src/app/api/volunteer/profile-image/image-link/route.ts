import APIWrapper from "@server/utils/APIWrapper";
import { updateVolunteer } from "@server/mongodb/actions/Volunteer";
import {
  BlobDeleteOptions,
  BlobServiceClient,
  DeleteSnapshotsOptionType,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

type PostRequest = {
  newImageLink: string;
  email: string;
};

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req, currentUser) => {
    const requestData = (await req.json()) as PostRequest;
    const { email, newImageLink } = requestData;
    if (!requestData) {
      throw new Error("Missing request data");
    }
    if (!email) {
      throw new Error("Missing image link in request data");
    }
    if (!newImageLink) {
      throw new Error("Missing image link in request data");
    }
    console.log("1");

    const accountKey = process.env.AZURE_ACCOUNT_KEY;
    const accountName = process.env.AZURE_ACCOUNT_NAME;
    const containerName = process.env.AZURE_CONTAINER_NAME;
    if (!accountKey || !accountName || !containerName) {
      throw new Error("Azure account key or name is not defined");
    }
    console.log("2");

    const blobName = currentUser!.imageLink.split("/").slice(4).join("/");
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );
    console.log("3");
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential,
    );
    console.log("4");
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const options: BlobDeleteOptions = {
      deleteSnapshots: "include" as DeleteSnapshotsOptionType,
    };
    console.log("5");
    await blobClient.deleteIfExists(options);

    console.log("6");
    const user = await updateVolunteer(email, { imageLink: newImageLink });
    console.log("7");
    return user;
  },
});
