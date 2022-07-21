import UserController from "../../../controllers/Users";
import authMiddleware from "../../../middlewares/authMiddleware";
import adminMiddleware from "../../../middlewares/adminMiddleware";
export default (router: any) => {
  router.post(
    "/v1/user",
    authMiddleware,
    adminMiddleware,
    UserController.create
  );

  router.post("/v1/auth", UserController.signin);

  router.get("/v1/user", authMiddleware, UserController.getAll);

  router.get("/v1/user/:id", authMiddleware, UserController.getById);

  router.patch(
    "/v1/user/:id",
    authMiddleware,
    adminMiddleware,
    UserController.setRole
  );

  router.delete(
    "/v1/user/:id",
    authMiddleware,
    adminMiddleware,
    UserController.delete
  );

  return router;
};
