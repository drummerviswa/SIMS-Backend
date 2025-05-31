
import multer from "multer";
//Cloudinary setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  export const upload = multer({
    storage: storage,
    limits: "10mb",
  }); // 10 MB limit