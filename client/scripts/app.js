$(document).ready(function() {
  app.init();

  $('#sendForm').on('click', function (e) {
    let theNewMessage = new Message(window.location.search.slice(10) ,
                          document.getElementById('inputText').value, 
                          document.getElementById('currentRoom').value );
    app.send(theNewMessage);
    app.fetch();
  });

  $('#currentRoom').on('change', function () {  
    // selected room = null by default, on click sets to current room
    app.currentRoom = document.getElementById('currentRoom').value;
    app.fetch();
  });

});

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  allMessages: [],
  allRooms: [],
  currentRoom: 'All',

  init: function () {
    this.fetch();
    // setInterval(this.fetch, 5000);
  },


  send: function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
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
    app.clearMessages();
    
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      data: 'order=-createdAt',
      success: function (messages) {
        messages.results.forEach(function(msg) {
          if (app.currentRoom === 'All') {
            app.allMessages.push(msg);
          }
          if (app.currentRoom === msg.roomname) {
            app.allMessages.push(msg);
          }
          if (!!msg.roomname) {
            app.allRooms.push(msg.roomname);
          }

        });
        app.organizeAllRooms(app.currentRoom);
        app.renderRoomSelect();
        app.renderAllMessages();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: SHIT, Failed to send message', data);
      }
    });
  },
// sort array A-Z and bring currentRoom to front
  organizeAllRooms: function(room) {
    app.allRooms.push('All');
    app.uniqRooms();
    app.allRooms.sort();
    app.allRooms.splice(app.allRooms.indexOf(room), 1);
    app.allRooms.unshift(room);
  },

  clearMessages: function() {
    $("#chats").empty();
    $(".rooms").empty();
    this.allRooms = [];
    this.allMessages = [];
  },

  renderMessage: function (message) {
    let username = escape(message.username);
    let text = escape(message.text);
    let room = escape(message.roomname);
    let createdAt = message.createdAt;
    $('#chats').append(`<div class="message">${room}: <div>${username} says:<br><br>${text}</div><br><br>${createdAt}</div>`);
  },

  renderAllMessages: function() {
    app.allMessages.forEach(function(eachMsg) {
      app.renderMessage(eachMsg);
    });
  },

  uniqRooms: function () {
    app.allRooms = _.uniq(app.allRooms);
  },

  renderRoomSelect: function () {
    app.allRooms.forEach(function (roomNum) {
      $('.rooms').append(`<option value="${roomNum}">${roomNum}</option>`);
    });
  }
};

class Message {
  constructor (username, text, roomname) {
    this.username = username;
    this.text = text;
    this.roomname = roomname;
  }
}
