import { USER_MODEL } from "./user.model.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
 
 class UserService {

  async getAll() {
    return await USER_MODEL.find().select('-password');
  }

  async register({ firstName, lastName, email, password, role }) {
    const userExist = await USER_MODEL.findOne({ email });
    if (userExist) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await USER_MODEL.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    return { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role };
  }

  async login({ email, password }) {
    const user = await USER_MODEL.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "mysecret",{ expiresIn: "1d" });

    return { token, user: { id: user._id, firstName: user.firstName, email: user.email, role: user.role } };
  }

  async getById(id){
    return await USER_MODEL.findById(id).select('-password');
  }

  async update(id, { firstName, lastName, email, password, role }) {
  const user = await USER_MODEL.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  if (email && email !== user.email) {
    const emailExists = await USER_MODEL.findOne({ email });
    if (emailExists) {
      throw new Error("Email already in use");
    }
    user.email = email;
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (role) user.role = role;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

async delete(id){
  return await USER_MODEL.findByIdAndDelete(id);
}


}

export default new UserService();
