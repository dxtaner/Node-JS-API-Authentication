const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, min:3, max:20, required: true},
  last_name: { type: String, min:2, max:35, required: true},
  city: { type: String, required: true },
  email: { type: String, unique: true, min:5, required: true,},
  password: { type: String, required:true, min:5, max:25},
  created_date:{ type:Date, default:Date.now()},
  updated_date:{ type:Date, default:null},
});

module.exports = mongoose.model("User", userSchema);