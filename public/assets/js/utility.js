let createTerminalSystemMessage = (classs, content, tag = 'span') => {
    terminalWrapper.innerHTML +=
        `<div class="terminal_message">
                <${tag} class="${classs}">${content}</${tag}>
            </div>`;
    setFocusOnDivWithId('input_field');
}

let createTerminalIncomingMessage = (classs, message, sender) => {
    terminalWrapper.innerHTML +=
        `<div class="terminal_message d-flex gap-4 align-items-center">
            <div class="d-flex gap-2">
                <span class="background-pink text-complement d-flex gap-2 arrow-div arr-left-front-username-incoming username username_input ">🙍‍♂️ <span class="d-none d-md-block" > ${sender.name}</span></span>
                <span class="background-purple text-complement d-flex gap-2 arrow-div arr-left-front-room arr-left-back room room_input">🔊 <span class="d-none d-md-block" > ${sender.room}</span></span>
            </div>
            <span class="${classs}"> ${message}</span>
        </div>`;
    setFocusOnDivWithId('input_field');
    (user.sound == 'on') ? audio2.play() : "";
}
let createTerminalOutgoingMessage = (classs, message, user) => {
    terminalWrapper.innerHTML +=
        `<div class="terminal_message d-flex gap-4 align-items-center">
            <div class="d-flex gap-2">
                <span class="background-orange text-complement d-flex gap-2 arrow-div arr-left-front-username-outgoing username username_input ">🙍‍♂️ <span class="d-none d-md-block" > ${user.name}</span></span>
                <span class="background-purple text-complement d-flex gap-2 arrow-div arr-left-front-room arr-left-back room room_input">🔊 <span class="d-none d-md-block" > ${user.room}</span></span>
            </div>
            <span class="${classs}"> ${message}</span>
        </div>`;
    setFocusOnDivWithId('input_field');
}

let setFocusOnDivWithId = (e) => {
    const scrollIntoViewOptions = { behavior: "smooth", block: "center" };
    document.getElementById(e).scrollIntoView(scrollIntoViewOptions);
};

let updateUsername = (name) => {
    updateLocalConfigValue('name', name);
    user.name = name;
    usernameInput.innerHTML = "🙍‍♂️ " + `<span class="d-none d-md-block">${name}</span>`;
}

let updateRoomId = (roomId) => {
    localStorage.setItem('roomId', roomId);
    user.roomId = roomId;
    document.querySelector('.roomId_input').innerHTML = "🔊 " + `<span class="d-none d-md-block">${roomId}</span>`;
}

let randomNumber = () => {
    return Math.floor(Math.random() * 90000) + 10000;
}

let updateLocalConfigValue = (name, value) => {
    let u = JSON.parse(localStorage.getItem('user'));
    u[name] = value;
    user[name] = value;
    localStorage.setItem('user', JSON.stringify(u));
}

let updateLocalInputRoomValue = (room) => {
    roomIdInput.innerHTML = '🔊 ' + `<span class="d-none d-md-block">${room}</span>`;
}

let updateLocalInputNameValue = (name) => {
    usernameInput.innerHTML = '🙍‍♂️ ' + `<span class="d-none d-md-block">${name}</span>`;
}
