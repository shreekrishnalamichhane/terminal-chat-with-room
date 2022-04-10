const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const fs = require('fs');
const path = require('path');
const { sendCommandError, randomSocketId } = require('./helper');

require('dotenv').config();
const io = new Server(server);
app.use(express.static('../public'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connect', (socket) => {
    //sending welcome messages at the page load.
    socket.emit('welcome', 'text-white p-0', 'Welcome to the CLI Chat', 'h3');
    socket.emit('welcome', 'text-white', `Version : ${process.env.VERSION}`, 'span');
    socket.emit('welcome', 'text-white', `Author : ${process.env.AUTHOR}`, 'span');
    socket.emit('welcome', 'text-white', `Author Website : <a class="text-pink" target="_blank" href="${process.env.AUTHOR_URL}">${process.env.AUTHOR_URL}</a>`, 'span');
    socket.emit('welcome', 'text-white', `Github : <a class="text-pink" target="_blank" href="${process.env.AUTHOR_GITHUB}">${process.env.AUTHOR_GITHUB}</a>`, 'span');
    socket.emit('welcome', 'text-white', `use <span class="text-orange">/help</span> to see the help guide.</span>`, 'span');

    //respond to the client authenticate request.
    socket.on('authenticate', (user) => {
        //if user is already in the room.
        //saved on the client's browser localStorage as {user}.
        if (user.room != null) {
            socket.user = user;
            //authenticate the user with the provided name.
            socket.emit('authenticate', user.name);
            //join the socket to the room.
            socket.join(user.room);
            //emit roomId to socket .
            socket.emit('room', user.room);
            //emit join success message with socket id.
            // socket.emit('system message', 'text-success', 'Joined with id :' + socket.id)
            io.to(user.room).emit('join', 'text-success', socket.user);
        } else {
            //if user is not already in a room.
            socket.leave(null);
            //generate a random roomId.
            user.room = randomSocketId(20);
            //initialize the user in the socket.
            socket.user = user;
            //authenticate the user with the provided name. 
            socket.emit('authenticate', user.name);
            //emit a roomId to the socket.
            socket.emit('room', user.room);
            //join the socket to the room.
            socket.join(user.room);
            //emit room join message to the socket.
            socket.emit('system message', 'text-success', 'Joined with id :' + socket.id);
            //emit new user join message to the room.
            io.to(user.room).emit('join', 'text-success', socket.user);
        }
    });
    socket.on('disconnect', () => {
        try {
            //send disconnect message to the room when socket disconnect.
            io.to(socket.user.room).emit('disconn', 'text-warning', socket.user, socket.user.room);
        } catch (error) {
            //catch the errors
            console.log('error', 'App Crashed.', error);
        }
    });

    socket.on('message', (msg) => {
        let originalMessage = msg;
        try {
            //check for the command message by checking '/' in the first position
            if (msg[0] === '/') {
                // split the message by " ".
                msg = msg.split(' ');
                // calculate the noOfArgs
                // -1  is done to discard the first command word.
                noOfArgs = msg.length - 1;
                //extracting command word
                let command = msg[0].substring(1).toLowerCase();
                switch (command) {
                    case 'version':
                        if (noOfArgs == 0) socket.emit('system message', 'text-pink', 'Current version : ' + process.env.VERSION);
                        else sendCommandError(io, socket, 'Command Error : No of arguments 0 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.');
                        break;
                    case 'join':
                        //if noOfArgs is 1 then 
                        if (noOfArgs == 1) {
                            // if user is already in the room then leave that room first.
                            if (socket.user.room != null) {
                                //sending the leave message to the room.
                                io.to(socket.user.room).emit('leave', 'text-warning', socket.user, socket.user.room); //event , class, involved user, room to leave
                                //leaving the current room
                                socket.leave(socket.user.room);
                            }
                            //     /join [roomId]  so first arg is the roomId. 
                            socket.user.room = msg[1];
                            //joining the room with provided id.
                            socket.join(socket.user.room);
                            //sending join message to the newly joined room.
                            io.to(socket.user.room).emit('join', 'text-success', socket.user)
                        }
                        else
                            //if noOfArgs is else then, send the error.
                            sendCommandError(io, socket, 'text-danger', 'Command Error : No of arguments 1 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.')
                        break;
                    case 'leave':
                        //if noOfArgs is 0 then 
                        if (noOfArgs == 0) {
                            //sending leaving message to the room
                            io.to(socket.user.room).emit('leave', 'text-warning', socket.user, socket.user.room);
                            //leaving the room
                            socket.leave(socket.user.room);
                            //clearing the socket user room.
                            socket.user.room = null;
                        }
                        else
                            //if noOfArgs is else then, send the error.
                            sendCommandError(io, socket, 'text-danger', 'Command Error : No of arguments 0 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.')
                        break;
                    case 'create':
                        //if noOfArgs is 0 then 
                        if (noOfArgs == 0) {
                            //leaving the current room
                            io.to(socket.user.room).emit('leave', 'text-warning', socket.user, socket.user.room);
                            socket.leave(socket.user.room);
                            //generating new {roomId} to join
                            socket.user.room = randomSocketId(20);
                            //join the new room
                            socket.join(socket.user.room);
                            //send room create message to the socket
                            socket.emit('create', 'text-success', socket.user.room);
                            //send join & invite message to the joined room.
                            io.to(socket.user.room).emit('join', 'text-success', socket.user);
                            socket.emit('invite', 'text-pink', socket.user.room);
                            // socket.emit('system message', 'text-pink', 'Use /invite to get the invitation command.');
                        } else
                            //if noOfArgs is else then, send the error.
                            sendCommandError(io, socket, 'text-danger', 'Command Error : No of arguments 0 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.')
                        break;
                    case 'invite':
                        if (noOfArgs == 0)
                            socket.emit('invite', 'text-pink', socket.user.room);
                        else
                            //if noOfArgs is else then, send the error.
                            sendCommandError(io, socket, 'text-danger', 'Command Error : No of arguments 0 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.')
                        break;
                    case 'help':
                        if (noOfArgs == 0) {
                            fs.readFile(path.join(__dirname, './help.html'), 'utf8', (err, data) => socket.emit('system message', '', data));
                        }
                        else
                            //if noOfArgs is else then, send the error.
                            sendCommandError(io, socket, 'text-danger', 'Command Error : No of arguments 0 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.')
                        break;
                    case 'name':
                        //if noOfArgs is 0 then
                        if (noOfArgs == 1) {
                            // store new and old name in a variable.
                            let name = {
                                old: socket.user.name,
                                new: msg[1]
                            }
                            // if new name is different than old name, then only
                            if (name.old !== name.new) {
                                // change the socket user
                                socket.user.name = name.new;
                                // emit rename event to the current room
                                io.to(socket.user.room).emit('rename', socket.user, name);
                            }
                            else {
                                //if noOfArgs is else then, send the error.
                                sendCommandError(io, socket, 'text-danger', 'Argument Error : Please provide different name than your current name.')
                            }
                        }
                        else
                            //if noOfArgs is else then, send the error.
                            sendCommandError(io, socket, 'text-danger', 'Command Error : No of arguments 1 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.')
                        break;

                    case 'sound':
                        //if noOfArgs is 1 then
                        if (noOfArgs == 1) {
                            // convert the argument to lowercase
                            let val = msg[1].toLowerCase();
                            //if val is 'on'
                            if (val == 'on') {
                                //emit the 'on' sound event
                                socket.emit('sound', 'on');
                                //emit system notification
                                socket.emit('system message', 'text-white', 'Sound Notification has been turned on.');
                            }
                            //if val is 'off'
                            else if (val == 'off') {
                                //emit the 'off' sound event
                                socket.emit('sound', 'off');
                                //emit system notification
                                socket.emit('system message', 'text-white', 'Sound Notification has been turned off.');
                            }
                            else {
                                //if val is else, then send argument error.
                                sendCommandError(io, socket, 'text-danger', `Argument error : Possible value are 'on' or 'off. <br> Use /help to view all commands.`)
                            }
                        }
                        else {
                            //if noOfArgs is else then, send the error.
                            sendCommandError(io, socket, 'text-danger', 'Command Error : No of arguments 1 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.')
                        }
                        break;

                    case 'cls':
                        //if noOfArgs is 0 then
                        if (noOfArgs == 0) {
                            socket.emit('cls');
                        }
                        else
                            //if noOfArgs is else then, send the error.
                            sendCommandError(io, socket, 'text-danger', 'Command Error : No of arguments 0 expected, ' + noOfArgs + ' found. <br> Use /help to view all commands.')
                        break;
                    default:
                        //send the message to all the sockets in the room.
                        io.to(socket.user.room).emit('message', originalMessage, socket.user);
                        break;
                }
            }
            // if the message is not a command, i.e, first letter in the message is not '/'.
            else {
                //send the message to all the sockets in the room.
                io.to(socket.user.room).emit('message', originalMessage, socket.user);
            }
        } catch (error) {

        }
    })
});



server.listen(3000, () => {
    console.log('Running on http://localhost:3000');
});