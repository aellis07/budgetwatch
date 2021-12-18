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
