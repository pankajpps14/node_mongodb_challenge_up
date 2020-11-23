const httpStatus = require('http-status');
const { UserView } = require('../models');
const seedData = require('../models/seed/userView')
const ApiError = require('../utils/ApiError');

/**
 * Seed UserView data
 * @param {Object} userViewBody
 * @returns {Promise<User>}
 */
const seedUserView = async () => {
  const user = await UserView.find();
  if (!user.length) {
    await UserView.insertMany(seedData)
  }
};

const getDailyUsers = async () => {

  const userView = await UserView.aggregate([
    // First total per day. Rounding dates with math here
    {
      "$group": {
        "_id": {
          "$add": [
            {
              "$subtract": [
                { "$subtract": ["$viewDate", new Date(0)] },
                {
                  "$mod": [
                    { "$subtract": ["$viewDate", new Date(0)] },
                    1000 * 60 * 60 * 24
                  ]
                }
              ]
            },
            new Date(0)
          ]
        },
        "users": { "$addToSet": "$userId" },
        "totalviews": { "$sum": 1 }
      }
    },
    {
      "$project": {
        "_id": 0,
        "date": { $dateToString: { format: "%Y-%m-%d", date: "$_id" } },
        "totalviews": 1,
        "uniqueUsers": { "$size": "$users" }
      }
    }
  ]);
  return userView;
};

const getWeeklyUsers = async () => {

  const userView = await UserView.aggregate([
    // First total per day. Rounding dates with math here
    {
      "$group": {
        "_id": {
          "$add": [
            {
              "$subtract": [
                { "$subtract": ["$viewDate", new Date(0)] },
                {
                  "$mod": [
                    { "$subtract": ["$viewDate", new Date(0)] },
                    1000 * 60 * 60 * 24
                  ]
                }
              ]
            },
            new Date(0)
          ]
        },
        "week": { "$first": { "$week": "$viewDate" } },
        "month": { "$first": { "$month": "$viewDate" } },
        "users": { "$addToSet": "$userId" },
        "totalviews": { "$sum": 1 }
      }
    },
    // Then group by week
    {
      "$group": {
        "_id": "$week",
        "month": { "$first": "$month" },
        "days": {
          "$push": {
            "date": { $dateToString: { format: "%Y-%m-%d", date: "$_id" } },
          }
        },
        "totalviews": { "$sum": "$totalviews" },
        "users": { "$addToSet": "$users" }
      }
    },
    {
      "$project": {
        "_id": 0,
        "days": 1,
        "week": "$_id",
        "totalviews": 1,
        "uniqueUsers": { "$size": "$users" }
      }
    }
  ]);
  return userView;
};

const getMonthlyUsers = async () => {

  const userView = await UserView.aggregate([
    // First total per day. Rounding dates with math here
    {
      "$group": {
        "_id": {
          "$add": [
            {
              "$subtract": [
                { "$subtract": ["$viewDate", new Date(0)] },
                {
                  "$mod": [
                    { "$subtract": ["$viewDate", new Date(0)] },
                    1000 * 60 * 60 * 24
                  ]
                }
              ]
            },
            new Date(0)
          ]
        },
        "week": { "$first": { "$week": "$viewDate" } },
        "month": { "$first": { "$month": "$viewDate" } },
        "users": { "$addToSet": "$userId" },
        "totalviews": { "$sum": 1 }
      }
    },
    // Then group by week
    {
      "$group": {
        "_id": "$week",
        "month": { "$first": "$month" },
        "days": {
          "$push": {
            "day": "$_id",
            "total": "$total"
          }
        },
        "totalviews": { "$sum": "$totalviews" },
        "users": { "$addToSet": "$users" }
      }
    },
    // Then group by month
    {
      "$group": {
        "_id": "$month",
        "weeks": {
          "$push": {
            "week": "$_id",
            "total": "$total",
            "days": "$days"
          }
        },
        "totalviews": { "$sum": "$totalviews" },
        "users": { "$addToSet": "$users" }
      }
    },
    {
      "$project": {
        "_id": 0,
        "month": "$_id",
        "totalviews": 1,
        "uniqueUsers": { "$size" : {"$reduce" : {
          input: "$users",
          initialValue: [],
          in : { "$concatArrays": ["$$value", "$$this"] }
        }}}
      }
    }
  ]);
  return userView;
};

module.exports = {
  seedUserView,
  getDailyUsers,
  getWeeklyUsers,
  getMonthlyUsers
};
