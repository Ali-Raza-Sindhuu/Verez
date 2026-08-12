import { Request, Response, NextFunction } from "express";

import { createUser, getUserById, getUsers } from "./userService.js";
import { createUserSchema, getUsersQuerySchema, userIdSchema } from "./userValidation.js";

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const user = await createUser(
      validatedData.name,
      validatedData.email,
      validatedData.password
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = userIdSchema.parse(req.params);

    const user = await getUserById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit } = getUsersQuerySchema.parse(req.query);

    const result = await getUsers(page, limit);

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};