import { User } from "../entities/user";
import { Client } from "../entities/client";
import UserService from "./user-service";

export default class LoginService {
  constructor(private readonly userService: UserService) {}

  public async login(email: string, password: string): Promise<User> {
    return this.userService.getAllUsers().then(users => {
      const foundUser = users.find(user => user.email.trim().toLowerCase() === email && user.password === password);

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      if (foundUser instanceof Client) {
        throw new Error('Forbidden');
      }

      return foundUser;
    })
  }
}
