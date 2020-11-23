const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userViewSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    viewDate: {
      type: Date,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userViewSchema.plugin(toJSON);
userViewSchema.plugin(paginate);

/**
 * @typedef User
 */
const UserView = mongoose.model('UserView', userViewSchema);

module.exports = UserView;
