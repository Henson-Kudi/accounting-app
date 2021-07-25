import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import {useState, useRef, useEffect} from 'react'
import Nav from './Components/Nav'
import Sales from './Components/Sales'
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
import Reports from './Components/Reports'
import ReviewsPage from './Components/RiviewsPage'
import Quotation from './Components/Quotation';
import Invoice from './Components/Invoice'
import Receipt from './Components/Receipt'
import ReceivePayment from './Components/ReceivePayment'
import CreditNote from './Components/CreditNote'
import PurchaseOrder from './Components/PurchaseOrder'
import PurchaseInvoice from './Components/PurchaseInvoice'
import CashPurchase from './Components/CashPurchase'
import MakePayment from './Components/MakePayment'
import PurchaseReturns from './Components/PurchaseReturns'
import NewExpense from './Components/NewExpense'
import Alert from './Components/Alert'
import DebitNote from './Components/DebitNote'
import SalesAndPurchaseOptions from './Components/SalesOptions'
import Invoices from './Components/Invoices'
import InvoiceDetails from './Components/InvoiceDetails'
import Receipts from './Components/Receipts'
import ReceiptDetails from './Components/ReceiptDetails'
import CreditNotes from './Components/CreditNotes'
import CreditNoteDetails from './Components/CreditNoteDetails'
import Quotes from './Components/Quotes'
import QuoteDetails from './Components/QuoteDetails'
import PurchaseInvoices from './Components/PurchaseInvoices'
import PurchaseInvoiceDetails from './Components/PurchaseInvoiceDetails'
import PurchaseReceipts from './Components/PurchaseReceipts'
import PurchaseReceiptDetails from './Components/PurchaseReceiptDetails'
import PurchaseOrders from './Components/PurchaseOrders';
import PurchaseOrderDetails from './Components/PurchaseOrderDetails';
import PurchaseReturnsPage from './Components/PurchaseReturnsPage'
import PurchaseReturnDetails from './Components/PurchaseReturnDetails'
import AddReview from './Components/AddReview'
import Dashboard from './Components/Dashboard'

