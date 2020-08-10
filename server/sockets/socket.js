const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users;

io.on('connection', (client) => {
    client.on('JoinChat', (data, callback) => {
        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'Name and room are required!'
            });
        }

        // Connect the user with specific room
        client.join(data.room);

        //Add new user connection to the array
        users.addUser(client.id, data.name, data.room);

        //Update list of users every time a user connects and send a message to all users connected to that room
        client.broadcast.to(data.room).emit('usersConnected', users.getUsersFromARoom(data.room));
        client.broadcast.to(data.room).emit('sendMessage', createMessage('Admin', `${data.name} joined the chat`));
        callback(users.getUsersFromARoom(data.room));
    });

    // Listen a message and send it to all users
    client.on('sendMessage', (data, callback) => {
        let user = users.getUser(client.id);
        let message = createMessage(user.name, data.message);

        client.broadcast.to(user.room).emit('sendMessage', message);
        callback(message);
    });


    client.on('disconnect', () => {
        userDeleted = users.removeUser(client.id);

        // Send a message to all users to inform that someone has disconnected and update the list of users
        client.broadcast.to(userDeleted.room).emit('sendMessage', createMessage('Admin', `${userDeleted.name} has left the chat`));
        client.broadcast.to(userDeleted.room).emit('usersConnected', users.getUsersFromARoom(userDeleted.room));
    });
});