import React, { useState, useEffect } from "react";

import "./styles.css";

import api from './services/api';

// THIS CODE NEEDS THE SERVER SIDE - BackEnd
// BakcEnd Repository -> https://github.com/ryan-mf-eloy/go-stack-js-training/tree/master/DESAFIO%231

import { VscRocket } from 'react-icons/vsc';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsArrowRightShort, BsPlus } from 'react-icons/bs';
import { AiTwotoneLike } from 'react-icons/ai';

function App() {
  const [repos, setRepos] = useState([]);

  // Validate Bad Requests
  const isBadRequest = (statusReceived, statusExpected) =>
    statusReceived !== statusExpected;

  // Show error message - Alert
  const alertErrorMessage = ({ error }) => alert(`${error} :(`);

  // Get Repos when completed page load
  useEffect(() => {
    api.get('/repositories').then(({ data, status }) => {
      if (isBadRequest(status, 200)) return alertErrorMessage(data)

      setRepos([ ...repos, ...data ])
    });
  }, []);

  // Add repo
  const handleAddRepository = async () => {
    const { data, status } = await api.post('/repositories', {
      title: `Repository ${Date.now()}`,
      url: 'https://github.com/ryan-mf-eloy/go-stack-js-training',
      techs: ['Node JS', 'React JS', 'React Native']
    });

    if (isBadRequest(status, 201)) return alertErrorMessage(data); // PARA TESTAR COLOQUE CÓDIGO 200

    setRepos([ ...repos, ...[data]])
  }

  // Remove repo
  const handleRemoveRepository = async id => {
    const { status, data } = await api.delete(`/repositories/${id}`);
      
    if (isBadRequest(status, 204)) return alertErrorMessage(data)
     
    const updatedRepo = repos.filter(repo => repo.id !== id);
    setRepos(updatedRepo);
  }

  // Like repo
  const handleLikeRepository = async id => {
    const { status, data } = await api.post(`/repositories/${id}/like`);
      
    if (isBadRequest(status, 201)) return alertErrorMessage(data)
     
    const likedRepoIndex = repos.findIndex(repo => repo.id === id);
    const likes = repos[likedRepoIndex].likes + 1;

    repos[likedRepoIndex] = { ...repos[likedRepoIndex], likes};
    setRepos([...repos]);
  }

  return (
    <div className="container">
      <h1><VscRocket size="50" color="#04d361" /> GO STACK | RocketSeat</h1>
      <h3>DESAFIO #2</h3>
      <h6>FrontEnd com React JS</h6>
      <ul data-testid="repository-list">

        {
          repos.map(({ title, id, url, techs, likes }) =>
            <li key={ id }>
              <strong>{ title }</strong>

              <div>
                { techs.map((tech, index) => <span key={`${index}${id}`} className="tech">{ tech }</span>) }
              </div>

              <a href={ url } target="_blank">
                <button className="link">Go to repository <BsArrowRightShort size="20" color="#ffffff" /> </button>
              </a>

              <button className="danger" onClick={() => handleRemoveRepository(id)}>
                Remover <FaRegTrashAlt size="15" color="#ffffff" />
              </button>

              <button className="secondary" onClick={() => handleLikeRepository(id)}>
                ({ likes }) <AiTwotoneLike size="20" color="#000000" />
              </button>
            </li>
          )}

      </ul>

      <button onClick={handleAddRepository}>Adicionar <BsPlus size="20" color="#ffffff"/></button>
    </div>
  );
}

export default App;
