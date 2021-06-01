import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { baseURL } from './axios'
import Invoice from './Invoice'
import Receipt from './Receipt'
import ReceivePayment from './ReceivePayment'
import CreditNote from './CreditNote'
import Quotation from './Quotation'
import Loader from './Loader'
import NewCustomerForm from './NewCustomerForm'

function CustomersPage() {

    const [transactionOptions, setTransactionOptions] = useState(false)
    const [invoice, setInvoice] = useState(false)
    const [receipt, setReceipt] = useState(false)
    const [receivePayment, setReceivePayment] = useState(false)
    const [quotation, setQuotation] = useState(false)
    const [creditNote, setCreditNote] = useState(false)
    const [newCustomer, setNewCustomer] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [viewInvoices, setViewInvoices] = useState(false)
    const [viewReceipts, setViewReceipts] = useState(false)
    const [viewQuotations, setViewQuotations] = useState(false)
    const [viewCreditNotes, setViewCreditNotes] = useState(false)
    const [overview, setOverview] = useState(true)

    const [salesData, setSalesData] = useState([])
    const [graphInfo, setGraphInfo] = useState([])
    const [recentSales, setRecentSales] = useState([])
    const [debtors, setDebtors] = useState([])
    const [returns, setReturns] = useState([])
    const [customers, setCustomers] = useState([])
    const [invoices, setInvoices] = useState([])
    const [receipts, setReceipts] = useState([])
    const [quotations, setQuotations] = useState([])
    const [creditNotes, setCreditNotes] = useState([])
    const [invoiceAdditions, setInvoiceAdditions] = useState([])
    const [receiptAdditions, setReceiptAdditions] = useState([])
    const [creditNoteAdditions, setCreditNoteAdditions] = useState([])
    const [buttonClicked, setButtonClicked] = useState('overview')

    useEffect(async () => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get('/sales')
        const request2 = baseURL.get('/customers')
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
            .then(res => {
                const [result1, result2] = res
                const sales = result1.data.sales
                setSalesData(result1.data.sales)
                setGraphInfo(result1.data.graph)
                setRecentSales(sales.slice(sales.length - 5))
                setDebtors(result1.data.debtors)
                setReturns(result1.data.salesReturns)
                setCustomers(result2.data.customers)
                setInvoices(result2.data.invoices)
                setReceipts(result2.data.receipts)
                setQuotations(result2.data.quotations)
                setCreditNotes(result2.data.creditNotes)
                setInvoiceAdditions(result2.data.invoices.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)));
                setReceiptAdditions(result2.data.receipts.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)));
                setCreditNoteAdditions(result2.data.creditNotes.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)))
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
    const wrapperRef = useRef(null)
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            setTransactionOptions(false);
        }
    }


    // CODE BELOW SHOULD BE COPIED TO INVENTORY PAGE IN ORDER TO SHOW FREQUENTLY BOUGHT ITEMS


    const customerListBuilder = salesData.map(a => a.customerName);
    const listBuilder = customerListBuilder.reduce(function (m, v) {
        m[v] = (m[v] || 0) + 1; return m;
    }, {}); // loops through sales list and builds a list showing how many times a name appears on the whole list ( AS SUCH: [customerName : times appeared on list, next...])

    let listNames = []; //where the actual list of names will appear in order of highest occurence
    for (let name in listBuilder) listNames.push({ name: name, n: listBuilder[name] });
    // produce an array of objects by mapping the names to their respective names 
    listNames.sort(function (a, b) { return b.n - a.n });
    listNames = listNames.map(function (a) { return a.name });


    return (
        <div className='Sales'>
            <div className="salesTop">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                    <div className='salesTransactions' ref={wrapperRef}>
                        <button onClick={() => { setTransactionOptions(!transactionOptions) }} className='button'>New Transaction <i className="fas fa-angle-down"></i></button>
                        {
                            transactionOptions &&
                            <ul className='transactionOptions' style={{ backgroundColor: 'rgba(211, 211, 211,0.5)' }}>
                                <li className='transactionOption' onClick={() => { setNewCustomer(true) }}>Add Customer</li>
                                <li className='transactionOption' onClick={() => { setInvoice(true) }}>Invoice</li>
                                <li className='transactionOption' onClick={() => { setReceipt(true) }}>Receipt</li>
                                <li className='transactionOption' onClick={() => { setReceivePayment(true) }}>Receive Payment</li>
                                <li className='transactionOption' onClick={() => { setQuotation(true) }}>Quotation</li>
                                <li className='transactionOption' onClick={() => { setCreditNote(true) }}>Credit Note</li>
                            </ul>
                        }
                    </div>
                </div>
                <h3>Customers Dashboard</h3>

                <div className="salesOptionsRight">
                    <button className='button' onClick={() => {
                        window.print()
                    }}>Print Page</button>
                </div>
            </div>

            <div className="bestCustomers">

                <div className="mostFrequentCustomers">
                    {
                        listNames.length === 0 ? '' : <h5>5 Most Frequent Customers</h5>
                    }

                    <ul className="listNames">
                        {
                            listNames.slice(0, 5).map(name => (

                                <li className='listName'><Link to={`/customers/${name}`} className='customer'>{name}</Link></li>

                            ))
                        }
                    </ul>
                </div>

                <div className="topOwingCustomers">
                    {
                        debtors.length === 0 ? '' :
                            <h5>5 Top Owing Debtors</h5>
                    }
                    <table>
                        {
                            debtors.length === 0 ? '' :
                                <thead>
                                    <tr>
                                        <th className='customerName'>Customer Name</th>
                                        <th>Total Debt</th>
                                        <th>Total Paid</th>
                                        <th>Balance Owing</th>
                                    </tr>
                                </thead>
                        }
                        <tbody>
                            {
                                debtors?.sort((a, b) => b.balanceDue - a.balanceDue).slice(0, 5).map(debtor => (
                                    <tr>
                                        <td className='customerName'><Link to={`/customers/${debtor.customerName}`} className='customer'>{debtor.customerName}</Link></td>
                                        <td>{debtor.totalDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{debtor.totalPaid?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{debtor.balanceDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
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
                            setOverview(true)
                            setViewCreditNotes(false)
                        }}
                    >
                        All Customers
                                </button>

                    <button
                        className={buttonClicked === 'View Invoices' ? 'button' : 'btn'}
                        onClick={() => {
                            setButtonClicked('View Invoices')
                            setViewInvoices(true)
                            setViewReceipts(false)
                            setViewQuotations(false)
                            setOverview(false)
                            setViewCreditNotes(false)
                        }}
                    >
                        All Invoices
                                </button>

                    <button
                        className={buttonClicked === 'View Receipts' ? 'button' : 'btn'}
                        onClick={() => {
                            setButtonClicked('View Receipts')
                            setViewInvoices(false)
                            setViewReceipts(true)
                            setViewQuotations(false)
                            setOverview(false)
                            setViewCreditNotes(false)
                        }}
                    >
                        All Receipts
                                </button>

                    <button
                        className={buttonClicked === 'View Quotation' ? 'button' : 'btn'}
                        onClick={() => {
                            setButtonClicked('View Quotation')
                            setViewInvoices(false)
                            setViewReceipts(false)
                            setViewQuotations(true)
                            setOverview(false)
                            setViewCreditNotes(false)
                        }}
                    >
                        All Quotations
                                </button>

                    <button
                        className={buttonClicked === 'View CreditNote' ? 'button' : 'btn'}
                        onClick={() => {
                            setButtonClicked('View CreditNote');
                            setViewInvoices(false)
                            setViewReceipts(false)
                            setViewQuotations(false)
                            setOverview(false)
                            setViewCreditNotes(true)
                        }}
                    >
                        All Credit Notes
                                </button>

                </div>
            </div>

            {
                overview &&
                <div className="allDebtorsContainer">
                    {
                        customers.length === 0 ? <h3>No Data to display. Please Add Customers</h3> :
                            <h3>Customers List</h3>
                    }
                    <table className="allDebtorsTable">
                        <thead>
                            {
                                customers.length === 0 ? '' :
                                    <tr className='invoiceListHead'>
                                        <th>Customer Name</th>
                                        <th>Email Address</th>
                                        <th>City </th>
                                        <th>Telephone</th>
                                    </tr>
                            }
                        </thead>

                        <tbody>
                            {
                                customers?.map(customer => (
                                    <tr className='invoiceListbody'>
                                        <td><Link to={`/customers/${customer.name}`} className='customer'>{customer.name}</Link></td>
                                        <td>{customer.email}</td>
                                        <td>{customer.city}</td>
                                        <td>{customer.tel.replace(/\B(?=(\d{3})+(?!\d))/g, "-")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </div>
            }

            <div className="allDebtorsContainer">
                {
                    viewInvoices &&
                        invoices.length > 0 ? <table className="allDebtorsTable">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>
                                    <th>Invoice Term</th>
                                    <th>Due Date</th>
                                    <th>Customer Name</th>
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
                                            <td><Link to={`/customers/${invoice.customerDetails.name}`} className='customer'>{invoice.customerDetails.name}</Link></td>
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
                        <table className="invoices buttonOptions allDebtorsTable">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>
                                    <th>Customer Name</th>
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
                                            <td><Link to={`/customers/${receipt.customerDetails.name}`} className='customer'>{receipt.customerDetails.name}</Link></td>
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
                        <table className="invoices buttonOptions allDebtorsTable">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>
                                    <th>Customer Name</th>
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
                                            <td><Link to={`/customers/${note.customerDetails.name}`} className='customer'>{note.customerDetails.name}</Link></td>
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
                        <table className="invoices buttonOptions allDebtorsTable">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>
                                    <th>Customer Name</th>
                                    <th>Quote Number</th>
                                    <th>Gross Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    quotations.map((quote, index) => (
                                        <tr className='quoteListbody'>
                                            <td>{quote.quoteInput.date}</td>
                                            <td><Link to={`/customers/${quote.customerDetails.name}`} className='customer'>{quote.customerDetails.name}</Link></td>
                                            <td>{quote.quoteInput.quoteNumber}</td>
                                            <td>{(quote.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table> : viewQuotations && <h2 className='noData'>No Quotations To Display. Please Record Transactions</h2>
                }

            </div>

            {
                invoice && <Invoice
                    onClick={() => { setInvoice(false) }}
                />
            }
            {
                receipt && <Receipt
                    onClick={() => {
                        setReceipt(false)
                    }}
                />
            }
            {
                receivePayment && <ReceivePayment
                    onClick={() => {
                        setReceivePayment(false)
                    }}
                />
            }
            {
                quotation && <Quotation
                    onClick={() => {
                        setQuotation(false)
                    }}
                />
            }
            {
                creditNote && <CreditNote
                    onClick={() => {
                        setCreditNote(false)
                    }}
                />
            }

            {
                fetching && <Loader />
            }

            {
                newCustomer && <NewCustomerForm
                    onClick={() => {
                        setNewCustomer(false)
                    }}
                />
            }

        </div>
    )
}

export default CustomersPage
