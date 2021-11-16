import { PrismaClient } from '@prisma/client';
import { uid } from 'uid/secure';

import { UserValues } from '@lib/type';
import { genHash } from '@lib/util';
import { filter, omit, pick } from 'lodash';

const db = new PrismaClient();

/**
 * create a new user
 * @param data user data to create
 * @returns database result
 */
const create = async (data: UserValues) => {
  const password: string = await genHash(data.password);
  const userId: string = uid(16);
  const result = db.user.create({
    data: {
      userId: userId,
      username: data.username,
      password: password,
      email: data.email,
      roles: {
        create: {
          roleId: 'user',
        },
      },
    },
  });
  return omit(await result, ['password']);
};

/**
 * activate a user
 * @param userId id of user to activate
 * @returns database result
 */
export const activate = async (userId: string) => {
  const result = db.user.update({
    where: {
      userId,
    },
    data: {
      deleted: null,
    },
  });
  return omit(await result, ['password']);
};

/**
 * deactivate a user
 * @param userId id of user to deactivate
 * @returns database result
 */
export const deactivate = async (userId: string) => {
  const result = db.user.update({
    where: {
      userId,
    },
    data: {
      deleted: new Date(),
    },
  });
  return omit(await result, ['password']);
};

/**
 * add a role to a user
 * @param userId id of user to modify
 * @param roleId name of role to add to user
 * @returns database result
 */
export const addRole = async (userId: string, roleId: string) => {
  return db.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
};

/**
 * delete a role from a user
 * @param userId id of user to modify
 * @param roleId name of role to delete from user
 * @returns database result
 */
export const deleteRole = async (userId: string, roleId: string) => {
  return db.userRole.delete({
    where: {
      roleId_userId: {
        userId,
        roleId,
      },
    },
  });
};

/**
 * find a user by id
 * @param userId id of user to find
 * @returns database result
 */
const findByAll = async ({ page, take }) => {
  const result = await db.user.findMany({ skip: take * (page - 1), take: take });
  return result.map((user) => omit(user, ['password']));
};

/**
 * find a user by id
 * @param userId id of user to find
 * @returns database result
 */
const findById = async (userId: string) => {
  const result = await db.user.findUnique({
    where: {
      userId,
    },
  });
  return omit(result, ['password']);
};

/**
 * find a user by email or username
 * @param email email of user to find
 * @param username username of user to find
 * @returns database result
 */
const findByEmailOrUsername = async (email: string, username: string) => {
  const result = await db.user.findFirst({
    where: {
      OR: {
        email,
        username,
      },
    },
  });
  return omit(result, ['password']);
};

export const UserHelper = {
  create,
  activate,
  deactivate,
  addRole,
  deleteRole,
  findByAll,
  findById,
  findByEmailOrUsername,
};
