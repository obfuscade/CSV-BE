const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '.env' });

const app = require('./app');

const { PORT, DATABASE_URL } = process.env;

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log('🚀 Database is connected');
  })
  .catch((error) => {
    console.log(`Database isn't connected: ${error}`);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
