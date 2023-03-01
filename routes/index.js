const BlockingRouter = require('./blocking/blocking');

function route(app) {
    app.use('/api/blocking', BlockingRouter);
}

module.exports = route;