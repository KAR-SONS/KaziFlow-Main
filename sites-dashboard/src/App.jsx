import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import KaziFlowStores from './Pages/KaziFlowStores'

const App = () => {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<KaziFlowStores />} />
      </Routes>
    </Router>
  )
}

export default App