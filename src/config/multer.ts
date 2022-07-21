import Multer from "multer";

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // no larger than 10mb (default). Change it if needed
    },
});

export default multer;