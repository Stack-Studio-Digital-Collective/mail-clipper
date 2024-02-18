document.addEventListener("DOMContentLoaded", function () {
  const storage = getStorage();
  const emailList = document.getElementById("emailList");

  let emails = []; // To store fetched emails
  let isExpanded = false; // Track if the list is expanded

  if (!storage) {
    console.warn("Storage API not available.");

    const message = document.createElement("p");

    message.textContent = "Storage API not available.";

    emailList.appendChild(message);

    return;
  }

  storage.get("emails", []).then(function (result) {
    // Firefox returns undefined if the key doesn't exist
    if (!result || !result.emails) {
      emails = [];
    } else {
      emails = result.emails;
    }

    displayEmails();
  });

  document.getElementById("searchBox").addEventListener("input", function () {
    displayEmails(this.value);
  });

  function displayEmails(filter = "") {
    emailList.innerHTML = ""; // Clear current list
    const filteredEmails = emails.filter((email) =>
      email.toLowerCase().includes(filter.toLowerCase())
    );

    const emailsToShow = isExpanded
      ? filteredEmails
      : filteredEmails.slice(0, 5);

    if (emailsToShow.length === 0) {
      const noEmailsItem = document.createElement("li");
      noEmailsItem.textContent = "No saved emails.";
      emailList.appendChild(noEmailsItem);
    } else {
      emailsToShow.forEach((email) => {
        const listItem = createListItem(email);
        emailList.appendChild(listItem);
      });

      if (filteredEmails.length > 5) {
        const toggleButton = document.createElement("button");
        toggleButton.classList.add("page-button");
        toggleButton.textContent = isExpanded ? "Show Less" : "Show More";
        toggleButton.addEventListener("click", function () {
          isExpanded = !isExpanded;
          displayEmails(filter);
        });
        emailList.appendChild(toggleButton);
      }
    }
  }

  function createListItem(email) {
    const listItem = document.createElement("li");
    listItem.style.cursor = "pointer";
    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.alignItems = "center";

    const emailContainer = document.createElement("span");
    emailContainer.textContent = email;
    listItem.appendChild(emailContainer);

    listItem.addEventListener("click", function () {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          const checkMark = document.createElement("span");
          checkMark.textContent = " ✅";
          emailContainer.appendChild(checkMark);

          setTimeout(() => {
            checkMark.remove();
          }, 2500);
        })
        .catch((err) => {
          console.error("Failed to copy email:", err);
        });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "deleteBtn";
    deleteBtn.onclick = function (event) {
      event.stopPropagation();
      emails = emails.filter((e) => e !== email);
      const storage = getStorage();

      if (!storage) {
        console.warn("Storage API not available.");
        return;
      }

      storage.set("emails", emails).then(() => displayEmails());
    };

    listItem.appendChild(deleteBtn);

    return listItem;
  }
});

/**
 * Get the storage instance
 * @returns {Storage|undefined} Storage instance
 */
function getStorage() {
  if (
    (window.browser && window.browser.storage) ||
    (chrome && chrome.storage)
  ) {
    return new Storage();
  }
}

/**
 * Storage class to interact with the browser's storage API
 */
class Storage {
  /**
   * Get value from storage
   * @param {string} key Value to get from storage
   * @param {any} defaultValue Default value to return if key is not found
   * @returns {Promise<{[key: string]: any}>} Promise that resolves with the value from storage
   */
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

  /**
   * Set value in storage
   * @param {string} key The key to set in storage
   * @param {any} value The value to set in storage
   * @returns {Promise<void>} Promise that resolves when the value is set in storage
   */
  set(key, value) {
    if (window.browser && window.browser.storage) {
      return (browser.storage.sync || browser.storage.local).set({
        [key]: value,
      });
    } else if (chrome && chrome.storage) {
      const obj = { [key]: value };

      return new Promise((resolve) => {
        chrome.storage.sync.set(obj, resolve);
      });
    }
  }
}
