import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
  SASProtocol,
} from "@azure/storage-blob";

const account = process.env.AZURE_STORAGE_ACCOUNT as string;
const accountKey = process.env.AZURE_STORAGE_KEY as string;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
export async function generateUploadSASUrl(r_path:string) {
  const container = r_path.split("/")[0];
  const name = r_path.split("/")[1];
  const permissions = BlobSASPermissions.parse("cw");
  const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: name,
      permissions,
      expiresOn,
      protocol: SASProtocol.HttpsAndHttp,
    },
    sharedKeyCredential
  ).toString();

  return `https://${account}.blob.core.windows.net/${r_path}?${sasToken}`;
}

export async function generateDownloadSASUrl(r_path: string) {
  const container = r_path.split("/")[0];
  const name = r_path.split("/")[1];
  const permissions = BlobSASPermissions.parse("r");
  const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // 1 hour

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container,
      blobName: name,
      permissions,
      expiresOn,
      protocol: SASProtocol.HttpsAndHttp,
    },
    sharedKeyCredential
  ).toString();

  return `https://${account}.blob.core.windows.net/${r_path}?${sasToken}`;
}
