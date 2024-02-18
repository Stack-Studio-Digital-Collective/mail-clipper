export default function getStorage() {
  return new Storage();
}

class Storage {
  async get(key, defaultValue = null) {
    if (window.browser && window.browser.storage) {
      const result = await (browser.storage.sync || browser.storage.local).get(
        key
      );

      return result || { [key]: defaultValue };
    } else if (chrome && chrome.storage) {
      const obj = { [key]: defaultValue };

      return new Promise((resolve) => {
        chrome.storage.sync.get(obj, function (result) {
          resolve(result);
        });
      });
    }
  }

  async set(key, value) {
    const obj = { [key]: value };

    if (window.browser && window.browser.storage) {
      return (browser.storage.sync || browser.storage.local).set(obj);
    } else if (chrome && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.sync.set(obj, resolve);
      });
    }
  }
}
