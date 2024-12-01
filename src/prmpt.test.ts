import { describe, expect, it } from 'vitest';

import { prmpt } from './prmpt';

describe('prmpt template function', () => {
  it('should return the empty string', () => {
    const template = prmpt``;
    expect(template({})).toBe('');
  });
  it('should return the same string for no template variables', () => {
    const template = prmpt`Hello World!`;
    expect(template({})).toBe('Hello World!');
  });
  it('should interpolate string with a named param', () => {
    const template = prmpt`Hello ${prmpt.string('name')}!`;
    expect(template({ name: 'World' })).toBe('Hello World!');
  });
  it('should interpolate the string with multiple named params', () => {
    const template = prmpt`Hello ${prmpt.string('firstName')} ${prmpt.string('lastName')}!`;
    expect(template({ firstName: 'Barbès', lastName: 'Rochechouart' })).toBe(
      'Hello Barbès Rochechouart!',
    );
  });
  it('should interpolate the string with multiple types', () => {
    const template = prmpt`${prmpt.string('name')} is ${prmpt.number('age')} years old`;
    expect(template({ name: 'Toto', age: 23 })).toBe('Toto is 23 years old');
  });
  it('should interpolate the string with nested params', () => {
    const template = prmpt`Hello ${prmpt.string('user', 'name')}!`;
    expect(template({ user: { name: 'World' } })).toBe('Hello World!');
  });
  it('should merge deeply nested params', () => {
    const template = prmpt`Hi ${prmpt.string('session', 'user', 'name')}, you are ${prmpt.number('session', 'user', 'age')}. Your session token is ${prmpt.string('session', 'token')}.`;
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

describe('prmpt variable types', () => {
  it('boolean', () => {
    const template = prmpt`${prmpt.boolean('hello')}`;
    expect(template({ hello: true })).toBe('true');
    expect(template({ hello: false })).toBe('false');
  });
  it('string', () => {
    const template = prmpt`${prmpt.string('hello')}`;
    expect(template({ hello: '' })).toBe('');
    expect(template({ hello: 'world' })).toBe('world');
  });
  it('number', () => {
    const template = prmpt`${prmpt.number('hello')}`;
    expect(template({ hello: 0 })).toBe('0');
    expect(template({ hello: 1138 })).toBe('1138');
    expect(template({ hello: -1 })).toBe('-1');
    expect(template({ hello: Math.PI })).toBe(Math.PI.toString());
  });
  it('bigint', () => {
    const template = prmpt`${prmpt.bigint('hello')}`;
    expect(template({ hello: BigInt(9007199254740991) }));
  });
});
