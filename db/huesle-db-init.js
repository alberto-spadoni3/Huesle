const mongo = new Mongo();
const db = mongo.getDB("huesle");

// Elimino gli eventuali documenti della collection
try {
    db.users.deleteMany({});
} catch (error) {
    print(error);
}

// Inserisco l'utente Bob
const bob = {
    email: "bob@huesle.com",
    username: "Bob",
    password: "$2b$10$UHI9mWU.sLOJJpvh.PdwROwxWO5.qIcHrmvH4yoG9RDerCl9mYhiu",
    profilePicID: 1,
    darkMode: true,
    colorblindMode: false,
};
db.users.insert(bob);

// Inserisco l'utente Alice
const alice = {
    email: "alice@huesle.com",
    username: "Alice",
    password: "$2b$10$Z9FOxGxkW5IhY/V8oOcbi.RoXWmTm3DluUUsxIFnvWYt5MIzMi50q",
    profilePicID: 3,
    darkMode: false,
    colorblindMode: true,
};
db.users.insert(alice);

print("DB initialized correctly");
