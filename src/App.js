import './App.css';
import { UserProvider } from './Components/userContext';
import Routing from './Components/Routing';


function App() {

  return (
    <UserProvider>
      <Routing />
    </UserProvider>
  );
}

export default App;
