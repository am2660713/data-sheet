import { MongoClient } from 'mongodb';

// MongoDB connection string (local MongoDB)
// You can change this to connect to any MongoDB instance
// Default: localhost:27017
const MONGO_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'project-dashboard';

let client = null;
let db = null;

// Connect to MongoDB
async function connectDB() {
  if (db) return db;
  
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB:', DB_NAME);
    
    // Create indexes for better query performance
    await db.collection('projects').createIndex({ userEmail: 1, sr: 1 });
    await db.collection('daily').createIndex({ userEmail: 1, month: 1 });
    await db.collection('monthly').createIndex({ userEmail: 1, month: 1 });
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Close MongoDB connection
async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

// Projects operations
export const projectDB = {
  async getAllByUser(userEmail) {
    const database = await connectDB();
    return await database.collection('projects')
      .find({ userEmail })
      .sort({ sr: 1 })
      .toArray();
  },

  async add(project, userEmail) {
    const database = await connectDB();
    const projects = await this.getAllByUser(userEmail);
    const sr = projects.length > 0 ? Math.max(...projects.map(p => p.sr)) + 1 : 1;
    const result = await database.collection('projects').insertOne({ ...project, sr, userEmail });
    return { ...project, sr, userEmail, _id: result.insertedId };
  },

  async update(id, project) {
    const database = await connectDB();
    return await database.collection('projects').updateOne(
      { _id: id },
      { $set: project }
    );
  },

  async delete(id) {
    const database = await connectDB();
    return await database.collection('projects').deleteOne({ _id: id });
  },

  async deleteAllByUser(userEmail) {
    const database = await connectDB();
    return await database.collection('projects').deleteMany({ userEmail });
  },

  async bulkAdd(projects, userEmail) {
    const database = await connectDB();
    const data = projects.map((p, i) => ({ ...p, sr: i + 1, userEmail }));
    return await database.collection('projects').insertMany(data);
  }
};

// Daily timesheet operations
export const dailyDB = {
  async getByUser(userEmail) {
    const database = await connectDB();
    return await database.collection('daily')
      .find({ userEmail })
      .sort({ date: 1 })
      .toArray();
  },

  async getByMonth(month, userEmail) {
    const database = await connectDB();
    return await database.collection('daily')
      .find({ month, userEmail })
      .toArray();
  },

  async add(entry, userEmail) {
    const database = await connectDB();
    const result = await database.collection('daily').insertOne({ ...entry, userEmail });
    return { ...entry, userEmail, _id: result.insertedId };
  },

  async update(id, entry) {
    const database = await connectDB();
    return await database.collection('daily').updateOne(
      { _id: id },
      { $set: entry }
    );
  },

  async delete(id) {
    const database = await connectDB();
    return await database.collection('daily').deleteOne({ _id: id });
  },

  async deleteAllByUser(userEmail) {
    const database = await connectDB();
    return await database.collection('daily').deleteMany({ userEmail });
  }
};

// Monthly summary operations
export const monthlyDB = {
  async getAllByUser(userEmail) {
    const database = await connectDB();
    return await database.collection('monthly')
      .find({ userEmail })
      .sort({ month: 1 })
      .toArray();
  },

  async add(month, userEmail) {
    const database = await connectDB();
    const result = await database.collection('monthly').insertOne({ month, userEmail });
    return { month, userEmail, _id: result.insertedId };
  },

  async update(id, data) {
    const database = await connectDB();
    return await database.collection('monthly').updateOne(
      { _id: id },
      { $set: data }
    );
  },

  async delete(id) {
    const database = await connectDB();
    return await database.collection('monthly').deleteOne({ _id: id });
  },

  async deleteAllByUser(userEmail) {
    const database = await connectDB();
    return await database.collection('monthly').deleteMany({ userEmail });
  },

  async bulkPut(monthlyData, userEmail) {
    const database = await connectDB();
    // Clear existing and insert new
    await database.collection('monthly').deleteMany({ userEmail });
    if (monthlyData.length > 0) {
      const data = monthlyData.map(m => ({
        month: m.month,
        total: m.total,
        billable: m.billable,
        nonBillable: m.nonBillable,
        userEmail
      }));
      return await database.collection('monthly').insertMany(data);
    }
  }
};

// User operations
export const userDB = {
  async create(user) {
    const database = await connectDB();
    const { email } = user;
    const existing = await database.collection('users').findOne({ email });
    if (existing) {
      return await database.collection('users').updateOne(
        { email },
        { $set: user }
      );
    } else {
      return await database.collection('users').insertOne(user);
    }
  },

  async getByEmail(email) {
    const database = await connectDB();
    return await database.collection('users').findOne({ email });
  },

  async getAll() {
    const database = await connectDB();
    return await database.collection('users').find().toArray();
  },

  async delete(email) {
    const database = await connectDB();
    return await database.collection('users').deleteOne({ email });
  }
};

// Export connection function and close function
export { connectDB, closeDB };
export default { connectDB, closeDB, projectDB, dailyDB, monthlyDB, userDB };
