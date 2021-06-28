import React, { useState, useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import './CustomerDetails.css'
import Barchart from './Barchart'
import PurchaseInvoice from './PurchaseInvoice';
import CashPurchase from './CashPurchase';
import MakePayment from './MakePayment';
import PurchaseOrder from './PurchaseOrder';
import NewSupplierForm from './NewSupplierForm'
import PurchaseReturns from './PurchaseReturns'
import Alert from './Alert'

function SupplierDetails() {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [fetching, setFetching] = useState(true)
    const [newSupplier, setNewSupplier] = useState(false)
    const [purchaseInvoice, setPurchaseInvoice] = useState(false)
    const [cashPurchase, setCashPurchase] = useState(false)
    const [purchaseOrder, setPurchaseOrder] = useState(false)
    const [makePayment, setMakePayment] = useState(false)
    const [purchaseReturn, setPurchaseReturn] = useState(false)
    const [viewPurchaseInvoices, setViewPurchaseInvoices] = useState(false)
    const [viewCashPurchases, setViewCashPurchases] = useState(false)
    const [viewPurchaseOrders, setViewPurchaseOrders] = useState(false)
    const [viewPurchaseReturns, setViewPurchaseReturns] = useState(false)
    const [overview, setOverview] = useState(true)


    const [purchaseInvoices, setPurchaseInvoices] = useState([])
    const [cashPurchases, setCashPurchases] = useState([])
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [purchaseReturns, setPurchaseReturns] = useState([])
    const [purchases, setPurchases] = useState([])
    const [creditors, setCreditors] = useState([])
    const [invoiceAdditions, setinvoiceAdditions] = useState([])
    const [receiptAdditions, setReceiptAdditions] = useState([])
    const [creditNoteAdditions, setCreditNoteAdditions] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [buttonClicked, setButtonClicked] = useState('overview')

    const history = useHistory()
    const params = useParams()
    const element = suppliers?.filter(a => a.name === params.supplierName)

    useEffect(async () => {
        const request1 = baseURL.get(`/suppliers/${params.supplierName}`);
        const request2 = baseURL.get('/suppliers')
        let unMounted = false;
        let source = axios.CancelToken.source();
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
            .then(res => {
                const [result1, result2] = res
                setPurchaseInvoices(result1.data.purchaseInvoices)
                setCashPurchases(result1.data.cashPurchases)
                setPurchaseOrders(result1.data.purchaseOrders)
                setPurchaseReturns(result1.data.purchaseReturns)
                setPurchases(result1.data.purchases)
                setCreditors(result1.data.creditorList)
                setinvoiceAdditions(result1.data.purchaseInvoices.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)));
                setReceiptAdditions(result1.data.cashPurchases.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)));
                setCreditNoteAdditions(result1.data.purchaseReturns.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)))
                setSuppliers(result2.data.suppliers)
                setFetching(false)
            })
            .catch(err => {
                if (!unMounted) {
                    if (axios.isCancel(err)) {
                        console.log('Request Cancelled');
                    } else {
                        console.log('Something went wrong');
                    }
                }
            })
        return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])



    let jan = []
    let feb = []
    let mar = []
    let apr = []
    let may = []
    let jun = []
    let jul = []
    let aug = []
    let sept = []
    let oct = []
    let nov = []
    let dec = []

    purchases.filter(purchase => {
        const month = new Date(purchase.date).getMonth()
        switch (month) {
            case 0:
                jan.push(purchase.amount)
                break;

            case 1:
                feb.push(purchase.amount)
                break;

            case 2:
                mar.push(purchase.amount)
                break;

            case 3:
                apr.push(purchase.amount)
                break;

            case 4:
                may.push(purchase.amount)
                break;

            case 5:
                jun.push(purchase.amount)
                break;

            case 6:
                jul.push(purchase.amount)
                break;

            case 7:
                aug.push(purchase.amount)
                break;

            case 8:
                sept.push(purchase.amount)
                break;

            case 9:
                oct.push(purchase.amount)
                break;

            case 10:
                nov.push(purchase.amount)
                break;

            case 11:
                dec.push(purchase.amount)
                break;


            default: return null
                break;
        }
    })

    jan = jan.reduce((a, b) => a + b, 0)
    feb = feb.reduce((a, b) => a + b, 0)
    mar = mar.reduce((a, b) => a + b, 0)
    apr = apr.reduce((a, b) => a + b, 0)
    may = may.reduce((a, b) => a + b, 0)
    jun = jun.reduce((a, b) => a + b, 0)
    jul = jul.reduce((a, b) => a + b, 0)
    aug = aug.reduce((a, b) => a + b, 0)
    sept = sept.reduce((a, b) => a + b, 0)
    oct = oct.reduce((a, b) => a + b, 0)
    nov = nov.reduce((a, b) => a + b, 0)
    dec = dec.reduce((a, b) => a + b, 0)

