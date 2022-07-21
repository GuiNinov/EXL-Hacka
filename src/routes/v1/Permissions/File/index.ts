import FilePermissionsController from "../../../../controllers/Permissions/File";
import authMiddleware from "../../../../middlewares/authMiddleware";
import adminMiddleware from "../../../../middlewares/adminMiddleware";

export default (router: any) => {
  router.post(
    "/v1/permissions/files",
    authMiddleware,
    adminMiddleware,
    FilePermissionsController.create
  );

  router.get(
    "/v1/permissions/files",
    authMiddleware,
    adminMiddleware,
    FilePermissionsController.getAllFilePermissions
  );

  router.get(
    "/v1/permissions/files/:id",
    authMiddleware,
    adminMiddleware,
    FilePermissionsController.findOnePermission
  );

  router.delete(
    "/v1/permissions/files/:id",
    authMiddleware,
    adminMiddleware,
    FilePermissionsController.deletePermission
  );

  router.patch(
    "/v1/permissions/files/:id",
    authMiddleware,
    adminMiddleware,
    FilePermissionsController.updatePermission
  );

  return router;
};
