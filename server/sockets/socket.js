const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users;

// io = Backend communication
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

        users.addUser(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('usersConnected', users.getUsersFromARoom(data.room));
        callback(users.getUsersFromARoom(data.room));
    });

    // Listen a message and send it to all users
    client.on('sendMessage', (data) => {
        let user = users.getUser(client.id);
        let message = createMessage(user.name, data.message);
        client.broadcast.to(user.room).emit('sendMessage', message);
    });

    // Private Messages
    client.on('privateMessage', (data) => {
        let user = users.getUser(client.id);

        client.broadcast.to(data.receiverId).emit('privateMessage', createMessage(user.name, data.message));
    });


    client.on('disconnect', () => {
        userDeleted = users.removeUser(client.id);

        console.log(userDeleted);
        client.broadcast.to(userDeleted.room).emit('sendMessage', createMessage('Admin', `${userDeleted.name} has left the chat`));
        client.broadcast.to(userDeleted.room).emit('usersConnected', users.getUsersFromARoom(userDeleted.room));
    });
});