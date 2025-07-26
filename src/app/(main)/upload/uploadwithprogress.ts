import { BlockBlobClient } from "@azure/storage-blob";

export async function uploadFileWithManualProgress({
  file,
  sasUrl,
  onProgress,
}: {
  file: File;
  sasUrl: string;
  onProgress: (percent: number) => void;
}) {
  const blockSize = 1024 * 256; // 256KB
  const blockIds: string[] = [];
  const totalBlocks = Math.ceil(file.size / blockSize);
  let uploadedBytes = 0;

  const blockBlobClient = new BlockBlobClient(sasUrl);

  for (let i = 0; i < totalBlocks; i++) {
    const blockId = btoa(String(i).padStart(6, "0")); // base64-encoded block ID
    blockIds.push(blockId);

    const start = i * blockSize;
    const end = Math.min(start + blockSize, file.size);
    const blockData = file.slice(start, end);

    await blockBlobClient.stageBlock(blockId, blockData, blockData.size);
    uploadedBytes += blockData.size;

    const percent = Math.round((uploadedBytes / file.size) * 100);
    onProgress(percent);
  }

  await blockBlobClient.commitBlockList(blockIds);
}
