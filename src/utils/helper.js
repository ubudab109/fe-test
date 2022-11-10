/* eslint-disable consistent-return */

import axios from "axios";

/**
 * Set localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  let value;
  if (typeof content !== 'string') {
    value = JSON.stringify(content)
  } else {
    value = content;
  }
  return window.localStorage.setItem(name, value)
}

/**
 * Get localStorage
 */
export const getStore = (name) => {
  if (!name) return
  return localStorage.getItem(name)
}

/**
 * Clear localStorage
 */
export const removeItem = (name) => {
  if (!name) return
  return window.localStorage.removeItem(name)
}

/**
 * Clearr All Storage
 */
export const clearAllItem = () => window.localStorage.clear()

/**
 * Validate Email address
 */
export const isValidEmail = (value) => !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value));

/**
 * It checks if the user has a token in local storage, if they do, it sends a request to the server to
 * validate the token, if the token is valid, it returns true, if the token is invalid, it returns
 * false.
 * @returns A promise.
 */
export const validateToken = async () => {
  let authorized;
  if (getStore('web-token')) {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/validate-token`, null, {
      headers: {
        'Authorization': getStore('web-token'),
      }
    }).then(() => {
      authorized = true;
    }).catch(() => {
      authorized = false;
    });
  }
  return authorized;
}

/**
 * It returns true if the input contains at least two uppercase letters, at least three lowercase
 * letters, at least two numbers, and at least one special character
 * @param input - The password to be validated.
 * @returns A function that takes an input and returns true if the input matches the regex, false
 * otherwise.
 */
export const strongPassword = (input) => {
  const validRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  if (validRegex.test(input)) {
    return true;
  }
  return false;
}

/**
 * If the number is less than 10, add a 0 to the beginning of it.
 * @param num - The number to pad.
 */
export const padTo2Digits = (num) => num.toString().padStart(2, '0')

/**
 * It takes a date object and returns a string in the format of YYYY-MM-DD HH:MM:SS.
 * @param date - The date to format.
 */
export const formatDate = (date) => (
    `${[
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('/') 
    } ${ 
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')}`
);