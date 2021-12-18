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
