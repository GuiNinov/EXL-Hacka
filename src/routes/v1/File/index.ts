import FileController from "../../../controllers/File";
import authMiddleware from "../../../middlewares/authMiddleware";
import multer from "../../../config/multer";

export default (router: any) => {
  router.post(
    "/v1/file",
    multer.single("file"),
    authMiddleware,
    FileController.create
  );

  router.get("/v1/file", authMiddleware, FileController.getFiles);
  router.get("/v1/file/:id", authMiddleware, FileController.getFile);

  router.patch("/v1/file/:id", authMiddleware, FileController.updateFile);

  router.delete("/v1/file/:id", authMiddleware, FileController.deleteFile);

  return router;
};
