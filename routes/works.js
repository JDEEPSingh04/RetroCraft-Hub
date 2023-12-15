const mongoose=require('mongoose')

mongoose.connect(
  'mongodb+srv://Jagdeep:jag@cluster0.b1larll.mongodb.net/?retryWrites=true&w=majority'
)

const workSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hiredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  doneBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
})

module.exports=mongoose.model('work',workSchema);