class Database {
  constructor() {
    this.data = new Map();
    this.transactions = [];
    // Stack of transaction changes instead of a new map
  }

  begin() {
    this.transactions.push(new Map());
    return true;
  }

  commit() {
    if (this.transactions.length === 0) {
      return false;
    }

    while (this.transactions.length > 0) {
      const transaction = this.transactions.pop();

      for (const [key, value] of transaction.entries()) {
        if (value === null) {
          this.data.delete(key);
        } else {
          this.data.set(key, value);
        }
      }
    }

    return true;
  }

  rollback() {
    if (this.transactions.length === 0) {
      return false;
    }

    this.transactions.pop();
    return true;
  }

  get(key) {
    for (let i = this.transactions.length - 1; i >= 0; i--) {
      const transaction = this.transactions[i];

      if (transaction.has(key)) {
        const value = transaction.get(key);

        if (value === null) {
          return null;
        }

        return value;
      }
    }

    if (this.data.has(key)) {
      return this.data.get(key);
    }

    return null;
  }

  set(key, value) {
    if (this.transactions.length > 0) {
      this.transactions[this.transactions.length - 1].set(key, value);
    } else {
      this.data.set(key, value);
    }

    return true;
  }

  unset(key) {
    if (this.transactions.length > 0) {
      this.transactions[this.transactions.length - 1].set(key, null);
    } else {
      this.data.delete(key);
    }

    return true;
  }
}

const db = new Database();
db.set("fruit", "apple");
console.log(db.get("fruit")); // -> "apple"

db.begin();
console.log(db.get("fruit")); // -> "apple"

db.set("fruit", "orange");
console.log(db.get("fruit")); // -> "orange"

db.rollback();
console.log(db.get("fruit")); // -> "apple"

db.begin();
console.log(db.get("fruit")); // -> "apple"

db.unset("fruit");
console.log(db.get("fruit")); // -> null

db.commit();
console.log(db.get("fruit")); // -> null
