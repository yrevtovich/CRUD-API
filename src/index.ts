import { createServer } from "http";

import { PORT } from './constants/constants.ts'


const server = createServer();

server.listen(PORT)


server.on('request', (request, res) => {
  console.log(request.url, res)
});