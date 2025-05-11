// src/utils/pdf.ts
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function getCoverImage(file: File): Promise<string> {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const page = await pdf.getPage(1);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const viewport = page.getViewport({ scale: 2 });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;

  return canvas.toDataURL('image/png');
}
