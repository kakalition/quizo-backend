const mongo = require('mongodb')

const connectionString = process.env.ATLAS_URI || "";

const client = new mongo.MongoClient(connectionString);

async function getInstance() {
  let conn;

  try {
    conn = await client.connect();
  } catch (e) {
    console.error(e);
  }

  return conn.db("quizo");
}

exports.getInstance = getInstance;