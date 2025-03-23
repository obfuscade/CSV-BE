const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema(
  {
    headers: mongoose.Schema.Types.Mixed,
    data: mongoose.Schema.Types.Mixed,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  },
  {
    versionKey: false,
  }
);

dataSchema.pre('save', async (next) => {
  await mongoose.model('Data').deleteMany({});

  next();
});

dataSchema.statics.getAggregatedValues = async function ({
  userId,
  limit,
  start,
}) {
  const response = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $project: {
        // +1 to check if there are more data to prevent extra request
        data: { $slice: ['$data', start, limit + 1] },
        headers: 1,
      },
    },
  ]);
  const data = response?.[0]?.data || [];
  const headers = response?.[0]?.headers || [];

  const result = {
    data: data.slice(0, limit),
    hasNextValues: data.length > limit,
  };

  // If start is 0, add headers
  if (start === 0) {
    result.data = [headers, ...result.data];
  }

  return result;
};

module.exports = mongoose.model('Data', dataSchema, 'data');
