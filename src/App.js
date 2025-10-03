import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import DetajetPerdoruesit from './components/DetajetPerdoruesit'
import './App.css';
import ListaPerdorueseve from './components/ListaPerdorueseve';
import { useState } from "react";


function App() {
    const [perdoruesit, vendosPerdoruesit] = useState([]);

  return (
     <Router>
    <div className="App">
      <header className="header">
        <h2>Sistemi i Menaxhimit të Përdoruesve</h2>
      </header>

      <main className='content'>
       <Routes>
  
          <Route 
            path="/" 
            element={<ListaPerdorueseve users={perdoruesit} setUsers={vendosPerdoruesit} />} 
          />
            <Route
            path="/perdorues/:id"
            element={<DetajetPerdoruesit users={perdoruesit} setUsers={vendosPerdoruesit} />}
          />

        </Routes>
      </main>
    </div>
     </Router>
  );
}


export default App;
