const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware for parsing cookies
app.use(cookieParser());;

// Route for displaying login form
app.get('/login', (req, res) => {
  res.send(`
    <h1>Login Form</h1>
    <form method="POST" action="/login">
      <input type="text" name="username" placeholder="Enter your username" />
      <button type="submit">Login</button>
    </form>
  `);
});

// Route for processing login form data
app.post('/login', (req, res) => {
  const { username } = req.body;
  // Store the username in the browser's local storage
  res.setHeader('Set-Cookie', `username=${username}`);
  res.redirect('/');
});

// Route for displaying message form
app.get('/', (req, res) => {
  res.send(`
    <h1>chat app</h1>
    <form method="POST" action="/message">
      <input type="text" name="message" placeholder="Enter your message" />
      <button type="submit">Send</button>
    </form>
  `);
});

// Route for processing message form data
app.post('/message', (req, res) => {
  const { message } = req.body;
  const username = req.cookies.username;
  console.log(req.cookies); // log the cookies to check if they are parsed correctly
  if (!username) {
    res.send('Please log in to send a message');
    return;
  }
  // Write the message to the file with the username as the key
  const data = `${username}: ${message}\n`;
  fs.appendFile('message.txt', data, err => {
    if (err) {
      console.error(err);
      res.send('Error writing message to file');
    } else {
      res.send('Message sent successfully');
    }
  });
});

// Route for displaying messages
app.get('/messages', (req, res) => {
  const messages = [];
  // Read the messages from the file
  fs.readFile('message.txt', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.send('Error reading messages from file');
    } else {
      // Parse the data and split it into separate messages
      const messageArray = data.trim().split('\n');
      messageArray.forEach(message => {
        const [username, messageText] = message.split(':');
        messages.push({ username, message: messageText.trim() });
      });
      // Display the messages
      res.send(`
        <h1>Messages</h1>
        <ul>
          ${messages.map(m => `<li>${m.username}: ${m.message}</li>`).join('')}
        </ul>
      `);
    }
  });
});

app.listen(2000, () => console.log('Server started on port 2000'));

