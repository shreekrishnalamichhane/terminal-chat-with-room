module.exports = {
    // send command error to the client socket
    sendCommandError: (io, socket, classs, msg = 'Command Error : Invalid command or parameter.') => {
        io.to(socket.id).emit('system message', classs, msg);
    },
    //generate a random id for the room
    randomSocketId: (length = 20) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }
}