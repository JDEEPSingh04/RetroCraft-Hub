var express = require('express')
var indexRouter = express.Router()
const passport = require('passport')
const localStrategy = require('passport-local')
const userModel = require('./users')
const workModel = require('./works')
passport.use(new localStrategy(userModel.authenticate()))

indexRouter.get('/', function (req, res, next) {
  res.render('index')
})

indexRouter.get('/profile', async (req, res) => {
  const user = req.user
  res.render('profile', { user })
})

indexRouter.get('/login', (req, res) => {
  res.render('login')
})

indexRouter.get('updateProfile', isLoggedIn, (req, res) => {
  const user = req.user
  res.redirect('updateProfile', user)
})

indexRouter.post('/register', (req, res) => {
  var userdata = new userModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    mobileNo: req.body.mobile,
    description: req.body.option,
  })
  userModel.register(userdata, req.body.password).then((registeredUser) => {
    passport.authenticate('local')(req, res, () => {
      res.redirect('/profile')
    })
  })
})

indexRouter.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/profile',
  }),
  (req, res) => {}
)

indexRouter.get('/logout', (req, res, next) => {
  req.logOut(function (err) {
    if (err) return next(err)
    res.redirect('/')
  })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

indexRouter.get('/jobs', isLoggedIn, async (req, res) => {
  const user=req.user;
  const works = await workModel.find().populate('hiredBy doneBy')
  res.render('jobs', { works,user })
})

indexRouter.get('/newJob', isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate('works')
  res.render('newJob', { user })
})

indexRouter.get('/jobs/:title', isLoggedIn, async (req, res) => {
  const job = await workModel
    .findOne({ title: req.params.title })
    .populate('hiredBy')
  res.render('hirerJobFreelancer', { job })
})

indexRouter.get('/jobs/hirer/:title', isLoggedIn, async (req, res) => {
  const job = await workModel
    .findOne({ title: req.params.title })
    .populate('hiredBy')
  res.render('hirerJob', { job })
})

module.exports = indexRouter
