import { Button, CustomProvider, Container } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  return (
    <>
      <CustomProvider theme="light">
        <Container className="app">
          <header className="app-header">
            <img src={viteLogo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.jsx</code> and save to reload.
            </p>

            <Button
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </Button>
          </header>
        </Container>
      </CustomProvider>
    </>
  );
}

export default App;
