import React, {useState, useContext} from 'react'
import {Switch, Route} from 'react-router-dom'
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
import UpdateInvoice from './UpdateInvoice';
import UpdateReceipt from './UpdateReceipt';
import UpdateQuotation from './UpdateQuotation';
import UpdateCreditNote from './updateCreditNote';
import UpdatePurchaseInvoice from './UpdatePurchaseInvoice';
import UpdatePurchaseOrder from './UpdatePurchaseOrder';
import UpdatePurchaseReceipt from './UpdatePurchaseReceipt';
import UpdatePurchaseReturns from './UpdatePurchaseReturns';
import UpdateProductForm from './UpdateProduct';
import UpdateCustomer from './UpdateCustomer';
import UpdateSupplier from './UpdateSupplier';
import SalesByProduct from './SalesByProduct';
import SalesByCustomer from './SalesByCustomer';
import SalesReturnsReport from './SalesReturnsReport';
import InventorySummary from './InventorySummary';
import StockSummaryReport from './StockSummaryReport';
import CustomerBalances from './CustomerBalances';
import UnpaidInvoices from './UnpaidInvoices';
import SupplierBalances from './SupplierBalances';
import UnpaidPurchaseInvoices from './UnpaidPurchaseInvoices';
import PurchasesByProduct from './PurchasesByProduct';
import PurchasesBySupplier from './PurchasesBySupplier';
import OtherExpensesSummary from './OtherExpensesSummary';
import CustomerPayments from './CustomerPayments';
import SupplierPayments from './SupplierPayments';
import IncomeStatement from './IncomeStatement';
import BalanceSheet from './BalanceSheet';
import AccountSettingsPage from './AccountSettingsPage';
import useAuth from '../customHooks/useAuth';


