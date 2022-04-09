
var user;
var localUser;

let socketInit = (room) => {
    var socket = io({
        query: {
            user: JSON.stringify(user),
        }
    });
    socket.on('welcome', (classs, msg, tag) => {
        createTerminalSystemMessage(classs, msg, tag);
    })
    socket.on('room', (room) => {
        updateLocalConfigValue('room', room);
        user.room = room;
        updateLocalInputRoomValue(room);
        roomIdInput.innerHTML = "🔊 " + room;
    });

    console.log(user);
    socket.emit('authenticate', user);
    socket.on('authenticate', (name) => {
        console.log('running');
        updateLocalInputNameValue(name);
    });

    socket.on('disconn', (classs, sender, roomId) => {
        createTerminalSystemMessage(classs, sender.name + ' has disconnected.');
    });

    terminalInput.addEventListener('keyup', (event) => {
        if (event.keyCode === 13 && event.target.value != '') {
            socket.emit('message', event.target.value);
            setFocusOnDivWithId('input_field');
            event.target.value = "";
        }
    });

    socket.on('message', (msg, sender) => {
        if (sender.name == user.name)
            createTerminalOutgoingMessage('text-outgoing', msg, sender);
        else
            createTerminalIncomingMessage('text-incoming', msg, sender);
    });

    socket.on('system message', (classs, msg) => {
        createTerminalSystemMessage(classs, msg);
    });

    socket.on('join', (classs, sender) => {
        console.log(sender);
        if (user.name == sender.name) {
            createTerminalSystemMessage(classs, 'You joined the room : ' + sender.room);
            updateLocalConfigValue('room', sender.room);
            updateLocalInputRoomValue(sender.room);
        }
        else {
            createTerminalSystemMessage(classs, sender.name + ' has joined the room.');
        }
    });
    socket.on('leave', (classs, sender, roomId) => {
        if (user.name == sender.name) {
            createTerminalSystemMessage(classs, 'You left the room : ' + roomId);
            updateLocalConfigValue('room', null);
            updateLocalInputRoomValue(null);
        }
        else {
            createTerminalSystemMessage(classs, sender.name + ' has left the room.');
        }
    });
    socket.on('create', (classs, roomId) => {
        createTerminalSystemMessage(classs, 'New room created with id: ' + roomId);
    });

    socket.on('invite', (classs, roomId) => {
        let str = "/join " + roomId;
        navigator.clipboard.writeText(str);
        createTerminalSystemMessage(classs, 'Invite command copied to clipboard. <br> Room Id :' + roomId);
    })

    socket.on('rename', (sender, name) => {
        //if the user is same as who requested the rename operation
        if (user.name == name.old) {
            //update the user name in all frontend aspects
            updateUsername(name.new);
            //display a terminal message to the user
            createTerminalSystemMessage('text-warning', `Your name has been renamed from ${name.old} to ${name.new}.`)
        } else {
            //if the user is different than who requested the rename operation
            //display a terminal message to the other users in the same room.
            createTerminalSystemMessage('text-warning', `${name.old} has renamed themselves to ${name.new}.`)
        }
    })


}

let init = () => {
    localUser = localStorage.getItem('user');
    if (localUser != null) {
        user = JSON.parse(localStorage.getItem('user'))
        // console.log(user);
        socketInit(user.room);
    }
    else {
        user = {
            name: "Guest-" + randomNumber(),
            room: null
        };
        localStorage.setItem('user', JSON.stringify(user));
        init();
        // console.log(user);
    }
}
init();