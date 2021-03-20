import { User } from "../entities/user";
import { Client } from "../entities/client";
import UserService from "./user-service";
import { EMAIL_REGEXP } from "../constants/common";

export default class LoginService {
  constructor(private readonly userService: UserService) {
  }

  static validateEmail(email: string): void {
    if (!email.trim()) {
      throw new Error('Please enter an email');
    }

    if (!EMAIL_REGEXP.test(email)) {
      throw new Error('Invalid email');
    }
  }

  static validatePassword(password: string): void {
    if (!password) {
      throw new Error('Please enter a password');
    }

    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters long');
    }
  }

  private findUserByCredentials(email: string, password: string): Promise<User> {
    return this.userService.getAllUsers().then(users => {

      const foundUser = users.find(user => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password);

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      return foundUser;
    })
  }

  public async login(email: string, password: string): Promise<User> {
    LoginService.validateEmail(email);
    LoginService.validatePassword(password);

    return this.findUserByCredentials(email, password).then(foundUser => {
      if (foundUser instanceof Client) {
        throw new Error('Forbidden');
      }

      return foundUser;
    })
  }
}
