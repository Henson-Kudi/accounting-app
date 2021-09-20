import React, {useState, useContext} from 'react'
import {Switch, Route, useHistory} from 'react-router-dom'
import Nav from './Nav'
import Sales from './Sales'
import CustomersPage from './CustomersPage';
import CustomerDetails from './CustomerDetails';
import Purchases from './Purchases';
import SuppliersPage from './SuppliersPage';
import SupplierDetails from './SupplierDetails'
import ExpensesPage from './ExpensesPage';
import InventoriesPage from './InventoriesPage';
import InventoryPage from './InventoryPage'
import LiquidityPage from './LiquidityPage'
import CapitalAndFixedAssets from './CapitalAndFixedAssets'
import FixedAsset from './FixedAsset';
import Shareholder from './Shareholder'
import Liability from './Liability'
import Reports from './Reports'
import ReviewsPage from './RiviewsPage'
import Quotation from './Quotation';
import Invoice from './Invoice'
import Receipt from './Receipt'
import ReceivePayment from './ReceivePayment'
import CreditNote from './CreditNote'
import PurchaseOrder from './PurchaseOrder'
import PurchaseInvoice from './PurchaseInvoice'
import CashPurchase from './CashPurchase'
import MakePayment from './MakePayment'
import PurchaseReturns from './PurchaseReturns'
import NewExpense from './NewExpense'
import Alert from './Alert'
import DebitNote from './DebitNote'
import SalesAndPurchaseOptions from './SalesOptions'
import Invoices from './Invoices'
import InvoiceDetails from './InvoiceDetails'
import Receipts from './Receipts'
import ReceiptDetails from './ReceiptDetails'
import CreditNotes from './CreditNotes'
import CreditNoteDetails from './CreditNoteDetails'
import Quotes from './Quotes'
import QuoteDetails from './QuoteDetails'
import PurchaseInvoices from './PurchaseInvoices'
import PurchaseInvoiceDetails from './PurchaseInvoiceDetails'
import PurchaseReceipts from './PurchaseReceipts'
import PurchaseReceiptDetails from './PurchaseReceiptDetails'
import PurchaseOrders from './PurchaseOrders';
import PurchaseOrderDetails from './PurchaseOrderDetails';
import PurchaseReturnsPage from './PurchaseReturnsPage'
import PurchaseReturnDetails from './PurchaseReturnDetails'
import NewCustomerForm from './NewCustomerForm'
import NewSupplierForm from './NewSupplierForm';
import NewFixedAsset from './NewFixedAsset';
import NewLongtermLiability from './NewLongtermLiability';
import AddProductForm from './AddProductForm'
import NewShareholder from './NewShareholder'
import Dashboard from './Dashboard'
import { UserContext } from './userContext';


function ProtectedRoutes() {

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
  const [newCustomer, setNewCustomer] = useState(false)
  const [newSupplier, setNewSupplier] = useState(false)
  const [newStock, setNewStock] = useState(false)
  const [newLiability, setNewLiability] = useState(false)
  const [newShareholder, setNewShareholder] = useState(false)
  const [newEmployee, setNewEmployee] = useState(false)
  const [newAsset, setNewAsset] = useState(false)
  const history = useHistory()
  const {user, login} = useContext(UserContext)
  const loggedIn = user.auth

    return (
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

                        newCustomer = {()=>{
                          setNewTran(false)
                          setNewCustomer(true)
                        }}
                        newSupplier = {()=>{
                          setNewTran(false)
                          setNewSupplier(true)
                        }}
                        newStock = {()=>{
                          setNewTran(false)
                          setNewStock(true)
                        }}
                        newLiability = {()=>{
                          setNewTran(false)
                          setNewLiability(true)
                        }}
                        newShareholder = {()=>{
                          setNewTran(false)
                          setNewShareholder(true)
                        }}
                        newEmployee = {()=>{
                          setNewTran(false)
                          setNewEmployee(true)
                        }}
                        newAsset = {()=>{
                          setNewTran(false)
                          setNewAsset(true)
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
                {
                  newCustomer && <NewCustomerForm onClick={()=>{
                    setNewCustomer(false)
                  }}
                    refetch={() =>{
                      setAlertMessage('Customer Added Successfully')
                      setAlert(true)
                      setTimeout(() => {
                        setAlertMessage('')
                        setAlert(false)
                      }, 3000)
                    }}
                  />
                }
                {
                  newSupplier && <NewSupplierForm onClick={()=>{setNewSupplier(false)}}
                    refetch={()=>{
                      setAlertMessage('Supplier Added Successfully')
                      setAlert(true)
                      setTimeout(() => {
                        setAlertMessage('')
                        setAlert(false)
                      }, 3000)
                    }}
                  />
                }
                {
                  newStock && <AddProductForm onClick={()=>{setNewStock(false)}}
                    refetch={()=>{
                      setAlertMessage('Product Added Successfully')
                      setAlert(true)
                      setTimeout(() => {
                        setAlertMessage('')
                        setAlert(false)
                      }, 3000)
                      }}
                  />
                }
                {
                  newLiability && <NewLongtermLiability onClick={()=>{setNewLiability(false)}}
                    refetch={() =>{
                      setAlertMessage('Liability Added Successfully')
                      setAlert(true)
                      setTimeout(()=>{
                        setAlertMessage('')
                        setAlert(false)
                      }, 3000)
                    }}
                  />
                }
                {
                  newShareholder && <NewShareholder onClick={()=>{setNewShareholder(false)}}
                    refetch={()=>{
                      setAlertMessage('Shareholder Added')
                      setAlert(true)
                      setTimeout(()=>{
                        setAlertMessage('')
                        setAlert(false)
                      }, 3000)
                    }}
                  />
                }
                {/* {
                  newEmployee && <NewEmployeeForm onClick={()=>{setNewEmployee(false)}}/>
                } */}
                {
                  newAsset && <NewFixedAsset onClick={()=>{setNewAsset(false)}}
                    refetch={()=>{
                      setAlertMessage('Asset Added Successfully')
                      setAlert(true)
                      setTimeout(() => {
                        setAlertMessage('')
                        setAlert(false)
                      }, 3000)
                    }}
                  />
                }
            </div>
        </Switch>
    )
}

export default ProtectedRoutes
