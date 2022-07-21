import FolderController from "../../../controllers/Folder";
import authMiddleware from "../../../middlewares/authMiddleware";

export default (router: any) => {
  router.post("/v1/folder", authMiddleware, FolderController.create);

  router.get("/v1/folder", authMiddleware, FolderController.findAll);

  router.get("/v1/folder/:id", authMiddleware, FolderController.findById);

  router.get(
    "/v1/dir/:id",
    authMiddleware,
    FolderController.findAllInDirectory
  );

  router.patch("/v1/folder/:id", authMiddleware, FolderController.updateFolder);

  router.delete(
    "/v1/folder/:id",
    authMiddleware,
    FolderController.deleteFolder
  );

  return router;
};
