class Database {
    constructor() {
      this.data = new Map(); // Main database storage
      this.transactions = []; // Stack of transaction changes
    }
  
    begin() {
      // Start a new transaction by pushing an empty map to the stack
      this.transactions.push(new Map());
      return true;
    }
  
    commit() {
      // If no active transactions, nothing to commit
      if (this.transactions.length === 0) {
        return false;
      }
  
      // Apply all transaction changes to the main database
      while (this.transactions.length > 0) {
        const transaction = this.transactions.pop();
        
        // Apply each change from the transaction
        for (const [key, value] of transaction.entries()) {
          if (value === null) {
            // If value is null, it means we want to unset the key
            this.data.delete(key);
          } else {
            // Otherwise, set the key to the value
            this.data.set(key, value);
          }
        }
      }
      
      return true;
    }
  
    rollback() {
      // If no active transactions, nothing to rollback
      if (this.transactions.length === 0) {
        return false;
      }
      
      // Simply remove the most recent transaction
      this.transactions.pop();
      return true;
    }
  
    get(key) {
      // Check transactions stack from newest to oldest
      for (let i = this.transactions.length - 1; i >= 0; i--) {
        const transaction = this.transactions[i];
        
        // If this key appears in the current transaction
        if (transaction.has(key)) {
          const value = transaction.get(key);
          
          // If value is null, it means the key was unset in this transaction
          if (value === null) {
            return null;
          }
          
          return value;
        }
      }
      
      // If the key wasn't found in any transaction, check the main database
      if (this.data.has(key)) {
        return this.data.get(key);
      }
      
      return null;
    }
  
    set(key, value) {
      // If we're in a transaction, add to the current transaction
      if (this.transactions.length > 0) {
        this.transactions[this.transactions.length - 1].set(key, value);
      } else {
        // Otherwise, set directly in the main database
        this.data.set(key, value);
      }
      
      return true;
    }
  
    unset(key) {
      // If in a transaction, mark the key as unset by setting it to null
      if (this.transactions.length > 0) {
        this.transactions[this.transactions.length - 1].set(key, null);
      } else {
        // Otherwise, delete directly from the main database
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