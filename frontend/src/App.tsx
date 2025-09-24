import React from "react";
import PostList from "./components/PostList";
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sastagram</h1>
      </header>
      <PostList/>
    </div>
  );
};

export default App;