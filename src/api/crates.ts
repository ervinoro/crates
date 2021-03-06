/**
 * Holds important api calls for the crates.io.
 */
import { get } from "request-promise";

const API = "https://crates.io/api/v1";

const data: any = {};

function cache(key: string, func: any, url: string) {
  if (!data[key] || data[key].isRejected()) {
    console.log("Fetching dependency: ", key);
    data[key] = func(url, {
      headers: {
        "User-Agent": "VSCode.Crates (https://marketplace.visualstudio.com/items?itemName=serayuzgur.crates)",
      },
    })
      .then((response: string) => {
        try {
          return JSON.parse(response);
        } catch (e) {
          console.error(key, e);
          return {};
        }
      })
      .catch((resp: any) => {
        throw resp;
      });
  }
  return data[key];
}

export const versions = (name: string) =>
  cache(name, get, `${API}/crates/${name}/versions`);
