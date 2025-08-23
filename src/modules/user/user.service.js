import { USER_MODEL } from "./user.model.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import crypto from 'crypto';
import nodemailer from 'nodemailer';
 
 class UserService {

  async getAll() {
    return await USER_MODEL.find().select('-password');
  }

  async register({ firstName, lastName, email, password, role, photo }) {
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
      role,
      photo: photo || null
    });

    return { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, photo: user.photo };
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

    return { token, user: { id: user._id, firstName: user.firstName, email: user.email, role: user.role, photo: user.photo } };
  }

  async getById(id){
    return await USER_MODEL.findById(id).select('-password');
  }

  async forgotPassword(email) {
    const user = await USER_MODEL.findOne({ email });
    if (!user) {
        throw new Error("User with this email does not exist");
    }

const resetToken = crypto.randomBytes(32).toString("hex");
const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

user.resetPasswordToken = resetTokenHash;
user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
await user.save();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

await transporter.sendMail({
  from: `"PRUTHATEK Support" <${process.env.EMAIL_USER}>`,
  to: user.email,
  subject: "Password Reset Request",
  html: `
    <p>Hello ${user.firstName},</p>
    <p>You requested a password reset. Use the token below to reset your password:</p>
    <h4>${resetToken}</h4>
    <p>This token will expire in 15 minutes.</p>
  `,
});

return { message: "Password reset email sent successfully" };

  }

  async resetPassword(token, newPassword) {
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await USER_MODEL.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: "Password reset successful" };
  }

  
  async update(id, { firstName, lastName, email, password, role, photo  }) {
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
  if (photo) user.photo = photo;

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
    photo: user.photo
  };
}

async delete(id){
  return await USER_MODEL.findByIdAndDelete(id);
}

}

export default new UserService();
