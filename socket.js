const http = require('http');
const fs = require('fs');
const path = require('path');
var mime = require('mime');

const express = require('express');
const socketIO = require('socket.io');
const app = express();

const { spawn } = require('child_process');

const server = http.createServer((req, res) => {

    if (req.url === '/') {

        fs.readFile('index.html', 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else {

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New client connected.');

    socket.on('runCommand', () => {
        console.log('Running command');

        const scriptPath = 'server.js';
        const args = ['--srv', 'http'];

        const childProcess = spawn('node', [scriptPath, ...args]);
        childProcess.stdout.on('data', data => {
          console.log(`Child process stdout: ${data}`);
        });

        childProcess.stderr.on('data', data => {
          console.error(`Child process stderr: ${data}`);
        });

        childProcess.on('close', code => {
          console.log(`Child process exited with code ${code}`);
        });

        socket.emit('commandRunning');

        socket.on('stopCommand', () => {

          childProcess.kill();

          socket.emit('commandStopped');
        });
      });
      socket.on('runhijack', () => {
        console.log('Running command');

        const scriptPath = 'server.js';
        const args = ['--srv', 'hijack'];

        const childProcess = spawn('node', [scriptPath, ...args]);

childProcess.stdout.on('data', data => {
  console.log(`Child process stdout: ${data}`);
});

childProcess.stderr.on('data', data => {
  console.error(`Child process stderr: ${data}`);
});

childProcess.on('close', code => {
  console.log(`Child process exited with code ${code}`);
});
        console.log('node '+scriptPath);

        socket.emit('commandRunning');

        socket.on('stopCommand', () => {

          childProcess.kill();

          socket.emit('commandStopped');
        });
      });

      socket.on('runspeedtest', () => {
        console.log('Running command');

        const scriptPath = 'server.js';
        const args = ['--srv', 'http'];

        const childProcess = spawn('node', [scriptPath, ...args]);
        childProcess.stdout.on('data', data => {
          console.log(`Child process stdout: ${data}`);
        });

        childProcess.stderr.on('data', data => {
          console.error(`Child process stderr: ${data}`);
        });

        childProcess.on('close', code => {
          console.log(`Child process exited with code ${code}`);
        });
        socket.on('stopCommand', () => {

          childProcess.kill();

          socket.emit('commandStopped');
        });
        socket.emit('commandRunning');

      });
    socket.on('login', () => {
        const scriptPath = 'login.js';

        const childProcess = spawn('node', [scriptPath]);

    });
    socket.on('off', () => {
        const childProcess = spawn('node', ['server.js']);

        childProcess.kill();

    });

    socket.on('log', (message) => {
        console.log(`Received log: ${message}`);

        io.emit('log', message);
    });

     socket.on('loghijack', (message) => {
        console.log(`Received log: ${message}`);

        io.emit('loghijack', message);
    });
    socket.on('logspeedtest', (message) => {
        console.log(`Received log: ${message}`);

        io.emit('logspeedtest', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected.');
    });
});

server.listen(3000, () => {
    console.log('Socket.IO server started on http://localhost:3000');
});