function App() {
  const [newTran, setNewTran] = useState(false)
  const [newQuotation, setNewQuotation] = useState(false)
  const [newInvoice, setNewInvoice] = useState(false)
  const [newCreditNote, setNewCreditNote] = useState(false)
  const [newReceipt, setNewReceipt] = useState(false)
  const [newReceivePayment, setNewReceivePayment] = useState(false)
  const [newExpense, setNewExpense] = useState(false)
  const [newPurchaseOrder, setNewPurchaseOrder] = useState(false)
  const [newPurchaseInvoice, setNewPurchaseInvoice] = useState(false)
  const [newCashPurchase, setNewCashPurchase] = useState(false)
  const [newMakePayment, setNewMakePayment] = useState(false)
  const [newPurchaseReturns, setNewPurchaseReturns] = useState(false)
  const [newDebitNote, setNewDebitNote] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  return (
    <Router>
      <Switch>
        <div className="App">

          <Nav click={()=>{setNewTran(!newTran)}}/>
          {
            newTran && 
            <div className="Home">
              <SalesAndPurchaseOptions
                    onClick={()=>{setNewTran(!true)}}
                    newQuotation={() => {
                    setNewTran(false)
                    setTimeout(() => {
                      setNewQuotation(true)
                      }, 500)
                    }}

                    newInvoice={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewInvoice(true)
                        }, 500)
                    }}

                    newCreditNote={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewCreditNote(true)
                        }, 500)
                    }}

                    newReceipt={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewReceipt(true)
                        }, 500)
                    }}

                    newReceivePayment={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewReceivePayment(true)
                        }, 500)
                    }}

                    newPurchaseInvoice={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewPurchaseInvoice(true)
                        }, 500)
                    }}

                    newMakePayment={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewMakePayment(true)
                        }, 500)
                    }}

                    newDebitNote={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewDebitNote(true)
                        })
                    }}

                    newPurchaseReturns={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewPurchaseReturns(true)
                        }, 500)
                    }}

                    newPurchaseOrder={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewPurchaseOrder(true)
                        })
                    }}

                    newExpense={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewExpense(true)
                        }, 500)
                    }}

                    newCashPurchase={() => {
                        setNewTran(false)
                        setTimeout(() => {
                            setNewCashPurchase(true)
                        }, 500)
                    }}

                />
            </div>
          }
          
          <Route path="/" exact>
            <Dashboard/>
          </Route>

          <Route path="/sales" exact>
            <Sales />
          </Route>

          <Route path="/invoices" exact>
            <Invoices />
          </Route>

          <Route path="/invoices/:invoiceNumber" exact>
            <InvoiceDetails />
          </Route>

          <Route path="/receipts" exact>
            <Receipts />
          </Route>
          <Route path="/receipts/:receiptNumber" exact>
            <ReceiptDetails />
          </Route>

          <Route path="/credit-notes" exact>
            <CreditNotes />
          </Route>
          <Route path="/credit-notes/:noteNumber" exact>
            <CreditNoteDetails />
          </Route>

          <Route path="/quotes" exact>
            <Quotes />
          </Route>
          <Route path="/quotes/:quoteNumber" exact>
            <QuoteDetails />
          </Route>

          <Route path="/customers" exact>
            <CustomersPage />
          </Route>

          <Route path="/purchase-receipts" exact>
            <PurchaseReceipts />
          </Route>
          <Route path="/purchase-receipts/:receiptNumber" exact>
            <PurchaseReceiptDetails />
          </Route>

          <Route path="/purchase-invoices" exact>
            <PurchaseInvoices />
          </Route>
          <Route path="/purchase-invoices/:invoiceNumber" exact>
            <PurchaseInvoiceDetails />
          </Route>

          <Route path="/purchase-orders" exact>
            <PurchaseOrders />
          </Route>
          <Route path="/purchase-orders/:orderNumber" exact>
            <PurchaseOrderDetails />
          </Route>

          <Route path="/purchase-returns" exact>
            <PurchaseReturnsPage />
          </Route>
          <Route path="/purchase-returns/:returnNumber" exact>
            <PurchaseReturnDetails />
          </Route>

          <Route path="/inventories" exact>
            <InventoriesPage/>
          </Route>
          <Route path="/inventories/inventory?id=''&name=''" exact>
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

          <Route path="/treasury" exact>
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

          <Route path="/reports" exact>
            <Reports/>
          </Route>

          <Route path="/customers/:customerName" exact>
            <CustomerDetails />
          </Route>

          <Route path="/reviews" exact>
            <ReviewsPage/>
          </Route>

          {
            newQuotation && <Quotation
            onClick={() => { setNewQuotation(false) }}
            newQuotation={() => { setNewQuotation(true) }}
            refetch={() =>{
              setAlert(true);
              setAlertMessage('Quotation Added Successfully');
              setTimeout(() => {
                setAlert(false);
              setAlertMessage('');
              }, 2000)
            }}
            />
          }

          {
            newInvoice && <Invoice
            newInvoice={()=>{setNewInvoice(true)}}
              onClick={() => {
                  setNewInvoice(false)
            }}
            refetch={() =>{
                setAlert(true);
                setAlertMessage('Invoice Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
              }, 2000)
            }}
            />
            }

            {
              newCreditNote && <CreditNote
                newCreditNote={() => {
                    setNewCreditNote(true)
                }}
                onClick={() => {
                    setNewCreditNote(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Credit Note Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
              }, 2000)
              }}
              />
            }

            {
              newReceipt && <Receipt
                newReceipt={()=>{setNewInvoice(true)}}
                onClick={() => {
                  setNewReceipt(false)
                }}
              refetch={() =>{
                setAlert(true);
                setAlertMessage('Receipt Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
              }, 2000)
              }}
              />
            }

            {
              newReceivePayment && <ReceivePayment
                onClick={() => {
                  setNewReceivePayment(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Customer Payment Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
              }, 2000)
              }}
              />
            }

            {
              newPurchaseInvoice && <PurchaseInvoice
                newInvoice={() => {
                  setNewPurchaseInvoice(true)
                }}
                onClick={() => {
                  setNewPurchaseInvoice(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Purchase Invoice Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
                }, 2000)
                }}
              />
            }

            {
              newMakePayment && <MakePayment
                onClick={() => {
                  setNewMakePayment(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Supplier Payment Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
                }, 2000)
                }}
              />
            }

            {
              newDebitNote && <DebitNote
                onClick={() => {
                  setNewDebitNote(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Debit Note Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
                }, 2000)
                }}
              />
            }

            {
              newPurchaseReturns && <PurchaseReturns
                onClick={() => {
                  setNewPurchaseReturns(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Purchase Returns Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
                }, 2000)
                }}
              />
            }

            {
              newPurchaseOrder && <PurchaseOrder
                newOrder={() => {
                  setNewPurchaseOrder(true)
                }}
                onClick={() => {
                  setNewPurchaseOrder(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Purchase Order Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
                }, 2000)
                }}
              />
            }

            {
              newExpense && <NewExpense
                newExpense={() => {
                  setNewExpense(true)
                }}
                onClick={() => {
                  setNewExpense(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Expense Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
                }, 2000)
                }}
              />
            }

            {
              newCashPurchase && <CashPurchase
                newReceipt={() => {
                  setNewCashPurchase(true)
                }}
                onClick={() => {
                  setNewCashPurchase(false)
                }}
                refetch={() =>{
                setAlert(true);
                setAlertMessage('Purhase Receipt Added Successfully');
                setTimeout(() => {
                  setAlert(false);
                setAlertMessage('');
                }, 2000)
                }}
              />
            }
            {
              alert && 
              <Alert
                alert={alert}
                message={alertMessage}
              />
            }


        </div>
      </Switch>
    </Router>
  );
}

export default App;
