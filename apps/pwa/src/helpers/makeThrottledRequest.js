import makeRequest from './makeRequest';

let permitted = true;

export default async function makeThrottledRequest (url, opts) {
  if (permitted === true) {
    permitted = false;

    setTimeout(() => {
      permitted = true
    }, 10000);

    return makeRequest(url, opts);
  }
};
