import multer from 'multer';
import path from 'path';
import crypton from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp'),
    filename(request, file, callback) {
      const fileHash = crypton.randomBytes(10).toString('HEX');
      const filename = `${fileHash}-${file.originalname}`;

      callback(null, filename);
    },
  }),
};
