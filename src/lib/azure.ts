import { BlobServiceClient } from '@azure/storage-blob'

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!)

export async function uploadFileToAzure(containerName: string, blobName: string, buffer: Buffer, mimeType: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName)
  await containerClient.createIfNotExists()
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  })

  return blockBlobClient.url
}