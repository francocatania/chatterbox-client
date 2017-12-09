$(document).ready(function() {
  app.init();

  $('#sendForm').on('click', function () {

  });
  $('#roomSelect').on('click', function () {
    // trigger render room messages
  });

});

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  allMessages: [],
  allRooms: [],

  init: function () {
    this.fetch();
  },
  send: function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: message,
      contentType: 'application/text',
      success: function (data) {
        console.log('chatterbox: Message sent, siiick');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Sh00T, Fa1l3d t0 s3nd message', data);
      }
    });
  },
  fetch: function () {
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      data: 'order=-createdAt',
      success: function (messages) {
        messages.results.forEach(function(msg) {
          app.allMessages.push(msg);
          if (!!msg.roomname) {
            app.allRooms.push(msg.roomname);
          }

        });
        app.renderAllMessages();
        app.renderRoomSelect();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: SHIT, Failed to send message', data);
      }
    });
  },

  clearMessages: function() {
    $("#chats").empty();
  },

  renderMessage: function (message) {
    let username = escape(message.username);
    let text = escape(message.text);
    let room = escape(message.roomname);
    $('#chats').append(`<div>${username} says: ${text}</div>`);
  },

  renderAllMessages: function() {
    app.allMessages.forEach(function(eachMsg) {
      app.renderMessage(eachMsg);
    });
  },

  getAllRooms: function() {
    // getting a list of all rooms present in your messages
    //access allMessages --> array
  },
  // <option value="volvo">Volvo</option>

  uniqRooms: function () {
    app.allRooms = _.uniq(app.allRooms);
  },

  renderRoomSelect: function () {
    debugger;
    app.uniqRooms()
    app.allRooms.forEach(function (roomNum) {
      $('.rooms').append(`<option value="${roomNum}">${roomNum}</option>`)
    })
  }
};

class Message {
  constructor (username, text, roomname) {
    this.username = username;
    this.text = text;
    this.roomname = roomname;
  }
}
