const db = require('./db');

async function initializeDB() {
  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'To Do',
        assignee TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables created successfully');

    const result = await db.get('SELECT COUNT(*) as count FROM tasks');
    if (result.count === 0) {
      await db.run(`
        INSERT INTO tasks (title, description, status, assignee) VALUES
        ('Design Database Schema', 'Create tables for users, tasks, and teams.', 'In Progress', 'Alice'),
        ('Setup API Routes', 'Initialize Express and create CRUD for tasks.', 'To Do', 'Bob'),
        ('Frontend UI Mocks', 'Design the Kanban board in Figma.', 'Done', 'Charlie')
      `);
      console.log('Mock data inserted.');
    }
    
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initializeDB();
