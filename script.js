// Display Welcome message when a new user is registered
function displayWelcomeMessage(data) {
	let alertNode = document.createElement("div");
	alertNode.setAttribute('class','alert alert-success alert-dismissible fade show');
	alertNode.setAttribute('role','alert');
	alertNode.innerHTML = 'You are added to <strong>' + data.channel + '</strong> successfully!' + 
			'<button type="button" class="close" data-dismiss="alert" aria-label="close">' + 
			'<span aria-hidden="true">×</span></button>';

	document.getElementById('alertContainer').appendChild(alertNode);
}

// Display System message when a new user is registered
function diplaySystemMessage(userName) {
	let systemMessage = 'System : ' + userName;

	let messageElement = document.createElement("div");
	messageElement.setAttribute('class','col-12 form-group');
	messageElement.innerHTML = '<div class="card received-message">'+
							'<div class="card-body"><div class="card-text">' + 
							systemMessage + '</div></div></div>';
	
	document.getElementById('chatContainer').appendChild(messageElement);
}

// Display current user message
function displayCurrentUserMsg(message) {
	let currentUserMessage = 'Me : ' + message;

	let messageElement = document.createElement("div");
	messageElement.setAttribute('class','col-12 form-group');
	messageElement.innerHTML = '<div class="card received-message">'+
							'<div class="card-body"><div class="card-text">' + 
							currentUserMessage + '</div></div></div>';

	let chatContainer = document.getElementById('chatContainer');
	chatContainer.insertBefore(messageElement, chatContainer.childNodes[0]);
}

// Display other users message
function displayOtherUsersMsg(message, userName) {
	let otherUserMessage =  userName + ' : ' + message;

	let messageElement = document.createElement("div");
	messageElement.setAttribute('class','col-12 form-group');
	messageElement.innerHTML = '<div class="card received-message">'+
							'<div class="card-body"><div class="card-text">' + 
							otherUserMessage + '</div></div></div>';

	let chatContainer = document.getElementById('chatContainer');
	chatContainer.insertBefore(messageElement, chatContainer.childNodes[0]);
}

function populateChannels(channel) {
	let channelOptions = "";
	channelOptions += "<option>" + channel + "</option>";
	document.getElementById("channelsList").innerHTML = channelOptions;
}

function removeChannel() {
	let channelOptions = "";
	channelOptions += "<option></option>";
	document.getElementById("channelsList").innerHTML = channelOptions;
}

// Sending a message on a particular channel
function sendMessage(event,socket) {
	event.preventDefault();
	displayCurrentUserMsg(document.getElementById('message').value);
	let message = document.getElementById('message').value;
	let channel = document.getElementById('channel').value;
	let username = document.getElementById('username').value;
	console.log("Message sent by ", username, "  on channel ", channel);
	socket.emit('message',{ username, channel, message });
}

// Joining a particular channel
function joinChannel(event,socket) {
	let selectedChannel = document.getElementById('newchannel');

	if(selectedChannel.value) {
		populateChannels(selectedChannel.value);
		socket.emit('joinChannel',{channel:selectedChannel.value});
	}
}

// Leaving a particular channel
function leaveChannel(event, socket) {
	let selectedChannel = document.getElementById('newchannel');

	if(selectedChannel.value) {
		populateChannels(selectedChannel.value);
		socket.emit('leaveChannel',{channel:selectedChannel.value});
	}
}

function onWelcomeMessageReceived(userName) {
	console.log('New User Registration received and display system message ', userName);
	diplaySystemMessage(userName);
}

function onNewMessageReceived(messageObject) {
	console.log('New Message received ', messageObject);
	displayOtherUsersMsg(messageObject.message,messageObject.username);
}

function onAddedToNewChannelReceived(channelObject) {
	console.log('New User has been added to channel ', channelObject.channel);
	populateChannels(channelObject.channel);
	displayWelcomeMessage({channel: channelObject.channel});
}

function onRemovedFromChannelReceived(data) {
	console.log('Channel Update ', data);
	removeChannel();
}

module.exports = {
	sendMessage,
	joinChannel,
	leaveChannel,
	onWelcomeMessageReceived,
	onNewMessageReceived,
	onAddedToNewChannelReceived,
	onRemovedFromChannelReceived
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution
