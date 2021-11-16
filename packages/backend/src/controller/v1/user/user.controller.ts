import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { StatusCodes } from 'lib/src';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.post('/', async (ctx: ParameterizedContext) => {
  ctx.status = StatusCodes.SERVER_ERROR.NOT_IMPLEMENTED.status;
  ctx.body = StatusCodes.SERVER_ERROR.NOT_IMPLEMENTED.message;
}); // {post} /user

router.all('/', async (ctx: ParameterizedContext) => {
  ctx.status = StatusCodes.SERVER_ERROR.NOT_IMPLEMENTED.status;
  ctx.body = StatusCodes.SERVER_ERROR.NOT_IMPLEMENTED.message;
}); // {post} /user

export { router as UserController };