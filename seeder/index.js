const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

async function main() {
  /**--------------- Not allowed to be edited - start - --------------------- */
  const mongoUri = process.env.MONGODB_URI;
  const collection = process.env.MONGODB_COLLECTION;

  const args = process.argv.slice(2);

  const command = args[0];
  /**--------------- Not allowed to be edited - end - --------------------- */

  // Connect to MongoDB
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Define a schema for the collection
  const schema = new mongoose.Schema(
    {
      title: String,
      year: Number,
      genre: [String],
      description: String,
      director: String,
      cast: [String],
    },
    { strict: false }
  );
  const Model = mongoose.model(collection, schema);

  switch (command) {
    case 'check-db-connection':
      await checkConnection();
      break;
    case 'bulk-insert':
      await bulkInsert(Model);
      break;
    case 'reset-db':
      await resetDB(Model);
      break;
    case 'get-all':
      await getAll(Model);
      break;
    default:
      throw Error('command not found');
  }

  await mongoose.disconnect();
  return;
}

async function checkConnection() {
  console.log('check db connection started...');
  try {
    await mongoose.connection.db.admin().ping();
    console.log('MongoDB connection is successful!');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
  console.log('check db connection ended...');
}

async function bulkInsert(Model) {
  const data = JSON.parse(fs.readFileSync('seed.json', 'utf-8'));
  try {
    await Model.insertMany(data);
    console.log('Bulk Insert Berhasil');
  } catch (err) {
    console.error('Bulk Insert Gagal:', err);
  }
}

async function resetDB(Model) {
  try {
    await Model.deleteMany({});
    console.log('Database berhasil direset');
  } catch (err) {
    console.error('Reset Database Gagal:', err);
  }
}

async function getAll(Model) {
  try {
    const data = await Model.find({});
    console.log('Data di Collection:', data);
  } catch (err) {
    console.error('Gagal mendapatkan data:', err);
  }
}

main();
