'use strict';

const moment = require('moment');
const uuid = require('uuid');
const Utils = require('fwsp-jsutils');

const UMF_VERSION = 'UMF/1.4.3';
const UMF_INVALID_MESSAGE = 'UMF message requires "to", "from" and "body" fields';

const shortToLong = {
  frm: 'from',
  ts: 'timestamp',
  ver: 'version',
  bdy: 'body'
}, longToShort = {
  from: 'frm',
  timestamp: 'ts',
  version: 'ver',
  body: 'bdy'
};

class UMFMessage {
  constructor() {
  }

  /**
  * @name _getTimeStamp
  * @summary retrieve an ISO 8601 timestamp
  * @private
  * @return {string} timestamp - ISO 8601 timestamp
  */
  _getTimeStamp() {
    return moment().toISOString();
  }

  /**
  * @name createMessageID
  * @summary Returns a UUID for use with messages
  * @return {string} uuid - UUID
  */
  createMessageID() {
    return uuid.v4();
  }

  /**
  * @name createShortMessageID
  * @summary Returns a short form UUID for use with messages
  * @return {string} uuid - UUID
  */
  createShortMessageID() {
    return Utils.shortID();
  }

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
  createMessage(message, shortFormat=false) {
    let msg;
    if (shortFormat === false) {
      msg = Object.assign({
        mid: this.createMessageID(),
        timestamp: this._getTimeStamp(),
        version: UMF_VERSION
      }, message || {});
    } else {
      msg = Object.assign({
        mid: this.createShortMessageID(),
        ts: this._getTimeStamp(),
        ver: UMF_VERSION
      }, message || {});
    }
    return new Proxy(msg, {
      get: (obj, name) => {
        if (shortFormat && name in longToShort) {
          return obj[longToShort[name]];
        } else if (!shortFormat && name in shortToLong) {
          return obj[shortToLong[name]];
        } else {
          return obj[name];
        }
      },
      set: (obj, prop, value) => {
        if (shortFormat && name in longToShort) {
          obj[longToShort[prop]] = value;
        } else if (!shortFormat && name in shortToLong) {
          obj[shortToLong[prop]] = value;
        } else {
          obj[name] = value;
        }
      }
    });
  }

  /**
  * @name messageToObject
  * @param {object} message - message to be converted
  * @return {object} unproxied message object
  */
  messageToObject(message) {
    let ret = {};
    Object.keys(message).forEach(k => ret[k] = message[k]);
    return ret;
  }

  /**
  * @name messageToJSON
  * @param {object} message - message to be converted
  * @return {string} JSON version of message
  */
  messageToJSON(message) {
    return Utils.safeJSONStringify(this.messageToObject(message));
  }

  /**
  * @name messageToShort
  * @summary convert a long message to a short one
  * @param {object} message - message to be converted
  * @return {object} converted message
  */
  messageToShort(message) {
    let convertedMessage = {};
    (message.to) && (convertedMessage.to = message.to);
    (message.from) && (convertedMessage.frm = message.from);
    (message.mid) && (convertedMessage.mid = message.mid);
    (message.rmid) && (convertedMessage.rmid = message.rmid);
    (message.timestamp) && (convertedMessage.ts = message.timestamp);
    (message.version) && (convertedMessage.ver = message.version);
    (message.via) && (convertedMessage.via = message.via);
    (message['for']) && (convertedMessage['for'] = message['for']);
    (message.body) && (convertedMessage.bdy = message.body);
    return convertedMessage;
  }

  /**
  * @name messageToLong
  * @summary convert a short message to a long one
  * @param {object} message - message to be converted
  * @return {object} converted message
  */
  messageToLong(message) {
    let convertedMessage = {};
    (message.to) && (convertedMessage.to = message.to);
    (message.frm) && (convertedMessage.from = message.frm);
    (message.mid) && (convertedMessage.mid = message.mid);
    (message.rmid) && (convertedMessage.rmid = message.rmid);
    (message.ts) && (convertedMessage.timestamp = message.ts);
    (message.ver) && (convertedMessage.version = message.ver);
    (message.via) && (convertedMessage.via = message.via);
    (message['for']) && (convertedMessage['for'] = message['for']);
    (message.bdy) && (convertedMessage.body = message.bdy);
    return convertedMessage;
  }

  /**
  * @name validateMessage
  * @summary Validates that a UMF message has required fields
  * @param {object} message - UMF formatted message
  * @return {boolean} response - returns true is valid otherwise false
  */
  validateMessage(message) {
    if ((!message.from && !message.frm) || !message.to || (!message.body && !message.bdy)) {
      return false;
    } else {
      return true;
    }
  }

  /**
  * @name getMessageBody
  * @summary Return the body from a UMF message
  * @param {object} message - UMF message
  * @return {object} body - UMF message body
  */
  getMessageBody(message) {
    return Object.assign({}, message.body);
  }

  /**
   * @name parseRoute
   * @summary parses message route strings
   * @private
   * @param {string} toValue - string to be parsed
   * @return {object} object - containing route parameters. If the
   *                  object contains an error field then the route
   *                  isn't valid.
   */
  parseRoute(toValue) {
    let serviceName = '';
    let httpMethod;
    let apiRoute = '';
    let error;
    let urlRoute = toValue;
    let instance = '';
    let subID = '';

    let atPos = urlRoute.indexOf('@');
    if (atPos > -1) {
      instance = urlRoute.substring(0, atPos);
      urlRoute = urlRoute.substring(atPos + 1);
      let segments = instance.split('-');
      if (segments.length > 0) {
        instance = segments[0];
        subID = segments[1];
      }
    }
    let segments = urlRoute.split(':');
    if (segments.length < 1) {
      error = 'route field has invalid number of routable segments';
    } else {
      if (segments[0].indexOf('http') === 0) {
        let url = `${segments[0]}:${segments[1]}`;
        segments.shift();
        segments[0] = url;
      }
      serviceName = segments[0];
      segments.shift();
      apiRoute = segments.join(':');
      let s1 = apiRoute.indexOf('[');
      if (s1 === 0) {
        let s2 = apiRoute.indexOf(']');
        if (s2 < 0) {
          error = 'route field has ill-formed HTTP method verb in segment';
        } else {
          httpMethod = apiRoute.substring(s1 + 1, s2).toLowerCase();
        }
        if (!error) {
          let s3 = httpMethod.length;
          if (s3 > 0) {
            apiRoute = apiRoute.substring(s3 + 2, apiRoute.length);
          }
        }
      }
    }
    return {
      instance,
      subID,
      serviceName,
      httpMethod,
      apiRoute,
      error
    };
  }
}

module.exports = new UMFMessage();
