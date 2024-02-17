document.addEventListener("DOMContentLoaded", function () {
  const emailList = document.getElementById("emailList");
  let emails = []; // To store fetched emails
  let isExpanded = false; // Track if the list is expanded

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
      chrome.storage.sync.set({ emails: emails }, () => displayEmails());
    };

    listItem.appendChild(deleteBtn);

    return listItem;
  }

  chrome.storage.sync.get({ emails: [] }, function (result) {
    emails = result.emails.reverse(); // Reverse to show most recent first
    displayEmails();
  });

  document.getElementById("searchBox").addEventListener("input", function () {
    displayEmails(this.value);
  });
});
