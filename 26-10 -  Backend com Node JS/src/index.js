const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(express.json())

const repositories = [];

// MIDDLEWARE
const validateRepoId = (req, res, next) => {
  const notIsValidRepoId = !isUuid(req.body.id);
  if(notIsValidRepoId) return res
    .status(400).json({ error: "Is invalid repositorie ID!" });

  return next(); // NEXT MIDDLEWARE
};
app.use('/repositories/:id', validateRepoId);

app.get('/repositories', (req, res) => {
  const { title } = req.query;

  const results = title
    ? repositories
      .filter(repo => repo.title.toLowerCase()
      .includes(title.toLowerCase()))
    : repositories;

  return res.json(results);
});

app.post('/repositories', (req, res) => {
  const repo = req.body;
  repo.id = uuid();

  repositories.push(repo)

  return res.status(201).json(repo);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) return res.status(400).json({ error: "Repositorie not found!"});

  const repo = req.body;
  const updatedRepo = { ...repo, id };

  repositories[repoIndex] = updatedRepo;

  return res.status(200).json(updatedRepo);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) return res.status(400).json({ error: "Repositorie not found!"});

  repositories.splice(repoIndex, 1);

  return res.status(204).send();
});

app.listen(3333, () => console.log('ONLINE SERVER ;)'));
