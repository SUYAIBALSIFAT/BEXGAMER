const mongoose = require('mongoose');
const slugify = require('slugify');

const TournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tournament must have a name'],
    unique: true
  },
  fee: {
    type: Number,
    require: [true, 'A tournament must have a fee'],
    default: 10
  },
  slug: String,
  winnerAouncment: {
    type: Date,
    require: [true, 'A tournament must have a WINNER_AOUNCMENT_DATE']
  },
  closeOn: {
    type: Date,
    require: [true, 'A tournament must have a CLOSE_ON']
  },
  pizePool: {
    type: Number,
    default: 40,
    require: [true, 'A tournament must have a PIZE_POOL'],
    maxlength: 2
  },
  teamSize: {
    type: String,
    require: [true, 'A tournament must have a TEAM SIZE']
  },
  playersInMatch: {
    type: Number,
    require: [true, 'A tournament must have a PLAYERS_IN_MATCH']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  platform: { type: String, default: 'MOBILE' },
  region: { type: String, default: 'ANY REGION' },
  imgcover: {
    type: String,
    require: [true, 'A tournament must have a imgcover']
  },
  img: [String],
  usersEnter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
  // },
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true }
});
TournamentSchema.index({ fee: 1 });
TournamentSchema.index({ slug: 1 });

TournamentSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this.slug);
  next();
});
const Tournament = mongoose.model('Tournament', TournamentSchema);

module.exports = Tournament;