function ProtectedRoutes() {

    const [newTran, setNewTran] = useState(false)
  const [newDebitNote, setNewDebitNote] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [newLiability, setNewLiability] = useState(false)
  const [newShareholder, setNewShareholder] = useState(false)
  const [newAsset, setNewAsset] = useState(false)
  const {user, login} = useAuth()

    return (
          <Switch>
            <div className="App">
              <Nav click={()=>{setNewTran(!newTran)}}/>
              {
                newTran && 
                <div className="Home">
                  <SalesAndPurchaseOptions
                        onClick={()=>{setNewTran(!true)}}

                        newDebitNote={() => {
                            setNewTran(false)
                            setTimeout(() => {
                                setNewDebitNote(true)
                            })
                        }}

                        newLiability = {()=>{
                          setNewTran(false)
                          setNewLiability(true)
                        }}
                        newShareholder = {()=>{
                          setNewTran(false)
                          setNewShareholder(true)
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

              <Route path="/products/new-product" exact>
                <AddProductForm/>
              </Route>
              <Route path="/update-product/:productNumber" exact>
                <UpdateProductForm/>
              </Route>

              <Route path="/sales" exact>
                <Sales />
              </Route>

              <Route path="/invoices" exact={true}>
                <Invoices />
              </Route>

              <Route path="/invoice/new-invoice" exact={true}>
                <Invoice />
              </Route>

              <Route path="/update-invoice/:invoiceNumber" exact={true}>
                <UpdateInvoice />
              </Route>

              <Route path="/invoices/:invoiceNumber" exact>
                <InvoiceDetails />
              </Route>

              <Route path="/receipts" exact>
                <Receipts />
              </Route>
              <Route path="/receipt/new-receipt" exact>
                <Receipt />
              </Route>
              <Route path="/receipts/:receiptNumber" exact>
                <ReceiptDetails />
              </Route>
              <Route path="/update-receipt/:receiptNumber" exact={true}>
                <UpdateReceipt />
              </Route>

              <Route path="/credit-notes" exact>
                <CreditNotes />
              </Route>
              <Route path="/credit-note/new-credit-note" exact>
                <CreditNote />
              </Route>
              <Route path="/credit-notes/:noteNumber" exact>
                <CreditNoteDetails />
              </Route>
              <Route path="/update-credit-note/:noteNumber" exact>
                <UpdateCreditNote />
              </Route>

              <Route path="/quotes" exact>
                <Quotes />
              </Route>
              <Route path="/quotation/new-quotation" exact>
                <Quotation />
              </Route>
              <Route path="/quotes/:quoteNumber" exact>
                <QuoteDetails />
              </Route>
              <Route path="/update-quotation/:quoteNumber" exact>
                <UpdateQuotation />
              </Route>

              <Route path="/customers" exact>
                <CustomersPage />
              </Route>
              <Route path="/customer/new-customer" exact>
                <NewCustomerForm/>
              </Route>
              <Route path="/customers/:customerNumber" exact>
                <CustomerDetails />
              </Route>
              <Route path="/update-customer/:customerNumber" exact>
                <UpdateCustomer />
              </Route>

              <Route path="/purchase-receipts" exact>
                <PurchaseReceipts />
              </Route>
              <Route path="/purchase-receipt/new-purchase-receipt" exact>
                <CashPurchase />
              </Route>
              <Route path="/purchase-receipts/:receiptNumber" exact>
                <PurchaseReceiptDetails />
              </Route>
              <Route path="/update-purchase-receipt/:receiptNumber" exact>
                <UpdatePurchaseReceipt />
              </Route>

              <Route path="/purchase-invoices" exact>
                <PurchaseInvoices />
              </Route>
              <Route path="/purchase-invoice/new-purchase-invoice" exact>
                <PurchaseInvoice />
              </Route>
              <Route path="/purchase-invoices/:invoiceNumber" exact>
                <PurchaseInvoiceDetails />
              </Route>
              <Route path="/update-purchase-invoice/:invoiceNumber" exact>
                <UpdatePurchaseInvoice />
              </Route>

              <Route path="/purchase-orders" exact>
                <PurchaseOrders />
              </Route>
              <Route path="/purchase-order/new-purchase-order" exact>
                <PurchaseOrder />
              </Route>
              <Route path="/purchase-orders/:orderNumber" exact>
                <PurchaseOrderDetails />
              </Route>
              <Route path="/update-purchase-order/:orderNumber" exact>
                <UpdatePurchaseOrder />
              </Route>

              <Route path="/purchase-returns" exact>
                <PurchaseReturnsPage />
              </Route>
              <Route path="/purchase-return/new-purchase-return" exact>
                <PurchaseReturns />
              </Route>
              <Route path="/purchase-returns/:returnNumber" exact>
                <PurchaseReturnDetails />
              </Route>
              <Route path="/update-purchase-return/:returnNumber" exact>
                <UpdatePurchaseReturns />
              </Route>

              <Route path="/inventories" exact>
                <InventoriesPage/>
              </Route>
              <Route path="/inventories/:productNumber" exact>
                <InventoryPage/>
              </Route>

              <Route path="/purchases" exact>
                <Purchases />
              </Route>

              <Route path="/suppliers" exact>
                <SuppliersPage />
              </Route>
              <Route path="/supplier/new-supplier" exact>
                <NewSupplierForm />
              </Route>
              <Route path="/suppliers/:supplierNumber" exact>
                <SupplierDetails />
              </Route>
              <Route path="/update-supplier/:supplierNumber" exact>
                <UpdateSupplier />
              </Route>

              <Route path="/payments/customer-payment">
                <ReceivePayment />
              </Route>
              <Route path="/payments/supplier-payment">
                <MakePayment />
              </Route>

              <Route path="/expenses" exact>
                <ExpensesPage />
              </Route>
              <Route path="/expenses/new-expense" exact>
                <NewExpense />
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
              <Route path="/reports/sales-by-product" exact>
                <SalesByProduct/>
              </Route>
              <Route path="/reports/sales-by-customer" exact>
                <SalesByCustomer/>
              </Route>
              <Route path="/reports/sales-returns-report" exact>
                <SalesReturnsReport/>
              </Route>
              <Route path="/reports/inventory-summary" exact>
                <InventorySummary/>
              </Route>
              <Route path="/reports/stock-summary-report" exact>
                <StockSummaryReport/>
              </Route>
              <Route path="/reports/customer-balances" exact>
                <CustomerBalances/>
              </Route>
              <Route path="/reports/unpaid-invoices" exact>
                <UnpaidInvoices/>
              </Route>
              <Route path="/reports/supplier-balances" exact>
                <SupplierBalances/>
              </Route>
              <Route path="/reports/unpaid-supplier-invoices" exact>
                <UnpaidPurchaseInvoices/>
              </Route>
              <Route path="/reports/purchases-by-product" exact>
                <PurchasesByProduct/>
              </Route>
              <Route path="/reports/purchases-by-supplier" exact>
                <PurchasesBySupplier/>
              </Route>
              <Route path="/other-expenses-summary" exact>
                <OtherExpensesSummary/>
              </Route>
              <Route path="/reports/customer-payments" exact>
                <CustomerPayments/>
              </Route>
              <Route path="/reports/supplier-payments" exact>
                <SupplierPayments/>
              </Route>

              <Route path="/reports/income-statement" exact>
                <IncomeStatement/>
              </Route>
              <Route path="/reports/balance-sheet" exact>
                <BalanceSheet/>
              </Route>

              <Route path="/users/:userID/account-settings" exact>
                <AccountSettingsPage/>
              </Route>

              <Route path="/reviews" exact>
                <ReviewsPage/>
              </Route>

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
                  alert && 
                  <Alert
                    alert={alert}
                    message={alertMessage}
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
