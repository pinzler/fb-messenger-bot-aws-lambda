'use strict';

var https = require('https');

var PAGE_TOKEN = "GET_TOKEN_FROM_FACEBOOK_APP_SETUP";

var VERIFY_TOKEN = "my_token";

exports.handler = (event, context, callback) => {

  // process GET request

  if(event.params && event.params.querystring){
    var queryParams = event.params.querystring;
 
    var rVerifyToken = queryParams['hub.verify_token']
 
    if (rVerifyToken === VERIFY_TOKEN) {
      var challenge = queryParams['hub.challenge']
      callback(null, parseInt(challenge))
    }else{
      callback(null, 'Error, wrong validation token');
    }
 
  // process POST request
  } else {
 
    var messagingEvents = event.entry[0].messaging;
    for (var i = 0; i < messagingEvents.length; i++) {
      var messagingEvent = messagingEvents[i];
 
      var sender = messagingEvent.sender.id;
      if (messagingEvent.message && messagingEvent.message.text) {
        var text = messagingEvent.message.text; 
        console.log("Receive a message: " + text);
        
        sendTextMessage(sender, "Text received, echo: " + text);
 
        callback(null, "Done")
      }
    }
 
    callback(null, event);
  }
};

function sendDots(senderFbId) {
  var json = {
    recipient: {id: senderFbId},
    sender_action: "typing_on"
  };
  sendAll(json);
}

function sendTextMessage(senderFbId, text) {

  var json = {
    recipient: {id: senderFbId},
    message: {text: text},
  };
  sendAll(json);

}

function sendMediaMessage(senderFbId, url, type) {
  
  var json = {
    recipient: {id: senderFbId},
    message: { attachment:{ type: type, payload : { url: url }} }
  };
  sendAll(json);

}

function sendTextAndMediaMessage(senderFbId, text, url, type) {
  var jsonArray = [];
  
  jsonArray.push({
    recipient: {id: senderFbId},
    message: {text: text},
  });

  jsonArray.push({
    recipient: {id: senderFbId},
    message: { attachment:{ type: type, payload : { url: url }} }
  });
  
  sendAll(jsonArray);

}

function sendAll(jsonParameter) {
  var json;
  if (Array.isArray(jsonParameter))
  { 
    json = jsonParameter[0];
  }
  else 
  {
    json = jsonParameter;
  }

  var body = JSON.stringify(json);
  var path = '/v2.6/me/messages?access_token=' + PAGE_TOKEN;
  var options = {
    host: "graph.facebook.com",
    path: path,
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  };
  var callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      if (Array.isArray(jsonParameter))
      {
        if (jsonParameter.length > 1)
        {
          jsonParameter.shift();
          sendAll(jsonParameter);
        }
      }
    });
  }

  var req = https.request(options, callback);
  req.on('error', function(e) {
    console.log('problem with request: '+ e);
  });
 
  req.write(body);
  req.end();
}
