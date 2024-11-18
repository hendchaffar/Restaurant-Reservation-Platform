import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterModule } from '@nestjs/platform-express'; 
import { diskStorage } from 'multer'; 

export const uploadPath = join(process.cwd(), 'src/assets/images');
console.log("uploadPath",uploadPath)
export const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
    const fileExtension = extname(file.originalname); 
    cb(null, `${uuidv4()}${fileExtension}`); 
  },
});

