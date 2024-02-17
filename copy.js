console.log("Copy.js loaded");

document.addEventListener("click", function (e) {
  // Check if the clicked element is a mailto link
  if (e.target.tagName === "A" && e.target.href.startsWith("mailto:")) {
    e.preventDefault(); // Prevent the default mail app from opening

    // Extract the email address
    const emailAddress = e.target.href.replace("mailto:", "");

    // Copy email address to clipboard
    navigator.clipboard
      .writeText(emailAddress)
      .then(() => {
        showToast(`Copied ${emailAddress} to clipboard`);

        const storage = getStorage();

        if (!storage) {
          console.warn("Storage API not available.");
          return;
        }

        storage.get("emails", []).then(function (result) {
          const emails = result && result.emails ? result.emails : [];

          const emailList = emails.filter((email) => email !== emailAddress);

          const updatedEmails = [emailAddress, ...emailList];

          console.log("Updated emails:", updatedEmails);
          storage.set("emails", updatedEmails).then(function () {
            console.log("Email address saved and synced:", emailAddress);
          });
        });
      })
      .catch((err) => {
        console.error("Error copying email address to clipboard:", err);
      });

    return false;
  }
});

function showToast(message) {
  // Create the toast container
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.padding = "10px 20px";
  toast.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  toast.style.color = "#fff";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = "2147483647";
  toast.style.fontSize = "16px";
  toast.style.opacity = "0"; // Start fully transparent
  toast.style.transition = "opacity 0.5s ease-in-out"; // Transition for opacity change
  toast.innerText = message;

  // Append the toast to the body
  document.body.appendChild(toast);

  // Fade in the toast
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 10); // Small delay to ensure the transition runs

  // Remove the toast after 5 seconds with fade-out effect
  setTimeout(() => {
    toast.style.opacity = "0";
    // Wait for fade-out to finish before removing the element
    setTimeout(() => {
      toast.remove();
    }, 500); // Match the duration of the opacity transition
  }, 4500); // Adjusted time to account for fade-out duration
}

function getStorage() {
  return new Storage();
}

class Storage {
  async get(key, defaultValue = null) {
    if (window.browser && window.browser.storage) {
      const result = await (
        browser.storage.managed || browser.storage.local
      ).get(key);

      return result[key] || defaultValue;
    } else if (chrome && chrome.storage) {
      const obj = { [key]: defaultValue };

      return new Promise((resolve) => {
        chrome.storage.sync.get(obj, function (result) {
          resolve(result);
        });
      });
    }
  }

  set(key, value) {
    if (window.browser && window.browser.storage) {
      return (browser.storage.managed || browser.storage.local).set({
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
