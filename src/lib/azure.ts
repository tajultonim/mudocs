import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  SASProtocol,
} from "@azure/storage-blob";

const account = process.env.AZURE_STORAGE_ACCOUNT as string;
const accountKey = process.env.AZURE_STORAGE_KEY as string;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
export async function generateUploadSASUrl(hash: string, container: string) {
  const permissions = BlobSASPermissions.parse("c");
  const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: hash,
      permissions,
      expiresOn,
      protocol: SASProtocol.HttpsAndHttp,
    },
    sharedKeyCredential
  ).toString();

  return `https://${account}.blob.core.windows.net/${container}/${hash}?${sasToken}`;
}

export async function generateDownloadSASUrl(hash: string, container: string) {
  const permissions = BlobSASPermissions.parse("r");
  const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: hash,
      permissions,
      expiresOn,
      protocol: SASProtocol.HttpsAndHttp,
    },
    sharedKeyCredential
  ).toString();

  return `https://${account}.blob.core.windows.net/${container}/${hash}?${sasToken}`;
}
