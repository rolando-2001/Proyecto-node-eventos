
const express=require('express');
const { dbConnection } = require('./database/config');
const cors=require('cors');
const app=express();

require('dotenv').config();

dbConnection()

app.use(cors());
app.use(express.static('public'));
app.use(express.json());


// TODO auth 
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/eventos'));



app.listen(process.env.PORT,()=>{
    console.log('Server is running on port 4000');
}); 