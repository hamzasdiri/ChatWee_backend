const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/users.routes');
const { connect } = require('mongoose');
const { connectToDB } = require('./config/db');
require('./config/db');


const app = express();


dotenv.config();

    //middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));    

app.get('/',(req,res)=>{
    res.send('heyy');
})

app.use('/api/users',userRoutes);

app.listen(process.env.PORT,async ()=>{
    await connectToDB();
    console.log(`Server listening on port ${process.env.PORT}`);
}); 