let credit1 = []; let cash1 = [];
let credit2 = []; let cash2 = [];
let credit3 = []; let cash3 = [];
let credit4 = []; let cash4 = [];
let credit5 = []; let cash5 = [];
let credit6 = []; let cash6 = [];
let credit7 = []; let cash7 = [];
let credit8 = []; let cash8 = [];
let credit9 = []; let cash9 = [];
let credit10 = []; let cash10 = [];
let credit11 = []; let cash11 = [];
let credit12 = []; let cash12 = [];

purchaseInvoices?.filter(purchase => {
        const month = new Date(purchase.invoiceInput?.date).getMonth()
        switch (month) {
            case 0:
                credit1.push(purchase.netPayable)
                break;

            case 1:
                credit2.push(purchase.netPayable)
                break;

            case 2:
                credit3.push(purchase.netPayable)
                break;

            case 3:
                credit4.push(purchase.netPayable)
                break;

            case 4:
                credit5.push(purchase.netPayable)
                break;

            case 5:
                credit6.push(purchase.netPayable)
                break;

            case 6:
                credit7.push(purchase.netPayable)
                break;

            case 7:
                credit8.push(purchase.netPayable)
                break;

            case 8:
                credit9.push(purchase.netPayable)
                break;

            case 9:
                credit10.push(purchase.netPayable)
                break;

            case 10:
                credit11.push(purchase.netPayable)
                break;

            case 11:
                credit12.push(purchase.netPayable)
                break;


            default: return null
                break;
        }
    })

    cashPurchases?.filter(purchase => {
        const month = new Date(purchase.receiptInput?.date).getMonth()
        switch (month) {
            case 0:
                cash1.push(purchase.netPayable)
                break;

            case 1:
                cash2.push(purchase.netPayable)
                break;

            case 2:
                cash3.push(purchase.netPayable)
                break;

            case 3:
                cash4.push(purchase.netPayable)
                break;

            case 4:
                cash5.push(purchase.netPayable)
                break;

            case 5:
                
                cash6.push(purchase.netPayable)
                break;
                

            case 6:
                cash7.push(purchase.netPayable)
                break;

            case 7:
                cash8.push(purchase.netPayable)
                break;

            case 8:
                cash9.push(purchase.netPayable)
                break;

            case 9:
                cash10.push(purchase.netPayable)
                break;

            case 10:
                cash11.push(purchase.netPayable)
                break;

            case 11:
                cash12.push(purchase.netPayable)
                break;


            default: return null
                break;
        }
    })
const janCash1 = cash1.reduce((a,b) => Number(a) + Number(b), 0)
const janCash2 = cash2.reduce((a,b) => Number(a) + Number(b), 0)
const janCash3 = cash3.reduce((a,b) => Number(a) + Number(b), 0)
const janCash4 = cash4.reduce((a,b) => Number(a) + Number(b), 0)
const janCash5 = cash5.reduce((a,b) => Number(a) + Number(b), 0)
const janCash6 = cash6.reduce((a,b) => Number(a) + Number(b), 0)
const janCash7 = cash7.reduce((a,b) => Number(a) + Number(b), 0)
const janCash8 = cash8.reduce((a,b) => Number(a) + Number(b), 0)
const janCash9 = cash9.reduce((a,b) => Number(a) + Number(b), 0)
const janCash10 = cash10.reduce((a,b) => Number(a) + Number(b), 0)
const janCash11 = cash11.reduce((a,b) => Number(a) + Number(b), 0)
const janCash12 = cash12.reduce((a,b) => Number(a) + Number(b), 0)

