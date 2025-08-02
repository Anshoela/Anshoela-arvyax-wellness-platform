import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './Route/AppRoutes';



function App() {
  return (
    <div>
        <Router>
      <Navbar />
      <AppRoutes />
    </Router>
    </div>
  );
}

export default App;
