# UMF Message [![Build Status](https://travis-ci.org/flywheelsports/fwsp-umf-message.svg?branch=master)](https://travis-ci.org/flywheelsports/fwsp-umf-message)
Used to create and validate [UMF](https://github.com/cjus/umf) style messages.

## Install
You can install it via NPM:

```shell
$ npm -i fwsp-umf-message
```

## Usage

```javascript
const Utils = require('fwsp-umf-message');
let instanceID = 'fa1ae8d5-86fc-44af-aad8-cd2740aef041';
let msg = UMFMessage.createMessage({
  to: `${instanceID}@test-service:[GET]/v1/somedata`,
  from: 'client:/',
  body: {}
});
```

## Tests

Tests can be found in the `specs` folder.

```shell
$ npm test
```

## API

See: [API documentation](api.md)

### createMessageID - Returns a UUID for use with messages

```javascript
/**
  * @name createMessageID
  * @summary Returns a UUID for use with messages
  * @return {string} uuid - UUID
  */
  createMessageID()
```

### createShortMessageID - Returns a short form UUID for use with messages

```javascript
  /**
  * @name createShortMessageID
  * @summary Returns a short form UUID for use with messages
  * @return {string} uuid - UUID
  */
  createShortMessageID()
```

### createMessage - Create a UMF style message

```javascript
  /**
  * @name createMessage
  * @summary Create a UMF style message.
  * @description This is a helper function which helps format a UMF style message.
  *              The caller is responsible for ensuring that required fields such as
  *              "to", "from" and "body" are provided either before or after using
  *              this function.
  * @param {object} message - optional message overrides.
  * @param {boolean} shortFormat - optional flag to use UMF short form syntax.
  * @return {object} message - a UMF formatted message.
  */
  createMessage(message, shortFormat=false)
```

### createMessageShort - Create a short-format UMF message

```javascript
/**
* @name createMessageShort
* @summary createMessage with short fields
* @param {object} message - optional message overrides.
* @return {object} message - a UMF formatted short-form message.
*/
createMessageShort(message)
```

### toObject - get message as Object (no Proxy)

```javascript
/**
* @name toObject
* @param {object} message - message to be converted
* @return {object} unproxied message object
*/
toObject(message)
```

### toJSON - serialize message to JSON string

```javascript
/**
* @name toJSON
* @param {object} message - message to be converted
* @return {string} JSON version of message
*/
toJSON(message)
```

### toShort - convert a long message to a short one

```javascript
/**
* @name toShort
* @summary convert a long message to a short one
* @param {object} message - message to be converted
* @return {object} converted message
*/
toShort(message)
```

### toLong - convert a short message to a long one

```javascript
/**
* @name toLong
* @summary convert a short message to a long one
* @param {object} message - message to be converted
* @return {object} converted message
*/
toLong(message)
```

### validateMessage - Validates that a UMF message has required fields

```javascript
  /**
  * @name validateMessage
  * @summary Validates that a UMF message has required fields
  * @param {object} message - UMF formatted message
  * @return {boolean} response - returns true is valid otherwise false
  */
  validateMessage(message)
```

### getMessageBody - Return the body from a UMF message

```javascript
  /**
  * @name getMessageBody
  * @summary Return the body from a UMF message
  * @param {object} message - UMF message
  * @return {object} body - UMF message body
  */
  getMessageBody(message)
```

### parseRoute - parses message route strings

```javascript
  /**
   * @name parseRoute
   * @summary parses message route strings
   * @private
   * @param {string} toValue - string to be parsed
   * @return {object} object - containing route parameters. If the
   *                  object contains an error field then the route
   *                  isn't valid.
   */
  parseRoute(toValue)
```
