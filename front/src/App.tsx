import { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import reactLogo from './assets/react.svg';
import './App.css';

const style = css`
  color: #3badeb;
  background-color: #1ddb39;
`;

const Button = styled.button`
  color: #f5f0f0;
  background-color: #f54242;
`;

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div css={style}>Some hotpink text.</div>
      <Button>This is a hotpink button.</Button>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button type="button" onClick={() => setCount((_count) => _count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
