// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const StorageConfig = {
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
  clientEmail: process.env.CLIENT_EMAIL,
  mediaBucket: process.env.STORAGE_MEDIA_BUCKET,
};

export default StorageConfig;

export const PUBLIC_URL = 'https://storage.googleapis.com/';
