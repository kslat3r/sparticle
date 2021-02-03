import makeRequest from './makeRequest';

let permitted = true;

export default async function makeThrottledRequest (url, opts, timeout) {
  if (permitted === true) {
    permitted = false;

    setTimeout(() => {
      permitted = true
    }, timeout);

    return makeRequest(url, opts);
  }
};
