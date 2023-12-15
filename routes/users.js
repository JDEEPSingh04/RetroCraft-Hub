const mongoose=require('mongoose');
const plm=require('passport-local-mongoose');

mongoose.connect(
  'mongodb+srv://Jagdeep:jag@cluster0.b1larll.mongodb.net/?retryWrites=true&w=majority'
)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
  },
  mobileNo: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
  works: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'work'
    },
  ],
  paygrade:{
    type:String,
  },
  image:{
    type:String,
  }
})

userSchema.plugin(plm)

module.exports = mongoose.model('user', userSchema)