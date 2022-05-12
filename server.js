const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./App');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
console.log(process.env.NODE_ENV);
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB CONNCETED');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App runing on the ${port}...`);
});
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', err => {
  console.log('SIGTERM! 😇 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    console.log('process! 💥 Terminated...');
  });
});
