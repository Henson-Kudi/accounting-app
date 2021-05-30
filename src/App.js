import './App.css';
import Home from './Components/Home'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Nav from './Components/Nav'
import Sales from './Components/Sales'
import Returns from './Components/Returns';
import CustomersPage from './Components/CustomersPage';
import CustomerDetails from './Components/CustomerDetails';
import Purchases from './Components/Purchases';
import SuppliersPage from './Components/SuppliersPage';
import SupplierDetails from './Components/SupplierDetails'
import ExpensesPage from './Components/ExpensesPage';
import InventoriesPage from './Components/InventoriesPage';
import InventoryPage from './Components/InventoryPage'
import LiquidityPage from './Components/LiquidityPage'
import CapitalAndFixedAssets from './Components/CapitalAndFixedAssets'
import FixedAsset from './Components/FixedAsset';
import Shareholder from './Components/Shareholder'
import Liability from './Components/Liability'
import Dashboard from './Components/Dashboard'

function App() {
  return (
    <Router>
      <Switch>
        <div className="App">

          <Nav />
          <Route path="/" exact>
            <Home />
          </Route>

          <Route path="/sales" exact>
            <Sales />
          </Route>

          <Route path="/customers" exact>
            <CustomersPage />
          </Route>

          <Route path="/debtors" exact>
            <h2>I am debtors apge</h2>
          </Route>

          <Route path="/inventories" exact>
            <InventoriesPage/>
          </Route>
          <Route path="/inventories/:productName" exact>
            <InventoryPage/>
          </Route>

          <Route path="/purchases" exact>
            <Purchases />
          </Route>

          <Route path="/suppliers" exact>
            <SuppliersPage />
          </Route>
          <Route path="/suppliers/:supplierName" exact>
            <SupplierDetails />
          </Route>

          <Route path="/expenses" exact>
            <ExpensesPage />
          </Route>

          <Route path="/funds" exact>
            <LiquidityPage/>
          </Route>

          <Route path="/capital-and-fixed-assets" exact>
            <CapitalAndFixedAssets/>
          </Route>

          <Route path="/assets/:serialNumber" exact>
            <FixedAsset/>
          </Route>

          <Route path="/shareholders/:serialNumber" exact>
            <Shareholder/>
          </Route>
          <Route path="/liabilities/:serialNumber" exact>
            <Liability/>
          </Route>

          <Route path="/returns" exact>
            <Returns />
          </Route>

          <Route path="/dashboard" exact>
            <Dashboard/>
          </Route>

          <Route path="/customers/:customerName" exact>
            <CustomerDetails />
          </Route>

        </div>
      </Switch>
    </Router>
  );
}

export default App;
