import { BlockBlobClient } from "@azure/storage-blob";

export async function uploadFileWithManualProgress({
  file,
  sasUrl,
  onProgress,
}: {
  file: File;
  sasUrl: string;
  onProgress: ({
    percent,
    size_bytes,
    uploaded_bytes,
  }: {
    percent: number;
    size_bytes: number;
    uploaded_bytes: number;
  }) => void;
}) {
  const blockSize = 1024 * 1024 * 2; // 2MB
  const totalBlocks = Math.ceil(file.size / blockSize);
  const blockBlobClient = new BlockBlobClient(sasUrl);

  const blockIds: string[] = [];
  const concurrency = 5;
  let uploadedBytes = 0;
  const uploadedBytesMap = new Array(totalBlocks).fill(0); // for thread-safe progress

  const uploadBlock = async (index: number) => {
    const blockId = btoa(String(index).padStart(6, "0"));
    const start = index * blockSize;
    const end = Math.min(start + blockSize, file.size);
    const blockData = file.slice(start, end);

    await blockBlobClient.stageBlock(blockId, blockData, blockData.size);
    blockIds[index] = blockId;

    uploadedBytesMap[index] = blockData.size;
    uploadedBytes = uploadedBytesMap.reduce((a, b) => a + b, 0);
    const percent = Math.round((uploadedBytes / file.size) * 100);

    onProgress({
      percent,
      size_bytes: file.size,
      uploaded_bytes: uploadedBytes,
    });
  };

  const indexes = Array.from({ length: totalBlocks }, (_, i) => i);

  // Limit parallelism
  const parallelUploads = async () => {
    const executing: Promise<void>[] = [];
    for (const index of indexes) {
      const upload = uploadBlock(index);
      executing.push(upload);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === upload), 1);
      }
    }
    await Promise.all(executing);
  };

  await parallelUploads();
  await blockBlobClient.commitBlockList(blockIds);
}
