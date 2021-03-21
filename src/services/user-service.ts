import { Role } from "../entities/role";
import { Admin } from "../entities/admin";
import { Client } from "../entities/client";
import { Moderator } from "../entities/moderator";
import { Operation } from "../entities/operation";
import type { User } from "../entities/user";
import { RoleToUser } from "../entities/role-to-user";

const ADMIN_OPERATIONS_CONFIGURATION = {
  [Role.ADMIN]: [Operation.UPDATE_TO_MODERATOR],
  [Role.MODERATOR]: [Operation.UPDATE_TO_MODERATOR, Operation.UPDATE_TO_CLIENT],
  [Role.CLIENT]: [Operation.UPDATE_TO_MODERATOR],
} as const;

type RoleToAdminOperations = typeof ADMIN_OPERATIONS_CONFIGURATION;

const MODERATOR_OPERATIONS_CONFIGURATION = {
  [Role.ADMIN]: [],
  [Role.MODERATOR]: [Operation.UPDATE_TO_CLIENT],
  [Role.CLIENT]: [Operation.UPDATE_TO_MODERATOR],
} as const;

type RoleToModeratorOperations = typeof MODERATOR_OPERATIONS_CONFIGURATION;

const CLIENT_OPERATIONS_CONFIGURATION = {
  [Role.ADMIN]: [],
  [Role.MODERATOR]: [],
  [Role.CLIENT]: [],
} as const;

type RoleToClientOperations = typeof CLIENT_OPERATIONS_CONFIGURATION;

export default class UserService {
  private users: readonly User[] = [];

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

  getAvailableAdminOperations<R extends Role>(role: R): RoleToAdminOperations[R] {
    return ADMIN_OPERATIONS_CONFIGURATION[role];
  }

  getAvailableModeratorOperations<R extends Role>(role: R): RoleToModeratorOperations[R] {
    return MODERATOR_OPERATIONS_CONFIGURATION[role];
  }

  getAvailableClientOperations<R extends Role>(role: R): RoleToClientOperations[R] {
    return CLIENT_OPERATIONS_CONFIGURATION[role];
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
