import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { createType, typelit } from './typelit';

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2006-01-02T15:04:05.000+07:00'));
});

afterAll(() => {
  vi.useRealTimers();
});

describe('typelit template function', () => {
  it('should return the empty string', () => {
    const template = typelit``;
    expect(template({})).toBe('');
  });
  it('should return the same string for no template variables', () => {
    const template = typelit`Hello World!`;
    expect(template({})).toBe('Hello World!');
  });
  it('should interpolate string with a named param', () => {
    const template = typelit`Hello ${typelit.string('name')}!`;
    expect(template({ name: 'World' })).toBe('Hello World!');
  });
  it('should interpolate the string with multiple named params', () => {
    const template = typelit`Hello ${typelit.string('firstName')} ${typelit.string('lastName')}!`;
    expect(template({ firstName: 'Barbès', lastName: 'Rochechouart' })).toBe(
      'Hello Barbès Rochechouart!',
    );
  });
  it('should interpolate the string with multiple types', () => {
    const template = typelit`${typelit.string('name')} is ${typelit.number('age')} years old`;
    expect(template({ name: 'Toto', age: 23 })).toBe('Toto is 23 years old');
  });
  it('should interpolate the string with nested params', () => {
    const template = typelit`Hello ${typelit.string('user', 'name')}!`;
    expect(template({ user: { name: 'World' } })).toBe('Hello World!');
  });
  it('should merge deeply nested params', () => {
    const template = typelit`Hi ${typelit.string('session', 'user', 'name')}, you are ${typelit.number('session', 'user', 'age')}. Your session token is ${typelit.string('session', 'token')}.`;
    expect(
      template({
        session: {
          user: {
            name: 'Toto',
            age: 23,
          },
          token: 'asdgfhjkasdgfjk',
        },
      }),
    ).toBe('Hi Toto, you are 23. Your session token is asdgfhjkasdgfjk.');
  });
});

describe('typelit variable types', () => {
  it('boolean', () => {
    const template = typelit`${typelit.boolean('hello')}`;
    expect(template({ hello: true })).toBe('true');
    expect(template({ hello: false })).toBe('false');
  });
  it('string', () => {
    const template = typelit`${typelit.string('hello')}`;
    expect(template({ hello: '' })).toBe('');
    expect(template({ hello: 'world' })).toBe('world');
  });
  it('number', () => {
    const template = typelit`${typelit.number('hello')}`;
    expect(template({ hello: 0 })).toBe('0');
    expect(template({ hello: 1138 })).toBe('1138');
    expect(template({ hello: -1 })).toBe('-1');
    expect(template({ hello: Math.PI })).toBe(Math.PI.toString());
  });
  it('bigint', () => {
    const template = typelit`${typelit.bigint('hello')}`;
    expect(template({ hello: 9007199254740991n })).toBe('9007199254740991');
  });
  it('date', () => {
    const template = typelit`${typelit.date('date')}`;
    expect(template({ date: new Date() })).toBe(
      'Mon Jan 02 2006 08:04:05 GMT+0000 (Greenwich Mean Time)',
    );
  });
  it('object', () => {
    const template = typelit`${typelit.json('hello')}`;
    expect(template({ hello: { user: { name: 'Toto', age: 23 } } })).toBe(`{
  "user": {
    "name": "Toto",
    "age": 23
  }
}`);
  });
});

describe('createType', () => {
  it('basic usage', () => {
    const typelitRegExp = createType<RegExp>();
    const template = typelit`${typelitRegExp('pattern')}`;
    expect(template({ pattern: /['"](.*?)['"]/g })).toBe('/[\'"](.*?)[\'"]/g');
  });
  it('with stringify', () => {
    const typelitDate = createType<Date>({ stringify: (d) => d.toISOString() });
    const template = typelit`${typelitDate('date')}`;
    expect(template({ date: new Date() })).toBe('2006-01-02T08:04:05.000Z');
  });
});
