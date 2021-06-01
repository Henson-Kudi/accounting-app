import React, { useState, useEffect, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
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

function SupplierDetails() {
    const [fetching, setFetching] = useState(true)
    const [transactionOptions, setTransactionOptions] = useState(false)
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

    const wrapperRef = useRef(null)
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
                console.log(result1.data);
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




    return (
        <div className='CustomerDetails'>
            <div className="salesTop homeAndPrint">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>

                    <div className='salesTransactions' ref={wrapperRef}>
                    <button onClick={() => { setTransactionOptions(!transactionOptions) }} className='button'>New Transaction <i className="fas fa-angle-down"></i></button>
                    {
                        transactionOptions &&
                        <ul className='transactionOptions'>
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
                

                <div className="salesOptionsRight">
                    <button className='button' onClick={async () => {
                        setViewPurchaseInvoices(true)
                        setViewCashPurchases(true)
                        setViewPurchaseOrders(true)
                        setViewPurchaseReturns(true)
                        setOverview(true)
                        await setTimeout(() => {
                            window.print()
                        }, 1000)
                        setTimeout(() => {
                            setViewPurchaseInvoices(false)
                            setViewCashPurchases(false)
                            setViewPurchaseOrders(false)
                            setViewPurchaseReturns(false)
                            setButtonClicked('overview')
                        }, 2000)
                    }}>Print Page</button>
                </div>
            </div>
            {
                element?.map(e => (
                    <div className="customerDetailsInfo">
                        <div className="customerName">
                            <h2>Supplier: {e.name}</h2>
                            {
                                creditors.map(credit => (
                                    <p className="balanceDue">
                                        Total Credit: {credit.balanceDue}
                                    </p>
                                ))
                            }
                        </div>
                        <div className="contactInfos">
                            <h3 className='customerDetail'>Contact Info</h3>
                            <p className='customerDetail'><span>Email:</span>{e.email}</p>
                            <p className='customerDetail'><span>Tel:</span>{e.telephone}</p>
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
                    purchases.length > 0 ? <div className="recentAndBarChart">
                        <div className="recentTransactions">
                            <h5>Most Recent Transactions</h5>
                            {
                                purchases.slice(purchases.length - 5).map(purchase => (

                                    <ul className='saleTran'>
                                        <li>{purchase.date}</li>
                                        <li>{purchase.purchaseType}</li>
                                        <li>{purchase.amount}</li>
                                    </ul>

                                ))
                            }
                        </div>

                        <Barchart
                            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}
                            data={
                                [jan, feb, mar, apr, may, jun, jul, aug, sept, oct, nov, dec]
                            }
                            tooltip={`Sales Trend for customer ${params.supplierName}`}
                        />

                    </div> : overview && <h2 className='noData'>No Data To Display. Please Record Transactions</h2>
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
                                        <tr className='noteListbody'>
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
                                        <tr className='quoteListbody'>
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

            <div>
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

export default SupplierDetails
