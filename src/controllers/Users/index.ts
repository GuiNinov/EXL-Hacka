import { buildResponse } from "../../helpers/responseHelper";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Users from "../../models/Users";
import iUser from "../../interfaces/User/iUser";
import * as jwt from "../../config/jwt";
import UserServices from "../../services/Users";

class UserController {
  async create(req: Request, res: Response) {
    const user: iUser = req.body.auth;

    const { email } = req.body;

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

    try {
      const userServices = new UserServices(Number(user.team_id));

      const inputValidation = await userServices.verifyEmail(email);
      if (inputValidation.valid) {
        return buildResponse(
          res,
          null,
          false,
          "Email already exists",
          400,
          req.headers.start_time
        );
      }

      const createdUser = await userServices.create(
        email,
        Number(user.team_id)
      );

      return buildResponse(
        res,
        createdUser,
        true,
        "User created successfully",
        201,
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

  async signin(req: Request, res: Response) {
    const [hashType, hash]: any = req.headers.authorization?.split(" ");

    if (hashType.trim() != "Basic") {
      return buildResponse(
        res,
        null,
        false,
        "Unauthorized!",
        403,
        req.headers.start_time
      );
    }

    const [email, password] = Buffer.from(hash, "base64").toString().split(":");

    if (!email || !password) {
      return buildResponse(
        res,
        null,
        false,
        "Email and password are required",
        400,
        req.headers.start_time
      );
    }
    try {
      const user: any = await Users.findByEmail(email);
      if (user.length == 0) {
        return buildResponse(
          res,
          null,
          false,
          "Invalid Email/Password",
          400,
          req.headers.start_time
        );
      }
      const isValid = await bcrypt.compare(password, user[0].password);
      if (!isValid) {
        return buildResponse(
          res,
          null,
          false,
          "Invalid Email/Password",
          400,
          req.headers.start_time
        );
      }
      const token = jwt.sign(
        {
          user: user[0].id,
        },
        3600 * 24
      );

      return buildResponse(
        res,
        { token },
        true,
        "User signed in successfully",
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
    const id = req.params.id;
    try {
      const userServices = new UserServices(Number(user.team_id));
      const deletedUser = await userServices.delete(Number(id));

      if (!deletedUser.deleted) {
        return buildResponse(
          res,
          null,
          false,
          "User not found",
          404,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        null,
        true,
        "User deleted successfully",
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

  async getAll(req: Request, res: Response) {
    try {
      const user = req.body.auth;

      const userServices = new UserServices(user.team_id);

      const users = await userServices.findAll();

      return buildResponse(
        res,
        users,
        true,
        "Users retrieved successfully",
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

  async getById(req: Request, res: Response) {
    const user: iUser = req.body.auth;
    const id = req.params.id;
    try {
      const userServices = new UserServices(Number(user.team_id));

      const result = await userServices.findById(Number(id));
      if (!result) {
        return buildResponse(
          res,
          null,
          false,
          "User not found",
          404,
          req.headers.start_time
        );
      }

      return buildResponse(
        res,
        result,
        true,
        "User retrieved successfully",
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

  async setRole(req: Request, res: Response) {
    const user: iUser = req.body.auth;
    const id = req.params.id;
    const role = req.body.role;

    if (role != "ADMIN" && role != "USER") {
      return buildResponse(
        res,
        null,
        false,
        "Invalid value for role",
        400,
        req.headers.start_time
      );
    }
    try {
      const userServices = new UserServices(Number(user.team_id));
      const userExists = await userServices.findById(Number(id));
      if (!userExists) {
        return buildResponse(
          res,
          null,
          false,
          "User not found",
          404,
          req.headers.start_time
        );
      }

      const result = await userServices.update(Number(id), { role });

      return buildResponse(
        res,
        result,
        true,
        "User role updated successfully",
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

export default new UserController();
