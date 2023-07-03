import { IncomingMessage, ServerResponse ,createServer, request } from "http";
import { v4 as uuidv4, validate} from "uuid";

import { PORT } from './constants/constants.ts'
import { USER_ROUT } from './constants/routes.ts'

import type { User } from './types/user.ts'


const server = createServer();

server.listen(PORT);

enum REQUEST_METHODS {
  GET = "GET",
  POST = "POST",
  UPDATE = "UPDATE"
}

const db: User[] = [];

enum STATUS_CODES {
  OK = 200,
  CREATED = 201,
  INVALID_DATA = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

const getUserListData = () => db;

const getUser = (id: string) => db.find((user) => id === user.id)


const getUserList = (response: ServerResponse) => {
  const userList = getUserListData()

  response.writeHead(STATUS_CODES.OK, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(userList))
}

const getBody = <T>(request: IncomingMessage): Promise<T> =>  {
  return new Promise((resolve) => {
    const data: string[] = [];

    request
      .on('data', (chunk: Uint8Array) => data.push(chunk.toString()))
      .on('end', () => {
        resolve(JSON.parse(data.join('')) as T)
      });
  });
}

const getUserById = (id: string | undefined, response: ServerResponse) => {
  if (!id) return false; //refactor

  const user = getUser(id)

  if (!user)  {
    response.writeHead(STATUS_CODES.NOT_FOUND, { 'Content-Type': 'application/json' })
    response.end('User not found.')
  } else {
    response.writeHead(STATUS_CODES.OK, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(user))
  }
}


const handleGetUser = (request: IncomingMessage, response: ServerResponse) => {
  // console.log(request.url, USER_ROUT)
  console.log('get')
  if  (request.url === USER_ROUT) {
   getUserList(response)
  } else {
    const id = request.url?.split('/')[3] // refactor
    getUserById(id, response)
  }
}

// const UserSchema = {
//   username: {
//     type: 'string',
//     required: true,
//   },
//   age: {
//     type: 'number',
//     required: true,
//   },
//   hobbies: {
//     type: 'array',
//     required: true,
//     items: {
//       type: 'string',
//     }
//   }
// }

// const validatePrimitiveTypeProperty = (sourceProperty: unknown, schemaData: {type: string, required?: boolean}): boolean => {
//   if (!!sourceProperty && schemaData.required) return false;
  
//   const isPropertyTypeValid = typeof sourceProperty === schemaData.type;

//   return isPropertyTypeValid
// }

// const validateArrayTypeProperty = (sourceProperty: unknown, schemaData: {type: string, required?: boolean}): boolean => {
//   if (!!sourceProperty && schemaData.required) return false;  

//   if (typeof sourceProperty === 'array') {
//     return sourceProperty.every((item) => validatePrimitiveTypeProperty(item, schemaData.item))
//   } else {
//     return false
//   }
// }

// const validateBody = <T extends Object>(body: unknown, schema: T): boolean => {
//   if(!body) return false;

//   const schemaProperties = Object.keys(schema);

//   const result = schemaProperties.reduce((res, property) => {
//     if (!res) return false;

//     if (schema[property].type === 'array') {
//       return validateArrayTypeProperty()
//     }

//     return validatePrimitiveTypeProperty(body[property], schema[property])
//   }, true)

//   return result
// }

const validateUserData = (data: User): boolean => {
  if (!data) return false;

  const isUsernameValid = typeof data.username === 'string';
  const isAgeValid = typeof data.age === 'number'
  const isHobbiesValid = Array.isArray(data?.hobbies) && data.hobbies.every(item => typeof item === 'string')

  return isUsernameValid && isAgeValid && isHobbiesValid;
}

const handlePostUser = async (request: IncomingMessage, response: ServerResponse) => {
  const body = await getBody<User>(request);
  // console.log(body, typeof body, JSON.parse(body as string))
  const isBodyValid = validateUserData(body)


  if (!isBodyValid) {
    console.log('not valid', body)
    response.writeHead(STATUS_CODES.INVALID_DATA, { 'Content-Type': 'application/json' })
    response.end('User data is not valid.')
  } else {
    const newUser: User = { id: uuidv4(), ...body }
    db.push(newUser)
    response.writeHead(STATUS_CODES.CREATED, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(newUser))
  } 
}

const userRouter = (request: IncomingMessage, response: ServerResponse) => {
  switch(request.method) {
    case REQUEST_METHODS.GET:
      handleGetUser(request, response);
      break;
    case REQUEST_METHODS.POST:
      handlePostUser(request, response)
      break;
    // case REQ
  }
}

const handleRequest = (request: IncomingMessage, response: ServerResponse) => {
  if (!request.url?.startsWith(USER_ROUT)) {
    // response.statusCode(404)
    //  console.log('here')
    response.writeHead(STATUS_CODES.NOT_FOUND, { 'Content-Type': 'application/json' })
    response.end('Rout does not exist')
  } else {
    userRouter(request, response)
  }

}


server.on('request', (request, res) => {
  // console.log(request.url, request.method)
  // console.log(STATUS_CODES['404'])
  handleRequest(request, res)
  

});