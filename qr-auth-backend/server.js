const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes/authRoutes');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
// App setup
var app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.DB_URI, {
    useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('Connected to database'));


const PORT = 1192;
var server = app.listen(PORT, function(){
    console.log('listening for requests on port 1192,');
});

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server, {
    cors: '*'
});



let socketId = null;

io.on('connection', (socket) => {
    console.log(socket.id);
    socketId = socket.id;
    
    
    socket.on('get-cookie', fn => fn(`qrauthsystem://${socket.id}`));
    socket.on('authenticate-user', (data, callback) => {

        console.log(data.data.substring(15,));
        socket.to(data.data.substring(15,)).emit('userlogin', data);

    })

    socket.emit('hello', "Welcome!");


    socket.on('conn-req', (data, fn) => {
        fn('hello');
    });


    socket.on('disconnect', (reason) => {
        console.log(reason);
    })
});



app.get('/', (req, res) => {
    
    res.send('Hello, World');

});

app.use(router);