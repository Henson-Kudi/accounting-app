import React, {useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import Loader from './Loader'
import './CustomerDetails.css'
import Barchart from './Barchart'
import Invoice from './Invoice';
import Receipt from './Receipt';
import ReceivePayment from './ReceivePayment';
import Quotation from './Quotation';
import NewCustomerForm from './NewCustomerForm'
import CreditNote from './CreditNote'
import Alert from './Alert'

function CustomerDetails() {
    const [fetching, setFetching] = useState(true)
    const [newCustomer, setNewCustomer] = useState(false)
    const [invoice, setInvoice] = useState(false)
    const [receipt, setReceipt] = useState(false)
    const [quotation, setQuotation] = useState(false)
    const [receivePayment, setReceivePayment] = useState(false)
    const [creditNote, setCreditNote] = useState(false)
    const [viewInvoices, setViewInvoices] = useState(false)
    const [viewReceipts, setViewReceipts] = useState(false)
    const [viewQuotations, setViewQuotations] = useState(false)
    const [viewCreditNotes, setViewCreditNotes] = useState(false)
    const [overview, setOverview] = useState(true)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')


    const [invoices, setInvoices] = useState([])
    const [receipts, setReceipts] = useState([])
    const [quotations, setQuotations] = useState([])
    const [creditNotes, setCreditNotes] = useState([])
    const [sales, setSales] = useState([])
    const [debtors, setDebtors] = useState([])
    const [invoiceAdditions, setinvoiceAdditions] = useState([])
    const [receiptAdditions, setReceiptAdditions] = useState([])
    const [creditNoteAdditions, setCreditNoteAdditions] = useState([])
    const [customers, setCustomers] = useState([])
    const [buttonClicked, setButtonClicked] = useState('overview')

    const wrapperRef = useRef(null)
    const params = useParams()
    const history = useHistory()
    const element = customers?.filter(a => a.name === params.customerName)

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

    sales?.filter(item => item.saleType !== 'sales returns').filter( sale => {
        const month = new Date(sale.date).getMonth()
        switch (month) {
            case 0:
                jan.push(sale.amount)
                break;
            
            case 1:
                feb.push(sale.amount)
                break;

            case 2:
                mar.push(sale.amount)
                break;

            case 3:
                apr.push(sale.amount)
                break;

            case 4:
                may.push(sale.amount)
                break;

            case 5:
                jun.push(sale.amount)
                break;

            case 6:
                jul.push(sale.amount)
                break;

            case 7:
                aug.push(sale.amount)
                break;

            case 8:
                sept.push(sale.amount)
                break;

            case 9:
                oct.push(sale.amount)
                break;

            case 10:
                nov.push(sale.amount)
                break;
        
            case 11:
                dec.push(sale.amount)
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

    useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);

            return ()=>{
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [])

        function handleClickOutside(e){
            const {current : wrap} = wrapperRef;
            if(wrap && !wrap.contains(e.target)){
                setNewCustomer(false);
            }
        }
        
    useEffect(async ()=>{
        const request1 = baseURL.get(`/customers/${params.customerName}`);
        const request2 = baseURL.get('/customers')
        let unMounted = false;
        let source = axios.CancelToken.source();
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
        .then(res => {
            const [result1, result2] = res
            setInvoices(result1.data.invoices)
            setReceipts(result1.data.receipts)
            setQuotations(result1.data.quotations)
            setCreditNotes(result1.data.creditNotes)
            setSales(result1.data.sales)
            setDebtors(result1.data.debtorList)
            setinvoiceAdditions(result1.data.invoices.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)));
            setReceiptAdditions(result1.data.receipts.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)));
            setCreditNoteAdditions(result1.data.creditNotes.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)))
            setCustomers(result2.data.customers)
            setFetching(false)
        })
        .catch(err =>{
            if (!unMounted) {
                if (axios.isCancel(err)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        })
        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

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

    invoices?.filter(invoice => {
        const month = new Date(invoice.invoiceInput?.date).getMonth()
        switch (month) {
            case 0:
                credit1.push(invoice.netPayable)
                break;

            case 1:
                credit2.push(invoice.netPayable)
                break;

            case 2:
                credit3.push(invoice.netPayable)
                break;

            case 3:
                credit4.push(invoice.netPayable)
                break;

            case 4:
                credit5.push(invoice.netPayable)
                break;

            case 5:
                credit6.push(invoice.netPayable)
                break;

            case 6:
                credit7.push(invoice.netPayable)
                break;

            case 7:
                credit8.push(invoice.netPayable)
                break;

            case 8:
                credit9.push(invoice.netPayable)
                break;

            case 9:
                credit10.push(invoice.netPayable)
                break;

            case 10:
                credit11.push(invoice.netPayable)
                break;

            case 11:
                credit12.push(invoice.netPayable)
                break;


            default: return null
                break;
        }
    })

    receipts?.filter(invoice => {
        const month = new Date(invoice.receiptInput?.date).getMonth()
        switch (month) {
            case 0:
                cash1.push(invoice.netPayable)
                break;

            case 1:
                cash2.push(invoice.netPayable)
                break;

            case 2:
                cash3.push(invoice.netPayable)
                break;

            case 3:
                cash4.push(invoice.netPayable)
                break;

            case 4:
                cash5.push(invoice.netPayable)
                break;

            case 5:
                
                cash6.push(invoice.netPayable)
                break;
                

            case 6:
                cash7.push(invoice.netPayable)
                break;

            case 7:
                cash8.push(invoice.netPayable)
                break;

            case 8:
                cash9.push(invoice.netPayable)
                break;

            case 9:
                cash10.push(invoice.netPayable)
                break;

            case 10:
                cash11.push(invoice.netPayable)
                break;

            case 11:
                cash12.push(invoice.netPayable)
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
                <h1>Customer: {params.customerName}</h1>
                <div className="moreOptions">
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                        <p className="option" onClick={()=>{setInvoice(true)}}>Invoice</p>
                            <p className="option" onClick={()=>{setReceipt(true)}}>Receipt</p>
                            <p className="option" onClick={()=>{setReceivePayment(true)}}>Receive Payment</p>
                            <p className="option" onClick={()=>{setCreditNote(true)}}>Credit Note</p>
                            <p className="option" onClick={()=>{setQuotation(true)}}>Quotation</p>
                            <p className="option" onClick={()=>{setNewCustomer(true)}}>New Customer</p>
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
                                setViewInvoices(false)
                                setViewReceipts(false)
                                setViewQuotations(false)
                                setViewCreditNotes(false)
                                setOverview(true)
                            }}
                        >
                            Overview
                                </button>

                        <button
                            className={buttonClicked === 'View Invoices' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('View Invoices')
                                setViewReceipts(false)
                                setViewQuotations(false)
                                setViewCreditNotes(false)
                                setOverview(false)
                                setViewInvoices(true)
                            }}
                        >
                            All Invoices
                                </button>

                        <button
                            className={buttonClicked === 'View Receipts' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('View Receipts')
                                setViewQuotations(false)
                                setViewCreditNotes(false)
                                setOverview(false)
                                setViewInvoices(false)
                                setViewReceipts(true)
                            }}
                        >
                            Receipts
                                </button>

                        <button
                            className={buttonClicked === 'View Quotation' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('View Quotation')
                                setViewCreditNotes(false)
                                setOverview(false)
                                setViewInvoices(false)
                                setViewReceipts(false)
                                setViewQuotations(true)
                            }}
                        >
                            Quotations
                        </button>

                        <button
                            className={buttonClicked === 'View CreditNote' ? 'button' : 'btn'}
                            onClick={() => {
                                setButtonClicked('View CreditNote');
                                setOverview(false)
                                setViewInvoices(false)
                                setViewReceipts(false)
                                setViewQuotations(false)
                                setViewCreditNotes(true)
                            }}
                        >
                            Credit Notes
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
                                    debtors?.map(debt => (
                                        <p className="balanceDue">
                                            Total Debt: {(Number(debt.balanceDue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                    sales.length > 0 ? <div className="recentAndBarChart">
                        <div className="recentTransactions">
                            <div className="totalPurchases">
                                <p><b>Total Credits</b></p>
                                <p>{((invoices?.map(item => item.netPayable).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="totalPurchases">
                                <p><b>Total Cash</b></p>
                                <p>{((receipts?.map(item => item.netPayable).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="totalPurchases">
                                <p><b>Total Received</b></p>
                                <p>{((debtors?.map(item => item.totalPaid).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="totalPurchases">
                                <p><b>Balance Owed</b></p>
                                <p>{((debtors?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            
                        </div>

                        <div className="barChartChart">
                            <Barchart
                            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}
                            data3={
                                [jan, feb, mar, apr, may, jun, jul, aug, sept, oct, nov, dec]
                            }
                            tooltip3={`Total Sales`}
                            data1={
                                [janCredit1, janCredit2, janCredit3, janCredit4, janCredit5, janCredit6, janCredit7, janCredit8, janCredit9, janCredit10, janCredit11, janCredit12]
                            }
                            tooltip1={`Credit Sales`}
                            data2={
                                [janCash1, janCash2, janCash3, janCash4, janCash5, janCash6, janCash7, janCash8, janCash9, janCash10, janCash11, janCash12]
                            }
                            tooltip2={`Cash Sales`}
                            />
                        </div>

                    </div> : <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }
            </div>
            }

            <div className='allDebtorsContainer'>
                    {
                        viewInvoices &&
                            invoices.length > 0 ? <table className="allDebtorsTable">
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
                                        invoices?.map((invoice, index) => (
                                            <tr className='invoiceListbody invoiceDetail' onClick={()=>{history.push(`/invoices/${invoice._id}`)}}>
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
                            </table> : viewInvoices && <h2 className='noData'>No Invoices To Display. Please Record Transactions</h2>
                    }

                    {
                        viewReceipts &&
                            receipts.length > 0 ?
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
                                        receipts?.map((receipt, index) => (
                                            <tr className='receiptListbody invoiceDetail' onClick={()=>{history.push(`/receipts/${receipt._id}`)}}>
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
                            </table> : viewReceipts && <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }

                    {
                        viewCreditNotes &&
                            creditNotes.length > 0 ?
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
                                        creditNotes.map((note, index) => (
                                            <tr className='noteListbody invoiceDetail' onClick={()=>{history.push(`/credit-notes/${note._id}`)}}>
                                                <td>{note.noteInput.date}</td>
                                                <td>{note.noteInput.returnNumber}</td>
                                                <td>{(note.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(Number(note.discountsAndVat.rebateValue) + Number(note.discountsAndVat.tradeDiscountValue) + Number(note.discountsAndVat.cashDiscountValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(note.discountsAndVat.valueAddedTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(creditNoteAdditions[index])?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{((note.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : viewCreditNotes && <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }

                    {
                        viewQuotations &&
                            quotations.length > 0 ?
                            <table className="allDebtorsTable">
                                <thead>
                                    <tr className='invoiceListHead'>
                                        <th>Date</th>

                                        <th>Quote Number</th>
                                        <th>Gross Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        quotations.map((quote, index) => (
                                            <tr className='quoteListbody' onClick={()=>{history.push(`/quotes/${quote._id}`)}}>
                                                <td>{quote.quoteInput.date}</td>
                                                <td>{quote.quoteInput.quoteNumber}</td>
                                                <td>{(quote.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : viewQuotations && <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }

                </div>


            {
                invoice && <Invoice
                    onClick={() => { setInvoice(false) }}
                    refetch={()=>{
                        setAlertMessage('Sales Invoice Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            {
                receipt && <Receipt
                    onClick={() => {
                        setReceipt(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Sales Receipt Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            {
                receivePayment && <ReceivePayment
                    onClick={() => {
                        setReceivePayment(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Customer Payment Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            {
                quotation && <Quotation
                    onClick={() => {
                        setQuotation(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Quotation Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            {
                creditNote && <CreditNote
                    onClick={() => {
                        setCreditNote(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Sales Returns Added Successfully')
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
                newCustomer && <div ref={wrapperRef}>
                    <NewCustomerForm
                    onClick={() => {
                        setNewCustomer(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Customer Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                    />
                </div>
            }
        </div>
    )
}

export default CustomerDetails
