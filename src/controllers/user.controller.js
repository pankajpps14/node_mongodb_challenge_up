const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getDailyUsers = catchAsync(async (req, res) => {
  const result = await userService.getDailyUsers();
  res.send(result);
});

const getWeeklyUsers = catchAsync(async (req, res) => {
  const result = await userService.getWeeklyUsers();
  res.send(result);
});

const getMonthlyUsers = catchAsync(async (req, res) => {
  const result = await userService.getMonthlyUsers();
  res.send(result);
});

module.exports = {
  getDailyUsers,
  getWeeklyUsers,
  getMonthlyUsers,
};
