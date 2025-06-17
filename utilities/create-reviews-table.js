const pool = require('../database')

async function createReviewsTable() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS reviews (
          review_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          inv_id INTEGER NOT NULL,
          account_id INTEGER NOT NULL,
          review_text TEXT NOT NULL,
          rating INTEGER NOT NULL,
          review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT rating_check CHECK (rating >= 1 AND rating <= 5),
          CONSTRAINT fk_inventory FOREIGN KEY (inv_id) 
              REFERENCES inventory (inv_id) ON DELETE CASCADE,
          CONSTRAINT fk_account FOREIGN KEY (account_id) 
              REFERENCES account (account_id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_reviews_inv_id ON reviews(inv_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_account_id ON reviews(account_id);
    `
    await pool.query(sql)
    console.log("Reviews table created successfully")

    
    const sampleData = `
      INSERT INTO reviews (inv_id, account_id, review_text, rating)
      VALUES 
          (1, 1, 'Great car! Very comfortable and reliable.', 5),
          (1, 2, 'Good value for money, but could use better fuel efficiency.', 4),
          (2, 1, 'Amazing performance! A true head-turner.', 5)
      ON CONFLICT DO NOTHING;
    `
    await pool.query(sampleData)
    console.log("Sample reviews added successfully")

  } catch (error) {
    console.error("Error creating reviews table:", error)
  }
}

// Run the function
createReviewsTable() 