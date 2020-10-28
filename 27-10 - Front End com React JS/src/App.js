import React, { useState, useEffect } from 'react';

import api from './services/api';

import './App.css';

const App = () => {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(({ data }) =>
      setRepositories([...repositories, ...data]));
  }, [])

  const handleAddRepo = async () => {
    const { data } = await api.post('/repositories', {
      title: `FrontEnd com React JS ${Date.now()}`,
      url: 'https://linkdorepositorio.com.br/',
      techs: ['Node JS', 'React JS', 'React Native']
    });

    setRepositories([ ...repositories, data]);
  };

  return (
    <>
      <div className="container">
        <h1>Get repositories</h1>
        <ul>
          {repositories.map(({ title, url, techs, likes, id }, index) =>
            <li key={id}>
              <strong>Title:</strong> { title }
              <div className="tech">
                <strong>Techs:</strong> { techs }
              </div>
              <a target="_blank" href={url}><button>Go to repositorie</button></a>
            </li>)}
        </ul>
        <button onClick={handleAddRepo}>Register new Repo.</button>
      </div>
      </>
  );
};

export default App;