export default async function makeRequest (url, opts) {
  return fetch(url, opts)
    .then(async response => {
      let body = await response.clone().text();

      if (body) {
        body = await response.clone().json();
      }

      if (response.ok) {
        return body;
      } else {
        throw new Error(body.message);
      }
    });
};
