var apiKey,
    sessionId,
    token;

$(document).ready(function() {
  // See the confing.js file.
  if (API_KEY && TOKEN && SESSION_ID) {
    apiKey = API_KEY;
    sessionId = SESSION_ID;
    token = TOKEN;
    initializeSession();
  } else if (SAMPLE_SERVER_BASE_URL) {
    // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
    $.get(SAMPLE_SERVER_BASE_URL + '/session', function(res) {
      apiKey = res.apiKey;
      sessionId = res.sessionId;
      token = res.token;

      initializeSession();
    }).fail(function(err) {
      alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
    });
  }
});

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, function(error) {
      if (error) {
        console.log('There was an error publishing: ', error.name, error.message);
      }
    });
  });

  session.on('sessionDisconnected', function(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // Connect to the session
  session.connect(token, function(error) {
    if(error) {
      console.log('There was an error connecting to the session: ', error.name, error.message);
    }
  });
}
