import FolderPermissionsController from "../../../../controllers/Permissions/Folder";
import authMiddleware from "../../../../middlewares/authMiddleware";
import adminMiddleware from "../../../../middlewares/adminMiddleware";

export default (router: any) => {
  router.post(
    "/v1/permissions/folders",
    authMiddleware,
    adminMiddleware,
    FolderPermissionsController.create
  );

  router.get(
    "/v1/permissions/folders",
    authMiddleware,
    adminMiddleware,
    FolderPermissionsController.getAll
  );

  router.get(
    "/v1/permissions/folders/:id",
    authMiddleware,
    adminMiddleware,
    FolderPermissionsController.findOne
  );

  router.delete(
    "/v1/permissions/folders/:id",
    authMiddleware,
    adminMiddleware,
    FolderPermissionsController.delete
  );

  router.patch(
    "/v1/permissions/folders/:id",
    authMiddleware,
    adminMiddleware,
    FolderPermissionsController.update
  );

  return router;
};
