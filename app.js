var createError = require('http-errors');
var express = require('express');
const { Server } = require('socket.io')
const http = require('http')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const passport = require('passport')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const workModel=require('./routes/works');

var app = express();

const httpServer = http.createServer(app)
const io = new Server(httpServer)

io.on('connection',(socket)=>{
  socket.on('newJob',async(data)=>{
    socket.join('yourRequirements');
    const title=data.Title;
    const des = data.Description;
    const user=JSON.parse(data.user);
    const currUser=await usersRouter.findById(user._id);
    const newWork=await new workModel({
      title:title,
      description:des,
      hiredBy:user._id,
    })
    await newWork.save()
    currUser.works.push(newWork._id)
    await currUser.save()
    socket.broadcast.emit('newJob',{user:currUser.username,title:title,description:des});
    io.to('yourRequirements').emit('newRequirement',{title:title,description:des});
  })
  socket.on('JOB',async (data)=>{
    const work=JSON.parse(data.work);
    const user=JSON.parse(data.user);
    const job=await workModel.findById(work._id).populate('hiredBy');
    console.log(user);
    io.emit('newRequest',{work:work,user:user});
  })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'Hey',
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(usersRouter.serializeUser())
passport.deserializeUser(usersRouter.deserializeUser())


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



module.exports = {app,httpServer};