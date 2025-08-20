import UserService from "./user.service.js";
 import { statusCode } from '../../utils/constants/statusCode.js';

export default class UserController {
  constructor() {
    this.userService =  UserService;
  }

  getAll = async (req, res, next) => {
    try {
         
       const users= await this.userService.getAll();
       res.success('Users feteched successfully', users, statusCode.OK);
      
    } catch (err) {
      next(err);
    }
  };

  register = async (req, res, next) => {
    try {
      const result = await this.userService.register(req.body);
      res.success("User registered successfully", result, statusCode.CREATED);
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.userService.login(req.body);
      res.success("Login successful", result, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.userService.getById(req.params.id);
      if(!user){
       return res.status(statusCode.NOT_FOUND).json({message: 'User not found'});
      }

      res.success("User fetched successfully", user, statusCode.OK);
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
  try {
    const user = await this.userService.update(req.params.id, req.body);
    res.success("User updated successfully", user, statusCode.OK);
  } catch (err) {
    next(err);
  }
};

  delete = async (req, res, next) => {
  try {
    const user = await this.userService.delete(req.params.id);
    if(!user){
      return res.status(statusCode.NOT_FOUND).json({message: 'User not found'});
    }

    res.success("User deleted successfully", statusCode.OK);
  } catch (err) {
    next(err);
  }
};


}
