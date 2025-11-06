import { typelit } from './src/typelit';

// This is the EXACT code from the failing test
const template = typelit`Hi ${typelit.string('session', 'user', 'name')}, you are ${typelit.number('session', 'user', 'age')}. Your session token is ${typelit.string('session', 'token')}.`;

// Try to call it
const result = template({
  session: {
    user: {
      name: 'Toto',
      age: 23,
    },
    token: 'asdgfhjkasdgfjk',
  },
});

export { result };
