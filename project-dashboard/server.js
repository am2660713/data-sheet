import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = 3001;

// MongoDB connection
const MONGO_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'project-dashboard';

let client = null;
let db = null;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectDB() {
  if (db) return db;
  
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB:', DB_NAME);
    
    // Create indexes
    await db.collection('projects').createIndex({ userEmail: 1, sr: 1 }, { unique: true });
    await db.collection('daily').createIndex({ userEmail: 1, month: 1 });
    await db.collection('monthly').createIndex({ userEmail: 1, month: 1 });
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// ==================== PROJECTS API ====================

// Get all projects for a user
app.get('/api/projects/:email', async (req, res) => {
  try {
    const database = await connectDB();
    const email = decodeURIComponent(req.params.email);
    const projects = await database.collection('projects')
      .find({ userEmail: email })
      .sort({ sr: 1 })
      .toArray();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new project
app.post('/api/projects', async (req, res) => {
  try {
    const database = await connectDB();
    const { project, userEmail } = req.body;
    
    // Get max sr for user
    const existing = await database.collection('projects')
      .find({ userEmail })
      .sort({ sr: -1 })
      .limit(1)
      .toArray();
    const sr = existing.length > 0 ? existing[0].sr + 1 : 1;
    
    const result = await database.collection('projects').insertOne({
      ...project,
      sr,
      userEmail
    });
    
    res.json({ ...project, sr, userEmail, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const { id } = req.params;
    const { project } = req.body;
    
    await database.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: project }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const { id } = req.params;
    
    await database.collection('projects').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DAILY API ====================

// Get all daily entries for a user
app.get('/api/daily/:email', async (req, res) => {
  try {
    const database = await connectDB();
    const email = decodeURIComponent(req.params.email);
    const daily = await database.collection('daily')
      .find({ userEmail: email })
      .sort({ date: 1 })
      .toArray();
    res.json(daily);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a daily entry
app.post('/api/daily', async (req, res) => {
  try {
    const database = await connectDB();
    const { entry, userEmail } = req.body;
    
    const result = await database.collection('daily').insertOne({
      ...entry,
      userEmail
    });
    
    res.json({ ...entry, userEmail, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a daily entry
app.put('/api/daily/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const { id } = req.params;
    const { entry } = req.body;
    
    await database.collection('daily').updateOne(
      { _id: new ObjectId(id) },
      { $set: entry }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a daily entry
app.delete('/api/daily/:id', async (req, res) => {
  try {
    const database = await connectDB();
    const { id } = req.params;
    
    await database.collection('daily').deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MONTHLY API ====================

// Get all monthly entries for a user
app.get('/api/monthly/:email', async (req, res) => {
  try {
    const database = await connectDB();
    const email = decodeURIComponent(req.params.email);
    const monthly = await database.collection('monthly')
      .find({ userEmail: email })
      .sort({ month: 1 })
      .toArray();
    res.json(monthly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save all monthly entries for a user
app.post('/api/monthly', async (req, res) => {
  try {
    const database = await connectDB();
    const { monthly, userEmail } = req.body;
    
    // Delete existing and insert new
    await database.collection('monthly').deleteMany({ userEmail });
    if (monthly.length > 0) {
      const data = monthly.map(m => ({
        month: m.month,
        total: m.total,
        billable: m.billable,
        nonBillable: m.nonBillable,
        userEmail
      }));
      await database.collection('monthly').insertMany(data);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER API ====================

// Get or create user
app.post('/api/user', async (req, res) => {
  try {
    const database = await connectDB();
    const { email, name } = req.body;
    
    const existing = await database.collection('users').findOne({ email });
    if (existing) {
      res.json(existing);
    } else {
      const result = await database.collection('users').insertOne({ email, name, createdAt: new Date() });
      res.json({ _id: result.insertedId, email, name, createdAt: new Date() });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by email
app.get('/api/user/:email', async (req, res) => {
  try {
    const database = await connectDB();
    const email = decodeURIComponent(req.params.email);
    const user = await database.collection('users').findOne({ email });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
