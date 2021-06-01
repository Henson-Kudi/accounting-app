import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { baseURL } from './axios'
import MakePayment from './MakePayment'
import PurchaseReturns from './PurchaseReturns'
import Loader from './Loader'
import NewSupplierForm from './NewSupplierForm'
import PurchaseInvoice from './PurchaseInvoice'
import CashPurchase from './CashPurchase'
import PurchaseOrder from './PurchaseOrder'

function SuppliersPage() {

    const [transactionOptions, setTransactionOptions] = useState(false)
    const [purchaseInvoice, setPurchaseInvoice] = useState(false)
    const [cashPurchase, setCashPurchase] = useState(false)
    const [makePayment, setMakePayment] = useState(false)
    const [purchaseOrder, setPurchaseOrder] = useState(false)
    const [purchaseReturn, setPurchaseReturn] = useState(false)
    const [newSupplier, setNewSupplier] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [viewPurchaseInvoices, setViewPurchaseInvoices] = useState(false)
    const [viewCashPurchases, setViewCashPurchases] = useState(false)
    const [viewPurchaseOrders, setViewPurchaseOrders] = useState(false)
    const [viewPurchaseReturns, setViewPurchaseReturns] = useState(false)
    const [overview, setOverview] = useState(true)

    const [purchaseData, setPurchaseData] = useState([])
    const [graphInfo, setGraphInfo] = useState([])
    const [recentPurchases, setRecentPurchases] = useState([])
    const [creditors, setCreditors] = useState([])
    const [returns, setReturns] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [purchaseInvoices, setPurchaseInvoices] = useState([])
    const [cashPurchases, setCashPurchases] = useState([])
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [purchaseReturns, setPurchaseReturns] = useState([])
    const [invoiceAdditions, setInvoiceAdditions] = useState([])
    const [receiptAdditions, setReceiptAdditions] = useState([])
    const [creditNoteAdditions, setCreditNoteAdditions] = useState([])
    const [buttonClicked, setButtonClicked] = useState('overview')

    useEffect(async () => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get('/purchases')
        const request2 = baseURL.get('/suppliers')
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
            .then(res => {
                const [result1, result2] = res
                const purchases = result1.data.purchases
                setPurchaseData(result1.data.purchases)
                setGraphInfo(result1.data.graph)
                setRecentPurchases(purchases.slice(purchases.length - 5))
                setCreditors(result1.data.creditors)
                setReturns(result1.data.purchaseReturns)
                setSuppliers(result2.data.suppliers)
                setPurchaseInvoices(result2.data.purchaseInvoices)
                setCashPurchases(result2.data.cashPurchases)
                setPurchaseOrders(result2.data.purchaseOrders)
                setPurchaseReturns(result2.data.purchaseReturns)
                setInvoiceAdditions(result2.data.purchaseInvoices.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)));
                setReceiptAdditions(result2.data.cashPurchases.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)));
                setCreditNoteAdditions(result2.data.purchaseReturns.map(a => a.otherAdditions.map(b => b.amount).reduce((a, b) => a + b, 0)))
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


    const supplierListBuilder = purchaseData?.map(a => a.supplierName);
    const listBuilder = supplierListBuilder.reduce(function (m, v) {
        m[v] = (m[v] || 0) + 1; return m;
    }, {}); // loops through sales list and builds a list showing how many times a name appears on the whole list ( AS SUCH: [customerName : times appeared on list, next...])

    let listNames = []; //where the actual list of names will appear in order of highest occurence
    for (let name in listBuilder) listNames.push({ name: name, n: listBuilder[name] });
    // produce an array of objects by mapping the names to their respective names 
    listNames.sort(function (a, b) { return b.n - a.n });
    listNames = listNames.map(function (a) { return a.name });

    console.log(creditors);


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
                                <li className='transactionOption' onClick={() => { setNewSupplier(true) }}>Add Supplier</li>
                                <li className='transactionOption' onClick={() => { setPurchaseInvoice(true) }}>Purchase Invoice</li>
                                <li className='transactionOption' onClick={() => { setCashPurchase(true) }}>Cash Purchase</li>
                                <li className='transactionOption' onClick={() => { setMakePayment(true) }}>Make Payment</li>
                                <li className='transactionOption' onClick={() => { setPurchaseOrder(true) }}>Purchase Order</li>
                                <li className='transactionOption' onClick={() => { setPurchaseReturn(true) }}>Purchase Returns</li>
                            </ul>
                        }
                    </div>
                </div>
                <h3>Suppliers Dashboard</h3>

                <div className="salesOptionsRight">
                    <button className='button' onClick={() => {
                        window.print()
                    }}>Print Page</button>
                </div>
            </div>

            <div className="bestCustomers">

                <div className="mostFrequentCustomers">
                    {
                        listNames.length === 0 ? '' : <h5>5 Most Frequent Suppliers</h5>
                    }

                    <ul className="listNames">
                        {
                            listNames.slice(0, 5).map(name => (

                                <li className='listName'><Link to={`/suppliers/${name}`} className='customer'>{name === 'undefined' ? '' : name}</Link></li>

                            ))
                        }
                    </ul>
                </div>

                <div className="topOwingCustomers">
                    {
                        suppliers?.length === 0 ? '' :
                            <h5>5 Top Owing Creditors</h5>
                    }
                    <table>
                        {
                            creditors.length === 0 ? '' :
                                <thead>
                                    <tr>
                                        <th className='customerName'>Supplier Name</th>
                                        <th>Total Debt</th>
                                        <th>Total Paid</th>
                                        <th>Balance Owing</th>
                                    </tr>
                                </thead>
                        }
                        <tbody>
                            {
                                creditors?.sort((a, b) => b.balanceDue - a.balanceDue).slice(0, 5).map(creditor => (
                                    <tr>
                                        <td className='customerName'><Link to={`/suppliers/${creditor.supplierName}`} className='customer'>{creditor.supplierName}</Link></td>
                                        <td>{creditor.totalDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{creditor.totalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{creditor.balanceDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </div>
            </div>

            <div className="filterContainer">
                <div className="filter">
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
                        All Suppliers
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
                        Suppliers Invoices
                                </button>

                    <button
                        className={buttonClicked === 'View Receipts' ? 'button' : 'btn'}
                        onClick={() => {
                            setButtonClicked('View Receipts')
                            setViewPurchaseInvoices(false)
                            setViewPurchaseOrders(false)
                            setOverview(false)
                            setViewPurchaseReturns(false)
                            setViewCashPurchases(true)
                        }}
                    >
                        Cash Purchases
                                </button>

                    <button
                        className={buttonClicked === 'View Quotation' ? 'button' : 'btn'}
                        onClick={() => {
                            setButtonClicked('View Quotation')
                            setViewPurchaseInvoices(false)
                            setViewCashPurchases(false)
                            setOverview(false)
                            setViewPurchaseReturns(false)
                            setViewPurchaseOrders(true)
                        }}
                    >
                        All Orders
                                </button>

                    <button
                        className={buttonClicked === 'View CreditNote' ? 'button' : 'btn'}
                        onClick={() => {
                            setButtonClicked('View CreditNote');
                            setViewPurchaseInvoices(false)
                            setViewCashPurchases(false)
                            setViewPurchaseOrders(false)
                            setOverview(false)
                            setViewPurchaseReturns(true)
                        }}
                    >
                        Purchase Returns
                    </button>

                </div>
            </div>

            {
                overview &&
                <div className="allDebtorsContainer">
                    {
                        suppliers.length === 0 ? <h3>No Data to display. Please Add Suppliers</h3> :
                            <h3>Suppliers List</h3>
                    }
                    <table className='allDebtorsTable'>
                        <thead>
                            {
                                suppliers.length === 0 ? '' :
                                    <tr className='invoiceListHead'>
                                        <th>Supplier Name</th>
                                        <th>Email Address</th>
                                        <th>City </th>
                                        <th>Telephone</th>
                                    </tr>
                            }
                        </thead>

                        <tbody>
                            {
                                suppliers?.map(supplier => (
                                    <tr className='invoiceListbody'>
                                        <td><Link to={`/suppliers/${supplier.name}`} className='customer'>{supplier.name}</Link></td>
                                        <td>{supplier.email}</td>
                                        <td>{supplier.city}</td>
                                        <td>{supplier.telephone?.replace(/\B(?=(\d{3})+(?!\d))/g, "-")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </div>
            }

            <div className="allDebtorsContainer">
                {
                    viewPurchaseInvoices &&
                        purchaseInvoices?.length > 0 ? <table className="allDebtorsTable">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>
                                    <th>Invoice Term</th>
                                    <th>Due Date</th>
                                    <th>Supplier Name</th>
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
                                    purchaseInvoices?.map((invoice, index) => (
                                        <tr className='invoiceListbody'>
                                            <td>{invoice.invoiceInput.date}</td>
                                            <td>{invoice.selectInvoiceTerm} days</td>
                                            <td>{invoice.dueDate}</td>
                                            <td><Link to={`/suppliers/${invoice.supplierDetails.name}`} className='customer'>{invoice.supplierDetails.name}</Link></td>
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
                                    <th>Supplier Name</th>
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
                                    cashPurchases?.map((receipt, index) => (
                                        <tr className='receiptListbody'>
                                            <td>{receipt.receiptInput.date}</td>
                                            <td><Link to={`/suppliers/${receipt.supplierDetails.name}`} className='customer'>{receipt.supplierDetails.name}</Link></td>
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
                        </table> : viewCashPurchases && <h2 className='noData'>No Receipts To Display. Please Record Transactions</h2>
                }

                {
                    viewPurchaseReturns &&
                        purchaseReturns.length > 0 ?
                        <table className="allDebtorsTable">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>
                                    <th>Supplier Name</th>
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
                                    purchaseReturns?.map((returns, index) => (
                                        <tr className='returnsListbody'>
                                            <td>{returns.returnsInput.date}</td>
                                            <td><Link to={`/suppliers/${returns.supplierDetails.name}`} className='customer'>{returns.supplierDetails.name}</Link></td>
                                            <td>{returns.returnsInput.returnsNumber}</td>
                                            <td>{(returns.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td>{(Number(returns.discountsAndVat.rebateValue) + Number(returns.discountsAndVat.tradeDiscountValue) + Number(returns.discountsAndVat.cashDiscountValue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td>{(returns.discountsAndVat.valueAddedTax).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td>{(creditNoteAdditions[index])?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td>{((returns.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table> : viewPurchaseReturns && <h2 className='noData'>No Return Records To Display. Please Record Transactions</h2>
                }

                {
                    viewPurchaseOrders &&
                        purchaseOrders.length > 0 ?
                        <table className="allDebtorsTable">
                            <thead>
                                <tr className='invoiceListHead'>
                                    <th>Date</th>
                                    <th>Supplier Name</th>
                                    <th>Quote Number</th>
                                    <th>Gross Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    purchaseOrders.map((order, index) => (
                                        <tr className='quoteListbody'>
                                            <td>{order.orderInput.date}</td>
                                            <td><Link to={`/suppliers/${order.supplierDetails.name}`} className='customer'>{order.supplierDetails.name}</Link></td>
                                            <td>{order.orderInput.orderNumber}</td>
                                            <td>{(order.grossAmount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table> : viewPurchaseOrders && <h2 className='noData'>No Purchase Orders To Display. Please Record Transactions</h2>
                }

            </div>

            {
                purchaseInvoice && <PurchaseInvoice
                    onClick={() => { setPurchaseInvoice(false) }}
                />
            }
            {
                cashPurchase && <CashPurchase
                    onClick={() => {
                        setCashPurchase(false)
                    }}
                />
            }
            {
                makePayment && <MakePayment
                    onClick={() => {
                        setMakePayment(false)
                    }}
                />
            }
            {
                purchaseOrder && <PurchaseOrder
                    onClick={() => {
                        setPurchaseOrder(false)
                    }}
                />
            }
            {
                purchaseReturn && <PurchaseReturns
                    onClick={() => {
                        setPurchaseReturn(false)
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
                />
            }

        </div>
    )
}

export default SuppliersPage
