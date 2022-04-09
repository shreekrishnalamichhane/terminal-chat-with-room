let createTerminalSystemMessage = (classs, content, tag = 'span') => {
    terminalWrapper.innerHTML +=
        `<div class="terminal_message">
                <${tag} class="${classs}">${content}</${tag}>
            </div>`;
    setFocusOnDivWithId('input_field');
}

let createTerminalIncomingMessage = (classs, message, user) => {
    terminalWrapper.innerHTML +=
        `<div class="terminal_message">
            <span class="background-orange text-complement username ">🙍‍♂️ ${user.name}</span>
            <span class="background-purple text-complement room ">🔊 ${user.room}</span>
            <span class="${classs}"> ${message}</span>
        </div>`;
    setFocusOnDivWithId('input_field');

}
let createTerminalOutgoingMessage = (classs, message, user) => {
    terminalWrapper.innerHTML +=
        `<div class="terminal_message">
            <span class="background-orange text-complement username ">🙍‍♂️ ${user.name}</span>
            <span class="background-purple text-complement room ">🔊 ${user.room}</span>
            <span class="${classs}"> ${message}</span>
        </div>`;


    setFocusOnDivWithId('input_field');
}

let setFocusOnDivWithId = (e) => {
    const scrollIntoViewOptions = { behavior: "smooth", block: "center" };
    document.getElementById(e).scrollIntoView(scrollIntoViewOptions);
};

let updateUsername = (username) => {
    localStorage.setItem('username', username);
    user.name = username;
    document.querySelector('.username_input').innerHTML = "🙍‍♂️ " + username;
}

let updateRoomId = (roomId) => {
    localStorage.setItem('roomId', roomId);
    user.roomId = roomId;
    document.querySelector('.roomId_input').innerHTML = "🔊 " + roomId;
}

let randomNumber = () => {
    return Math.floor(Math.random() * 90000) + 10000;
}

let updateLocalConfigValue = (name, value) => {
    let user = JSON.parse(localStorage.getItem('user'));
    user[name] = value;
    localStorage.setItem('user', JSON.stringify(user));
}

let updateLocalInputRoomValue = (room) => {
    roomIdInput.innerText = '🔊 ' + room;
}

let updateLocalInputNameValue = (name) => {
    usernameInput.innerText = '🙍‍♂️ ' + name;
}
