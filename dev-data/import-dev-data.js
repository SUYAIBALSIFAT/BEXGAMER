const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const tournament = require('./../models/tournamentModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  'password',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB CONNCETED');
  });
// READ JSON FILE
const Tournaments = JSON.parse(
  fs.readFileSync(`${__dirname}/tournaments-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await tournament.create(Tournaments);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await tournament.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
