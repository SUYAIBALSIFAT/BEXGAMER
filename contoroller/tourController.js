const sharp = require('sharp');
const multer = require('multer');
const Tournament = require('./../models/tournamentModel');
const factory = require('./handlerFactory');
const AppError = require('./../utilits/appError');
const catchAsync = require('./../utilits/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not a image! please upload a image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTournamentImgs = upload.fields([
  { name: 'imgcover', maxCount: 1 },
  { name: 'img', maxCount: 3 }
]);

exports.resizeTournamentImgs = catchAsync(async (req, res, next) => {
  //1) coverimgaes
  if (!req.files.imgcover || !req.files.img) return next();
  req.body.imgcover = `tournament-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imgcover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imgcover}`);

  //2 images
  req.body.img = [];

  await Promise.all(
    req.files.img.map(async (file, i) => {
      const filename = `tournament-${req.params.id}-${Date.now()}-${i +
        1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.img.push(filename);
    })
  );
  next();
});

exports.getAllTournaments = factory.getAll(Tournament);
exports.getTournamentById = factory.getOne(Tournament, { path: 'usersEnter' });
exports.createTournament = factory.createOne(Tournament);
exports.updateTournament = factory.updateOne(Tournament);
exports.deleteTournament = factory.deleteOne(Tournament);