const janCredit1 = credit1.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit2 = credit2.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit3 = credit3.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit4 = credit4.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit5 = credit5.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit6 = credit6.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit7 = credit7.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit8 = credit8.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit9 = credit9.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit10 = credit10.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit11 = credit11.reduce((a,b) => Number(a) + Number(b), 0)
const janCredit12 = credit12.reduce((a,b) => Number(a) + Number(b), 0)

    const wrapper_Ref = useRef(null)

    const [styler, setStyler] = useState({
        transform: 'translateY(-5rem)',
        visibility: 'hidden'
    })
    const styles = {
        width: '100%',
        position: 'absolute',
        color: 'gray',
        fontWeight: '550',
        padding: '1rem',
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        transform : styler.transform,
        visibility : styler.visibility,
        transition: 'transform 0.5s ease',
    }

    const handleStyling = ()=>{
        styler.visibility === 'hidden' ? setStyler({transform: 'translateY(0)', visibility: 'visible'}) : setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
    }

    useEffect(() => {
            document.addEventListener('mousedown', handle_Click_Outside);

            return ()=>{
                document.removeEventListener('mousedown', handle_Click_Outside);
            }
        }, [])

        function handle_Click_Outside(e){
                const {current : wrap} = wrapper_Ref;
                if(wrap && !wrap.contains(e.target)){
                    setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
                }
        }




    return (
        <div className='CustomerDetails Invoices'>
            <div className="invoicesHeading">
                <h1>Supplier: {params.supplierName}</h1>
                <div className="moreOptions">
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                        <p className="option" onClick={()=>{setPurchaseInvoice(true)}}>Purchase Invoice</p>
                            <p className="option" onClick={()=>{setCashPurchase(true)}}>Purchase Receipt</p>
                            <p className="option" onClick={()=>{setMakePayment(true)}}>Make Payment</p>
                            <p className="option" onClick={()=>{setPurchaseOrder(true)}}>Purchase Order</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="filterContainer">
                <div className='filter'>
                        <button
                            className={buttonClicked === 'overview' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('overview')
                                setViewPurchaseInvoices(false)
                                setViewCashPurchases(false)
                                setViewPurchaseOrders(false)
                                setViewPurchaseReturns(false)
                                setOverview(true)
                            }}
                        >
                            Overview
                                </button>

                        <button
                            className={buttonClicked === 'View Invoices' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('View Invoices')
                                setViewCashPurchases(false)
                                setViewPurchaseOrders(false)
                                setViewPurchaseReturns(false)
                                setOverview(false)
                                setViewPurchaseInvoices(true)
                            }}
                        >
                            All Invoices
                                </button>

                        <button
                            className={buttonClicked === 'View Receipts' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('View Receipts')
                                setViewPurchaseOrders(false)
                                setViewPurchaseReturns(false)
                                setOverview(false)
                                setViewPurchaseInvoices(false)
                                setViewCashPurchases(true)
                            }}
                        >
                            Cash Purchases
                                </button>

                        <button
                            className={buttonClicked === 'View Quotation' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('View Quotation')
                                setViewPurchaseReturns(false)
                                setOverview(false)
                                setViewPurchaseInvoices(false)
                                setViewCashPurchases(false)
                                setViewPurchaseOrders(true)
                            }}
                        >
                            Purchase Orders
                        </button>

                        <button
                            className={buttonClicked === 'View CreditNote' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('View CreditNote');
                                setOverview(false)
                                setViewPurchaseInvoices(false)
                                setViewCashPurchases(false)
                                setViewPurchaseOrders(false)
                                setViewPurchaseReturns(true)
                            }}
                        >
                            Purchase Returns
                        </button>
                </div>
            </div>

            {
                overview &&
                <div className="customerBodyELements">
                {
                    element?.map(e => (
                        <div className="customerDetailsInfo">
                            <i class="fas fa-user-circle fa-5x"></i>
                            <div className="customerName group">
                                <h2>Name: {e.name}</h2>
                                {
                                    creditors.map(credit => (
                                        <p className="balanceDue">
                                            Total Credit: {credit.balanceDue}
                                        </p>
                                    ))
                                }
                            </div>
                            <div className="contactInfos group">
                                <h3 className='customerDetail'><u>Contact Info</u></h3>
                                <p className='customerDetail'><span>Email:</span>{e.email}</p>
                                <p className='customerDetail'><span>Tel:</span>{e.telephone}</p>
                                <p className='customerDetail'><span>Mobile:</span>{e.mobile}</p>
                                <p className='customerDetail'><span>P.O Box: </span>{e.fax}</p>
                            </div>

                            <div className="addressInfos group">
                                <h3 className='customerDetail'><u>Address Info</u></h3>
                                <p className='customerDetail'><span>Country:</span> {e.country}</p>
                                <p className='customerDetail'><span>City:</span> {e.city}</p>
                                <p className='customerDetail'><span>Street:</span> {e.street}</p>
                            </div>
                        </div>
                    ))
                }

                {
                    purchases.length > 0 ? <div className="recentAndBarChart">
                        <div className="recentTransactions">
                            <div className="totalPurchases">
                                <p><b>Total Credits</b></p>
                                <p>{((purchaseInvoices?.map(item => item.netPayable).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="totalPurchases">
                                <p><b>Total Cash</b></p>
                                <p>{((cashPurchases?.map(item => item.netPayable).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="totalPurchases">
                                <p><b>Total Paid To</b></p>
                                <p>{((creditors?.map(item => item.totalPaid).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="totalPurchases">
                                <p><b>Balance Owed To</b></p>
                                <p>{((creditors?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            
                        </div>

                        <div className="barChartChart">
                            <Barchart
                            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}
                            data3={
                                [jan, feb, mar, apr, may, jun, jul, aug, sept, oct, nov, dec]
                            }
                            tooltip3={`Total Purchases`}
                            data1={
                                [janCredit1, janCredit2, janCredit3, janCredit4, janCredit5, janCredit6, janCredit7, janCredit8, janCredit9, janCredit10, janCredit11, janCredit12]
                            }
                            tooltip1={`Credit Purchases`}
                            data2={
                                [janCash1, janCash2, janCash3, janCash4, janCash5, janCash6, janCash7, janCash8, janCash9, janCash10, janCash11, janCash12]
                            }
                            tooltip2={`Cash Purchases`}
                            />
                        </div>

                    </div> : <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }
            </div>
            }

            <div className='allDebtorsContainer'>
                    {
                        viewPurchaseInvoices &&
                            purchaseInvoices.length > 0 ? <table className="allDebtorsTable">
                                <thead>
                                    <tr className='invoiceListHead'>
                                        <th>Date</th>
                                        <th>Invoice Term</th>
                                        <th>Due Date</th>

                                        <th>Invoice Number</th>
                                        <th>Gross Amount</th>
                                        <th>Total Discounts</th>
                                        <th>VAT</th>
                                        <th>Other Additions</th>
                                        <th>Net Payable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        purchaseInvoices.map((invoice, index) => (
                                            <tr className='invoiceListbody invoiceDetail' onClick={()=>{history.push(`/purchase-invoices/${invoice._id}`)}}>
                                                <td>{new Date(invoice.invoiceInput.date).toLocaleDateString()}</td>
                                                <td>{invoice.selectInvoiceTerm} days</td>
                                                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                                <td>{invoice.invoiceInput.invoiceNumber}</td>
                                                <td>{(invoice.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(Number(invoice.discountsAndVat.rebateValue) + Number(invoice.discountsAndVat.tradeDiscountValue) + Number(invoice.discountsAndVat.cashDiscountValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(invoice.discountsAndVat.valueAddedTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(invoiceAdditions[index])?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{((invoice.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : viewPurchaseInvoices && <h2 className='noData'>No Invoices To Display. Please Record Transactions</h2>
                    }

                    {
                        viewCashPurchases &&
                            cashPurchases.length > 0 ?
                            <table className="allDebtorsTable">
                                <thead>
                                    <tr className='invoiceListHead'>
                                        <th>Date</th>
                                        <th>Receipt Number</th>
                                        <th>Gross Amount</th>
                                        <th>Total Discounts</th>
                                        <th>VAT</th>
                                        <th>Other Additions</th>
                                        <th>Net Payable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        cashPurchases.map((receipt, index) => (
                                            <tr className='receiptListbody invoiceDetail' onClick={()=>{history.push(`/purchase-receipts/${receipt._id}`)}}>
                                                <td>{receipt.receiptInput.date}</td>
                                                <td>{receipt.receiptInput.receiptNumber}</td>
                                                <td>{(receipt.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(Number(receipt.discountsAndVat.rebateValue) + Number(receipt.discountsAndVat.tradeDiscountValue) + Number(receipt.discountsAndVat.cashDiscountValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(receipt.discountsAndVat.valueAddedTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(receiptAdditions[index])?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(receipt.netPayable).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : viewCashPurchases && <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }

                    {
                        viewPurchaseReturns &&
                            purchaseReturns.length > 0 ?
                            <table className="allDebtorsTable">
                                <thead>
                                    <tr className='invoiceListHead'>
                                        <th>Date</th>

                                        <th>Return Number</th>
                                        <th>Gross Amount</th>
                                        <th>Total Discounts</th>
                                        <th>VAT</th>
                                        <th>Other Additions</th>
                                        <th>Net Payable</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        purchaseReturns.map((returns, index) => (
                                            <tr className='noteListbody invoiceDetail' onClick={()=>{history.push(`/purchase-returns/${returns._id}`)}}>
                                                <td>{returns.returnsInput.date}</td>
                                                <td>{returns.returnsInput.returnNumber}</td>
                                                <td>{(returns.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(Number(returns.discountsAndVat.rebateValue) + Number(returns.discountsAndVat.tradeDiscountValue) + Number(returns.discountsAndVat.cashDiscountValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(returns.discountsAndVat.valueAddedTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(creditNoteAdditions[index])?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{((returns.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : viewPurchaseReturns && <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }

                    {
                        viewPurchaseOrders &&
                            purchaseOrders.length > 0 ?
                            <table className="allDebtorsTable">
                                <thead>
                                    <tr className='invoiceListHead'>
                                        <th>Date</th>

                                        <th>Order Number</th>
                                        <th>Gross Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        purchaseOrders.map((order, index) => (
                                            <tr className='quoteListbody invoiceDetail' onClick={()=>{history.push(`/purchase-orders/${order._id}`)}}>
                                                <td>{order.orderInput.date}</td>
                                                <td>{order.orderInput.orderNumber}</td>
                                                <td>{(order.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : viewPurchaseOrders && <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }

                </div>


            {
                purchaseInvoice && <PurchaseInvoice
                    onClick={() => { setPurchaseInvoice(false) }}
                    refetch={()=>{
                        setAlertMessage('Purchase Invoice Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            {
                cashPurchase && <CashPurchase
                    onClick={() => {
                        setCashPurchase(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Purchase Receipt Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            {
                makePayment && <MakePayment
                    onClick={() => {
                        setMakePayment(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Supplier Payment Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            {
                purchaseOrder && <PurchaseOrder
                    onClick={() => {
                        setPurchaseOrder(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Purchase Order Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            {
                purchaseReturn && <PurchaseReturns
                    onClick={() => {
                        setPurchaseReturn(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Purchase Returns Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }

            {
                fetching && <Loader />
            }

            {
                newSupplier && <NewSupplierForm
                    onClick={() => {
                        setNewSupplier(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Supplier Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default SupplierDetails
