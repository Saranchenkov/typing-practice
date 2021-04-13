import { User } from "../entities/user";
import { Client } from "../entities/client";
import UserService from "./user-service";
import { Credentials } from "../entities/credentials";

export default class LoginService {
  constructor(private readonly userService: UserService) {}

  private findUserByCredentials({ email, password }: Credentials): Promise<User> {
    return this.userService.getAllUsers().then(users => {

      const foundUser = users.find(user => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password);

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      return foundUser;
    })
  }

  public async login(email: string, password: string): Promise<User> {
    const credentials = Credentials.from(email, password);

    return this.findUserByCredentials(credentials).then(foundUser => {
      if (foundUser instanceof Client) {
        throw new Error('Forbidden');
      }

      return foundUser;
    })
  }
}
