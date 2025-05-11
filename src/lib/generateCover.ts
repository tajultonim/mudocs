import { fromPath } from 'pdf2pic'
import tmp from 'tmp-promise'
import { writeFile, readFile } from 'fs/promises'

export async function generateCoverImage(pdfBuffer: Buffer): Promise<Buffer> {
  const { path, cleanup } = await tmp.file({ postfix: '.pdf' })
  await writeFile(path, pdfBuffer)

  const converter = fromPath(path, {
    density: 150,
    format: 'jpeg',
    width: 512,
    height: 768,
    quality: 80,
  })

  const output = await converter(1, true)
  await cleanup()
  return readFile(output.path)
}
