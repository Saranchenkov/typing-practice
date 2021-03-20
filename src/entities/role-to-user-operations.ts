import { Role } from "./role";
import { Operation } from "./operation";

export type RoleToAdminOperations = {
  readonly [Role.ADMIN]: readonly [Operation.UPDATE_TO_MODERATOR];
  readonly [Role.MODERATOR]: readonly [Operation.UPDATE_TO_MODERATOR, Operation.UPDATE_TO_CLIENT];
  readonly [Role.CLIENT]: readonly [Operation.UPDATE_TO_MODERATOR];
}

export type RoleToModeratorOperations = {
  readonly [Role.ADMIN]: readonly [];
  readonly [Role.MODERATOR]: readonly [Operation.UPDATE_TO_CLIENT];
  readonly [Role.CLIENT]: readonly [Operation.UPDATE_TO_MODERATOR];
}

export type RoleToClientOperations = {
  readonly [Role.ADMIN]: readonly [];
  readonly [Role.MODERATOR]: readonly [];
  readonly [Role.CLIENT]: readonly [];
}
