class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {
            id,
            name,
            room
        }

        this.users.push(user);

        return this.users;
    }

    getUsers() {
        return this.users;
    }

    getUsersFromARoom(room) {
        return this.users.filter(user => user.room === room);
    }

    removeUser(id) {
        let userDeleted = this.getUser(id);
        this.users = this.users.filter(user => user.id !== id);

        return userDeleted;
    }
}

module.exports = {
    Users
}