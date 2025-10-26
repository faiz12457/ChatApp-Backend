import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext=file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix+'.'+ext);
  },
});

export const upload = multer({ storage,  limits: {
    fileSize: 100 * 1024 * 1024, // ⬅️ 100 MB max per file
    files: 10, //  maximum 10 files per request
  }, });
