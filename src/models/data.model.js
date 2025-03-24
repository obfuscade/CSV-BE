const { ObjectId, Schema, model } = require('mongoose');

const dataSchema = new Schema(
  {
    headers: Schema.Types.Mixed,
    data: Schema.Types.Mixed,
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  {
    versionKey: false,
  }
);

// Delete before to save a new one
dataSchema.pre('save', async (next) => {
  await model('Data').deleteMany({});

  next();
});

// Aggregate the values
dataSchema.statics.getAggregatedValues = async function ({
  userId,
  limit,
  start,
}) {
  const response = await this.aggregate([
    { $match: { $expr: { $eq: ['$userId', { $toObjectId: userId }] } } },
    {
      $project: {
        // +1 - to check if there are more data to prevent extra request
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

module.exports = model('Data', dataSchema, 'data');
