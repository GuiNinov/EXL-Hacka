import TeamsController from "../../../controllers/Teams";
import authMiddleware from "../../../middlewares/authMiddleware";
import adminMiddleware from "../../../middlewares/adminMiddleware";
export default (router: any) => {
  router.post("/v1/signup", TeamsController.create);

  router.delete(
    "/v1/team",
    authMiddleware,
    adminMiddleware,
    TeamsController.delete
  );

  //   router.get("/v1/team", TeamsController.getTeams);
  //   router.get("/v1/team/:id", TeamsController.getTeam);

  return router;
};
