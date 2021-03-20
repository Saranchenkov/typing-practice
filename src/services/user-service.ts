import { Role } from "../entities/role";
import { Admin } from "../entities/admin";
import { Client } from "../entities/client";
import { Moderator } from "../entities/moderator";
import { Operation } from "../entities/operation";
import type { User } from "../entities/user";
import { RoleToUser } from "../entities/role-to-user";
import {
  RoleToAdminOperations,
  RoleToClientOperations,
  RoleToModeratorOperations
} from "../entities/role-to-user-operations";


export default class UserService {
  private users: readonly User[] = [];

  private readonly roleToAdminOperations: RoleToAdminOperations = {
    [Role.ADMIN]: [Operation.UPDATE_TO_MODERATOR],
    [Role.MODERATOR]: [Operation.UPDATE_TO_MODERATOR, Operation.UPDATE_TO_CLIENT],
    [Role.CLIENT]: [Operation.UPDATE_TO_MODERATOR],
  } as const;

  private readonly roleToModeratorOperations: RoleToModeratorOperations = {
    [Role.ADMIN]: [],
    [Role.MODERATOR]: [Operation.UPDATE_TO_CLIENT],
    [Role.CLIENT]: [Operation.UPDATE_TO_MODERATOR],
  } as const;

  private readonly roleToClientOperations: RoleToClientOperations = {
    [Role.ADMIN]: [],
    [Role.MODERATOR]: [],
    [Role.CLIENT]: [],
  } as const;

  async getAllUsers(): Promise<readonly User[]> {
    if (this.users.length !== 0) {
      return this.users;
    }
    const response = await this.fetch();
    this.users = response.default.map((u: any) => {
      const User = this.getConstructorByRole(u.role);
      return User.from(u);
    });
    return this.users;
  }

  private fetch(): Promise<any> {
    return import("../mocks/users.json");
  }

  async updateUserRole<R extends Role>(
    user: Readonly<RoleToUser[R]>,
    newRole: R
  ) {
    const User = this.getConstructorByRole(newRole);
    this.users = this.users.map((u) => (u.id === user.id ? User.from(u) : u));
    return this.users;
  }

  getAvailableOperations(user: User, currentUser: User): ReadonlyArray<Operation> {
    if (currentUser instanceof Admin) {
      return this.getAvailableAdminOperations(user.role);
    }

    if (currentUser instanceof Moderator) {
      return this.getAvailableModeratorOperations(user.role);
    }

    return this.getAvailableClientOperations(user.role);
  }

  getAvailableAdminOperations<R extends Role>(role: R) {
    return this.roleToAdminOperations[role];
  }

  getAvailableModeratorOperations<R extends Role>(role: R) {
    return this.roleToModeratorOperations[role];
  }

  getAvailableClientOperations<R extends Role>(role: R) {
    return this.roleToClientOperations[role];
  }

  getConstructorByRole(role: Role) {
    switch (role) {
      case Role.ADMIN:
        return Admin;
      case Role.CLIENT:
        return Client;
      case Role.MODERATOR:
        return Moderator;
    }
  }
}
