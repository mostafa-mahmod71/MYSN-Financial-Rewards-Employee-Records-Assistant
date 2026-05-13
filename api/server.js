const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('api/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
// لإعادة توجيه المسارات البرمجية بشكل صحيح
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));
server.use(router);

module.exports = server;
