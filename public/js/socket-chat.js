let socket = io();

let params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and room are required!');
}

let user = {
    name: params.get('name'),
    room: params.get('room')
}

// .on is for listening to information
socket.on('connect', function() {

    socket.emit('JoinChat', user, (resp) => {
        console.log('Users connected: ', resp);
    });

});

socket.on('disconnect', function() {
    console.log('Connection with server lost');
});

// Listen to information
/* socket.emit('sendMessage', 'asdsa', (resp) => {

});
 */

// Listen to information
socket.on('sendMessage', function(msg) {
    console.log(msg);
});

// Get users list every time that an user connects or disconnects
socket.on('usersConnected', (users) => {
    console.log('UsersConnected:', users);
});

// get private Messages
socket.on('privateMessage', (message) => {
    console.log('Private Message: ', message);
})