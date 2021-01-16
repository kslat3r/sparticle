export default async function makeRequest (url, opts) {
  return fetch(url, opts)
    .then(async response => {
      const json = await response.json();

      if (response.ok) {
        return json;
      } else {
        throw new Error(json.message);
      }
    });
};
