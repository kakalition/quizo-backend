const dotenv = require('dotenv')
dotenv.config();

const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const { uuid } = require('uuidv4');
const mongoDb = require('./db');


app.use(cors());

const bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// const upload = require('multer');
// app.use(upload().none());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Applications

app.get('/applications', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('application');

  const results = await collection.find({})
    .toArray();

  res.send(results).status(200);
});

app.post('/applications', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('application');

  const result = await collection.insertOne({
    uuid: uuid(),
    name: req.body.name
  });

  res.send(result).status(201);
});

app.put('/applications/:uuid', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('application');

  const currentItem = await collection.findOne({
    uuid: req.params['uuid']
  })

  currentItem.name = req.body.name;

  const result = await collection.updateOne(
    {
      uuid: currentItem.uuid
    },
    {
      "$set": currentItem,
    }
  );

  res.send(result).status(200);
});

app.delete('/applications/:uuid', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('application');

  const result = await collection.deleteOne({
    uuid: req.params['uuid']
  })

  res.send(result).status(200);
});

// Menus
app.get('/applications/:uuid/menus', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('menus');

  const results = await collection.find({
    appUuid: req.params.uuid
  }).toArray();

  res.send(results).status(200);
});

app.get('/applications/:uuid/menus/:menuUuid', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('menus');

  const results = await collection.find({
    parentUuid: req.params.menuUuid
  }).toArray();

  res.send(results).status(200);
});

app.post('/applications/:uuid/menus', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('menus');

  const result = await collection.insertOne({
    uuid: uuid(),
    appUuid: req.params.uuid,
    parentUuid: req.body.parentUuid,
    name: req.body.name,
    index: parseInt(req.body.index),
  });

  res.send(result).status(201);
});

app.put('/applications/:uuid/menus/:menuUuid', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('menus');

  const currentItem = await collection.findOne({
    uuid: req.params['menuUuid'],
    index: parseInt(req.body.index),
  })

  currentItem.name = req.body.name;
  currentItem.index = req.body.index;

  const result = await collection.updateOne(
    {
      uuid: currentItem.uuid
    },
    {
      "$set": currentItem,
    }
  );

  res.send(result).status(200);
});

app.delete('/applications/:uuid/menus/:menuUuid', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('menus');

  const result = await collection.deleteOne({
    uuid: req.params['menuUuid']
  })

  res.send(result).status(200);
});

// Quiz
app.get('/applications/:uuid/menus/:menuUuid/quiz', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('quiz');

  const result = await collection.findOne({
    menuUuid: req.params.menuUuid
  });

  console.log(`menuUuid ${req.params.menuUuid}`);
  console.log(`result ${result}`);

  res.send(result ?? { quiz: [] }).status(200);
});

app.post('/applications/:uuid/menus/:menuUuid/quiz', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('quiz');

  const result = await collection.insertOne({
    uuid: uuid(),
    appUuid: req.params.uuid,
    ...req.body,
  });

  res.send(result).status(200);
});

app.put('/applications/:uuid/menus/:menuUuid/quiz/:quizUuid', async (req, res) => {
  const instance = await mongoDb.getInstance();
  const collection = await instance.collection('quiz');

  const currentItem = await collection.findOne({
    uuid: req.params['quizUuid']
  })

  const result = await collection.updateOne(
    {
      uuid: currentItem.uuid
    },
    {
      "$set": {
        quiz: req.body.quiz
      },
    }
  );

  res.send(result).status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})