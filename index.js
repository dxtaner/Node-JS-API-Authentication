const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// import routes
const authRoute = require('./middleware/auth.js');

dotenv.config();
const port = process.env.API_PORT 

// connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to mongoDB!'))
  .catch(error => console.log(error.message));
  
// use
app.use(express.json());
// route-use
app.use('/api/user', authRoute);

app.listen(port, () => console.log(`The server has started!! Port is ${port} `));