var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});
var Post = mongoose.model("P")
// PostSchema.methods.upvotes = function (cb) {
//     this.upvotes+=1;
//     this.save(cb);
// };

mongoose.model('Post', PostSchema);