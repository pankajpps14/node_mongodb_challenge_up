const express = require('express');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/daily')
  .get(userController.getDailyUsers);

router
  .route('/weekly')
  .get(userController.getWeeklyUsers);

router
  .route('/monthly')
  .get(userController.getMonthlyUsers);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users View
 *   description: Users View of Products
 */

/**
 * @swagger
 * path:
 *  /users/daily:
 *    get:
 *      summary: Get daily users counts
 *      description: Get daily users counts
 *      tags: [UsersView]
 *      responses:
 *        "200":
 *          description: OK
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *  /users/monthly:
 *    get:
 *      summary: Get monthly users count
 *      tags: [UsersView]
 *      responses:
 *        "200":
 *          description: OK
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */
