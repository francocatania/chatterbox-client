$(document).ready(function() {
  app.init();
  // $("#sendForm").on( "click", function () {
  //   console.log('I am submitting');
  // });

  $('#sendForm').on('click', function () {
    debugger;
    console.log('I am submitting')
});
})

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  allMessages : [],
  allRooms: [],

  init: function () {
    this.fetch();
    this.uniqRooms();
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
      success: function (messages) {
        debugger;
        messages.results.forEach(function(msg) {
          app.allMessages.push(msg);
          if (!!msg.roomname) {
            app.allRooms.push(msg.roomname);
          }

        });
        app.renderAllMessages();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: SHIT, Failed to send message', data);
      }
    })
  },

  clearMessages: function() {
    $( "#chats" ).empty();
  },

  renderMessage: function (message) {
    let username = message.username;
    let text = message.text;
    let room = message.roomname;
    $('#chats').append(`<div>${username} says: ${text}</div>`)
  },

  renderAllMessages: function() {
    debugger;
    app.allMessages.forEach(function(eachMsg) {
      app.renderMessage(eachMsg);
    })
  },

  getAllRooms: function() {
    // getting a list of all rooms present in your messages
    //access allMessages --> array
  },
  // <option value="volvo">Volvo</option>

  uniqRooms: function () {
    _.uniq(allRooms);
  }
};

class Message {
  constructor (username, text, roomname) {
    this.username = username
    this.text = text
    this.roomname = roomname
  }
}
