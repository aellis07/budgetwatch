// Created new DB
let db;
const request = indexedDB.open("budget", 1);

// Create new Object Store
request.onupgradeneeded = (event) => {
  event.target.result.createObjectStore("pending", {
    // ID for offline db data
    keyPath: "id",
    autoIncrement: true,
  });
};

// Checks to see if app is online
request.onsuccess = (event) => {
  db = event.target.result;

  // If online check db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = (err) => {
  console.log(err.message);
};

// saveRecord(); is called in index.js
// Takes offline transactions and saves it to the budget DB
// Takes offline transactions and list them in a pending Object Store
function saveRecord(record) {
  const transaction = db.transaction("pending", "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
}

// Called when user goes online to send transactions stored in db to server
// When user comes back online
function checkDatabase() {
  const transaction = db.transaction("pending", "readonly");
  const store = transaction.objectStore("pending");

  // Get all offline transactions from Object Store
  const getAll = store.getAll();

  // On successful retrival of offline data (offline-transaction array > 0)
  // POST data in bulk
  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // Clear object store after successful POST
          const transaction = db.transaction("pending", "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}

// Listens for the browser window to go back online,
// If online run checkDatabase();
window.addEventListener("online", checkDatabase);
