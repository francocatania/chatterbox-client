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
  fredPics: ['img/Fred.png', 'img/Fred 2.png'],

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
    let fred = app.fredPics[Math.random() > .5 ? 1: 0];
    let username = escape(message.username).replace(/%20/g, " ");
    let text = escape(message.text).replace(/%20/g, " ");
    let room = escape(message.roomname).replace(/%20/g, " ");
    let createdAt = escape(message.createdAt).replace(/%20/g, " ");
    let $chatTemplate = `
<div class="w3-card-4 tweet" style="width:100%">
                   <img src="${fred}" class="w3-left w3-circle w3-margin-right" id="userPicture" style="width:60px">
                   <div class="card">
                     <div class="card-block">
                     <h4 class="card-title">${username}</h4>
                     <h6 class="card-subtitle mb-2 text-muted">${room}</h6>
                     <p class="card-text">${text}</p>
                   </div>
                 </div>
               </div>
                       `;
    $('#chats').append($chatTemplate);
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
      $('.rooms').append(`<option value="${roomNum}">${escape(roomNum).replace(/%20/g, " ")}</option>`);
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

// <div class="chatWindow">
//   <img src="img/Fred.png" alt="" class="chatImg">
//   <div class="chatBox">
//     <div class="chatHeader"><span class="chatUser">${username}</span><span class="chatRoom">${room}</span></div>
//     <div class="chatText">${text}</div>
//   </div>
// </div>
