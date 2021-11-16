import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { ValidateParam, ValidateSchema } from '@backend/middleware';
import { UserValues } from '@lib/type';
import { IdSchema, SearchSchema, UserSchema } from '@lib/schema';
import { CLIENT_ERROR, StatusCodes } from '@lib/shared';
import { UserHelper } from '.';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

/**
 * create a new user
 */
router.post('/', ValidateSchema(UserSchema), async (ctx: ParameterizedContext) => {
  const data: UserValues = ctx.data;

  const result = await UserHelper.create(data);
  if (result) return (ctx.body = result);
  else ctx.throw(CLIENT_ERROR.CONFILCT.message, CLIENT_ERROR.CONFILCT.status);
}); // {post} /user

/**
 * get all users
 */
router.get('/', ValidateSchema(SearchSchema), async (ctx: ParameterizedContext) => {
  const user = await UserHelper.findByAll(ctx.data);
  if (!user) ctx.throw(CLIENT_ERROR.NOT_FOUND.message, CLIENT_ERROR.NOT_FOUND.status);

  ctx.body = user;
}); // {get} /user/:id

/**
 * get a user by id
 */
router.get('/:id', ValidateParam(IdSchema), async (ctx: ParameterizedContext) => {
  const data: { id: string } = ctx.data;

  const user = await UserHelper.findById(data.id);
  if (!user) ctx.throw(CLIENT_ERROR.NOT_FOUND.message, CLIENT_ERROR.NOT_FOUND.status);

  ctx.body = user;
}); // {get} /user/:id

/**
 * deactivate a user
 */
router.delete('/:id', ValidateParam(IdSchema), async (ctx: ParameterizedContext) => {
  const data: { id: string } = ctx.data;

  const user = await UserHelper.findById(data.id);

  if (!user) ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user does not exist');
  if (user.deleted)
    ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user is already deactivated');

  ctx.body = await UserHelper.deactivate(data.id);
}); // {delete} /user/:id

/**
 * activate a user
 */
router.post('/:id', ValidateParam(IdSchema), async (ctx: ParameterizedContext) => {
  const data: { id: string } = ctx.data;

  const user = await UserHelper.findById(data.id);

  if (!user) ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user does not exist');
  if (!user.deleted)
    ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user is already activated');

  ctx.body = await UserHelper.activate(data.id);
}); // {post} /user/:id

export { router as UserController };
