let socket = io();

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and room are required!');
}

let user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', () => {
    socket.emit('JoinChat', user, (resp) => {
        renderUsers(resp);
    });
});

socket.on('sendMessage', (msg) => {
    renderMessage(msg, false);
});

// Get users list every time that an user connects or disconnects
socket.on('usersConnected', (users) => {
    renderUsers(users);
});

socket.on('disconnect', () => {
    console.log('Connection with server lost');
});