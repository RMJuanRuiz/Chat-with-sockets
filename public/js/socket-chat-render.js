let params = new URLSearchParams(window.location.search);

let userName = params.get('name');
let room = params.get('room');

let divUsers = document.getElementById('users');
let sendChat = document.getElementById('sendChat');
let txtMessage = document.getElementById('txtMessage');
let divChatBox = document.getElementById('chatBox');

// Render in HTML all users connected
const renderUsers = (users) => {
    let html = '';

    html += '<li>';
    html += `<a class="active"><span>Users in </span>${room} Room</a>`;
    html += '</li>';

    for (let i = 0; i < users.length; i++) {
        html += '<li>';
        html += `<a data-id="${users[i].id}"><img src="assets/images/users/noimage.png" alt="user-img" class="img-circle"> <span> ${users[i].name}<small class="text-success">online</small></span></a>`;
        html += '</li>';
    }

    divUsers.innerHTML = html;
};

// Render in HTML new messages of the chat room
const renderMessage = (message, myMessage) => {
    let html = '';
    let date = new Date(message.date);
    let time = date.getHours() + ':' + date.getMinutes();
    let adminClass = 'info';
    if (message.name === 'Admin') {
        adminClass = 'danger';
    }

    if (myMessage) {
        html += '<li class="reverse animated fadeIn">'
        html += '<div class="chat-content">'
        html += `<h5>${message.name}</h5>`
        html += `<div class="box bg-light-inverse">${message.message}</div>`
        html += '</div>'
        html += '<div class="chat-img"><img src="assets/images/users/noimage.png" alt="user" /></div>'
        html += `<div class="chat-time">${time}</div>`
        html += '</li>'
    } else {
        html += '<li class="animated fadeIn">';
        if (message.name !== 'Admin') {
            html += '<div class="chat-img"><img src="assets/images/users/noimage.png" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += `<h5>${message.name}</h5>`;
        html += `<div class="box bg-light-${adminClass}">${message.message}</div>`;
        html += '</div>';
        html += `<div class="chat-time">${time}</div>`;
        html += '</li>';

    }

    divChatBox.insertAdjacentHTML('beforeend', html);
    divChatBox.scrollTop = divChatBox.scrollHeight;
}

// Send a new message to the room
sendChat.addEventListener('submit', (event) => {
    event.preventDefault();

    if (txtMessage.value.trim().length === 0) {
        return;
    };

    socket.emit('sendMessage', {
        name: userName,
        message: txtMessage.value
    }, (resp) => {
        txtMessage.value = '';
        txtMessage.focus();
        renderMessage(resp, true);
    });
});