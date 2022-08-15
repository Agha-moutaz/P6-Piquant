const http = require('http');
const app = require('./app');

const normalizeport = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizeport(process.env.port || 3000);
app.set('port', port);

const errorHandler= error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const adresse = server.address();
    const bind =typeof address === 'string' ?'pipe ' + address : 'port: ' +port;
    switch (error.code) {
    case 'EACCES':
        console.error(bind +' is ready in use.');
        process.exit(1);
        break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error',  errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + sddress : 'port ' + port;
    console.log('listening on ' + bind)
});

server.listen(port);
