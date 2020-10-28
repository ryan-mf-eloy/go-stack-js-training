const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => response.json(repositories));

app.post("/repositories", (request, response) => {
  const repoData = request.body;
  repoData.id = uuid();
  repoData.likes = 0;

  repositories.push(repoData);

  return response.status(201).json(repoData);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) return response
    .status(400).json({ error: "Repositorie not found!" });

  const { title, url, techs } = request.body;
  repositories[repoIndex] = { ...repositories[repoIndex], title, url, techs, id };

  return response.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) return response
    .status(400).json({ error: "Repositorie not found!" });

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) return response
    .status(400).json({ error: "Repositorie not found!" });  

  let selectedRepositorie = repositories[repoIndex];
  selectedRepositorie.likes += 1;

  return response.status(201).json(selectedRepositorie);
});

module.exports = app;
