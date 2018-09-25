// global test expect describe
import { isValidInput, isValidURL } from './validateUserInput';

describe('isValidInput', () => {
  test('null returns false', () => {
    expect(isValidInput(null)).toBe(false);
  });

  test('empty string "" returns false', () => {
    expect(isValidInput('')).toBe(false);
  });

  test('input of length >0 returns true', () => {
    expect(isValidInput('test')).toBe(true);
  });

  test('input of undefined returns false', () => {
    expect(isValidInput(undefined)).toBe(false);
  });

  test('input of a number returns false', () => {
    expect(isValidInput(5)).toBe(false);
  });

  test('input of a boolean returns false', () => {
    expect(isValidInput(true)).toBe(false);
  });
});

describe('isValidURL', () => {
  test('null returns false', () => {
    expect(isValidURL(null)).toBe(false);
  });

  test('empty string "" returns false', () => {
    expect(isValidURL('')).toBe(false);
  });

  test('input of length >0 but not url returns false', () => {
    expect(isValidURL('test')).toBe(false);
  });

  test('input of undefined returns false', () => {
    expect(isValidURL(undefined)).toBe(false);
  });

  test('input of a number returns false', () => {
    expect(isValidURL(5)).toBe(false);
  });

  test('input of a boolean returns false', () => {
    expect(isValidURL(true)).toBe(false);
  });

  test('input of a url returns true', () => {
    expect(isValidURL('https://www.a.com')).toBe(true);
  });
  test('input of a url without a protocol (http://) returns true', () => {
    expect(isValidURL('www.a.com')).toBe(true);
  });
  test('input of a url with no sub domain (www.) returns true', () => {
    expect(isValidURL('a.com')).toBe(true);
  });
});
