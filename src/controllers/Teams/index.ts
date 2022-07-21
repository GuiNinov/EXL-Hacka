import { Request, Response } from "express";
import { buildResponse } from "../../helpers/responseHelper";
import iUser from "../../interfaces/User/iUser";
import TeamServices from "../../services/Teams";
class TeamController {
  async create(req: Request, res: Response) {
    const { email, name } = req.body;

    if (!email) {
      return buildResponse(
        res,
        null,
        false,
        "Email is required",
        400,
        req.headers.start_time
      );
    }

    if (!name) {
      return buildResponse(
        res,
        null,
        false,
        "Name is required",
        400,
        req.headers.start_time
      );
    }

    try {
      const teamServices = new TeamServices();
      const inputValidation = await teamServices.validateInput(name, email);

      if (!inputValidation.valid) {
        return buildResponse(
          res,
          null,
          false,
          inputValidation.message,
          400,
          req.headers.start_time
        );
      }

      const createdUser = await teamServices.create(name, email);

      return buildResponse(
        res,
        createdUser,
        true,
        "Team and master user created successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong. Internal server error",
        500,
        req.headers.start_time
      );
    }
  }

  async delete(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    try {
      const teamService = new TeamServices();
      teamService.delete(Number(user.team_id));
      return buildResponse(
        res,
        null,
        true,
        "Team deleted successfully",
        200,
        req.headers.start_time
      );
    } catch (error) {
      console.log(error);
      return buildResponse(
        res,
        null,
        false,
        "Something went wrong. Internal server error",
        500,
        req.headers.start_time
      );
    }
  }
}

export default new TeamController();
