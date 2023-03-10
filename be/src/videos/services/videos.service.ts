import fs from 'fs/promises';

const UPLOAD_DIR = './uploads';

class VideosService {
  async createVideo(id: string, data: string, chunkCount: number) {
    const base64String = data.toString().split(',').pop();
    if (base64String === undefined) return;
    const fileName = `${id}.webm`;
    const isFileExist = await fs
      .access(`${UPLOAD_DIR}/${fileName}`)
      .then(() => true)
      .catch(() => false);

    if (chunkCount === 0 && isFileExist) {
      await fs.unlink(`${UPLOAD_DIR}/${fileName}`);
    }

    await fs.appendFile(`${UPLOAD_DIR}/${fileName}`, base64String, { encoding: 'base64' });
  }
}

export default VideosService;
