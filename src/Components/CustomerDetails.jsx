import React, {useState, useEffect, useRef} from 'react'
import {useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
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

function CustomerDetails() {
    const [fetching, setFetching] = useState(true)
    const [transactionOptions, setTransactionOptions] =useState(false)
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

    sales.filter( sale => {
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
                setTransactionOptions(false);
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

    
    
    return (
        <div className='CustomerDetails'>
            <div className="salesTop homeAndPrint">
                    <div className='salesOptionsLeft'>
                        <Link to='/' className='button'>Home</Link>

                        <div className='salesTransactions' ref={wrapperRef}>
                                <button onClick={()=>{setTransactionOptions(!transactionOptions)}} className='button'>New Transaction <i className="fas fa-angle-down"></i></button>
                                {
                                    transactionOptions && 
                                    <ul className='transactionOptions'>
                                        <li className='transactionOption' onClick={()=>{setNewCustomer(true)}}>Add Customer</li>
                                        <li className='transactionOption' onClick={()=>{setInvoice(true)}}>Invoice</li>
                                        <li className='transactionOption' onClick={()=>{setReceipt(true)}}>Receipt</li>
                                        <li className='transactionOption' onClick={()=>{setReceivePayment(true)}}>Receive Payment</li>
                                        <li className='transactionOption' onClick={()=>{setQuotation(true)}}>Quotation</li>
                                        <li className='transactionOption' onClick={()=>{setCreditNote(true)}}>Credit Note</li>
                                    </ul>
                                }
                            </div>
                    </div>

                    <div className="salesOptionsRight">
                        <button className='button' onClick={async()=>{
                            setViewInvoices(true)
                            setViewReceipts(true)
                            setViewQuotations(true)
                            setViewCreditNotes(true)
                            setOverview(true)
                            await setTimeout(()=>{
                                window.print()
                            }, 1000)
                            setTimeout(()=>{
                                setViewInvoices(false)
                                setViewReceipts(false)
                                setViewQuotations(false)
                                setViewCreditNotes(false)
                                setButtonClicked('overview')
                            }, 2000)
                        }}>Print Page</button>
                    </div>
                </div>
        {
                    element.map(e => (
            <div className="customerDetailsInfo">
                        <div className="customerName">
                            <h2>Customer: {e.name}</h2>
                            {
                                debtors.map(deb =>(
                                    <p className="balanceDue">
                                        Total Debt: {deb.balanceDue}
                                    </p>
                                ))
                            }
                        </div>
                        <div className="contactInfos">
                            <h3 className='customerDetail'>Contact Info</h3>
                            <p className='customerDetail'><span>Email:</span>{e.email}</p>
                            <p className='customerDetail'><span>Tel:</span>{e.tel}</p>
                            <p className='customerDetail'><span>Mobile:</span>{e.mobile}</p>
                            <p className='customerDetail'><span>P.O Box: </span>{e.fax}</p>
                        </div>

                        <div className="addressInfos">
                            <h3 className='customerDetail'>Address Info</h3>
                            <p className='customerDetail'><span>Country:</span> {e.country}</p>
                            <p className='customerDetail'><span>City:</span> {e.city}</p>
                            <p className='customerDetail'><span>Street:</span> {e.street}</p>
                        </div>
            </div>
            ))
                }

                <div className="filter">
                            <button
                            className={buttonClicked === 'overview' ? 'button' : 'btn'}
                            onClick={()=>{
                                setButtonClicked('overview')
                                setViewInvoices(false)
                                setViewReceipts(false)
                                setViewQuotations(false)
                                setOverview(true)
                                setViewCreditNotes(false)
                            }}
                            >
                                Overview
                            </button>

                            <button
                            className={buttonClicked === 'View Invoices' ? 'button' : 'btn'}
                            onClick={()=>{
                                setButtonClicked('View Invoices')
                                setViewInvoices(true)
                                setViewReceipts(false)
                                setViewQuotations(false)
                                setOverview(false)
                                setViewCreditNotes(false)
                            }}
                            >
                                View Invoices
                            </button>

                            <button
                            className={buttonClicked === 'View Receipts' ? 'button' : 'btn'}
                            onClick={()=>{
                                setButtonClicked('View Receipts')
                                setViewInvoices(false)
                                setViewReceipts(true)
                                setViewQuotations(false)
                                setOverview(false)
                                setViewCreditNotes(false)
                            }}
                            >
                                View Receipts
                            </button>

                            <button
                            className={buttonClicked === 'View Quotation' ? 'button' : 'btn'}
                            onClick={()=>{
                                setButtonClicked('View Quotation')
                                setViewInvoices(false)
                                setViewReceipts(false)
                                setViewQuotations(true)
                                setOverview(false)
                                setViewCreditNotes(false)
                            }}
                            >
                                View Quotations
                            </button>

                            <button
                            className={buttonClicked === 'View CreditNote' ? 'button' : 'btn'}
                            onClick={()=>{
                                setButtonClicked('View CreditNote');
                                setViewInvoices(false)
                                setViewReceipts(false)
                                setViewQuotations(false)
                                setOverview(false)
                                setViewCreditNotes(true)
                            }}
                            >
                                View Credit Notes
                            </button>
                    </div>

                    {
                        overview &&
                        sales.length > 0 ? <div className="recentAndBarChart">
                        <div className="recentTransactions">
                            <h5>Most Recent Transactions</h5>
                            {
                                sales.slice(sales.length - 5).map(sale => (
                                    
                                        <ul className='saleTran'>
                                            <li>{sale.date}</li>
                                            <li>{sale.saleType}</li>
                                            <li>{sale.amount}</li>
                                        </ul>
                                    
                                ))
                            }
                        </div>

                        <Barchart
                            labels = {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}
                            data={
                                [jan, feb,mar, apr, may, jun, jul, aug, sept, oct, nov, dec]
                            }
                            tooltip={`Sales Trend for customer ${params.customerName}`}
                        />

                    </div> : overview && <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
                    }

                    <div>
                        {
                            viewInvoices &&
                            invoices.length > 0 ? <table className="invoices buttonOptions">
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
                                invoices.map((invoice, index) => (
                                    <tr className='invoiceListbody'>
                                        <td>{invoice.invoiceInput.date}</td>
                                        <td>{invoice.selectInvoiceTerm} days</td>
                                        <td>{invoice.dueDate}</td>
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
                            <table className="invoices buttonOptions">
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
                                receipts.map((receipt, index) => (
                                    <tr className='receiptListbody'>
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
                        </table> : viewReceipts && <h2 className='noData'>No Receipts To Display. Please Record Transactions</h2>
                        }
                        
                        {
                            viewCreditNotes &&
                            creditNotes.length > 0 ?
                            <table className="invoices buttonOptions">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>

                                    <th>Note Number</th>
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
                                    <tr className='noteListbody'>
                                        <td>{note.noteInput.date}</td>
                                        <td>{note.noteInput.noteNumber}</td>
                                        <td>{(note.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{(Number(note.discountsAndVat.rebateValue) + Number(note.discountsAndVat.tradeDiscountValue) + Number(note.discountsAndVat.cashDiscountValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{(note.discountsAndVat.valueAddedTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{(creditNoteAdditions[index])?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{((note.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table> : viewCreditNotes && <h2 className='noData'>No Credit Notes To Display. Please Record Transactions</h2>
                        }

                        {
                            viewQuotations &&
                            quotations.length > 0 ?
                            <table className="invoices buttonOptions">
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
                                    <tr className='quoteListbody'>
                                        <td>{quote.quoteInput.date}</td>
                                        <td>{quote.quoteInput.quoteNumber}</td>
                                        <td>{(quote.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table> : viewQuotations && <h2 className='noData'>No Quotations To Display. Please Record Transactions</h2>
                        }

                    </div>

            <div>
            </div>

            {
                invoice && <Invoice
                    onClick={()=>{setInvoice(false)}}
                />
            }
            {
                receipt && <Receipt
                    onClick={()=>{
                        setReceipt(false)
                    }}
                />
            }
            {
                receivePayment && <ReceivePayment
                    onClick={()=>{
                        setReceivePayment(false)
                    }}
                />
            }
            {
                quotation && <Quotation
                    onClick={()=>{
                        setQuotation(false)
                    }}
                />
            }
            {
                creditNote && <CreditNote
                    onClick={()=>{
                        setCreditNote(false)
                    }}
                />
            }

            {
                fetching && <Loader />
            }

            {
                newCustomer && <NewCustomerForm
                    onClick={()=>{
                        setNewCustomer(false)
                    }}
                />
            }
        </div>
    )
}

export default CustomerDetails
