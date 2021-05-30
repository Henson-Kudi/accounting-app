import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Sales.css'
import { baseURL } from './axios'
import axios from 'axios'
import Barchart from './Barchart'
import PurchaseInvoice from './PurchaseInvoice'
import CashPurchase from './CashPurchase'
import MakePayment from './MakePayment'
import PurchaseOrder from './PurchaseOrder'
import PurchaseReturns from './PurchaseReturns'
import Loader from './Loader'
import NewSupplierForm from './NewSupplierForm'

function Purchases() {

    const [transactionOptions, setTransactionOptions] = useState(false)
    const [purchaseInvoice, setPurchaseInvoice] = useState(false)
    const [cashPurchase, setCashPurchase] = useState(false)
    const [makePayment, setMakePayment] = useState(false)
    const [purchaseOrder, setPurchaseOrder] = useState(false)
    const [purchaseReturns, setPurchaseReturns] = useState(false)
    const [newSupplier, setNewSupplier] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [allCreditors, setAllCreditors] = useState(false)

    const [purchaseData, setPurchaseData] = useState([])
    const [graphInfo, setGraphInfo] = useState([])
    const [recentPurchases, setRecentPurchases] = useState([])
    const [creditors, setCreditors] = useState([])
    const [returns, setReturns] = useState([])

    useEffect(async () => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        await baseURL.get('/purchases', {
            cancelToken: source.token
        })
            .then(res => {
                const purchases = res.data.purchases
                setPurchaseData(res.data.purchases)
                setGraphInfo(res.data.graph)
                setRecentPurchases(purchases.slice(purchases.length - 5))
                setCreditors(res.data.creditors)
                setReturns(res.data.returns)
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

console.log(purchaseData);
    const values = graphInfo?.map(a => a.value)
    const months = graphInfo?.map(a => a.month)

    const purchasesReturns = returns?.map(a => a.netPayable).reduce((a, b) => a + b, 0)



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

    const creditPurchases = purchaseData?.filter(a => {
        return (a.purchaseType === 'credit')
    }).map(a => a.amount).reduce((a, b) => a + b, 0)

    const cashPurchases = purchaseData?.filter(a => {
        return (a.purchaseType === 'cash')
    }).map(a => a.amount).reduce((a, b) => a + b, 0)



    // CODE BELOW SHOULD BE COPIED TO INVENTORY PAGE IN ORDER TO SHOW FREQUENTLY BOUGHT ITEMS

    // var allTypesArray = elements;
    // var s = allTypesArray.reduce(function(m,v){
    // m[v] = (m[v]||0)+1; return m;
    // }, {}); // builds {2: 4, 4: 2, 6: 3} 
    // var a = [];
    // for (let k in s) a.push({k:k,n:s[k]});
    // // now we have [{"k":"2","n":4},{"k":"4","n":2},{"k":"6","n":3}] 
    // a.sort(function(a,b){ return b.n-a.n });
    // a = a.map(function(a) { return a.k });



    return (
        <div className='Sales'>
            <div className="salesTop">
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
                                <li className='transactionOption' onClick={() => { setPurchaseReturns(true) }}>Purchase Returns </li>
                            </ul>
                        }
                    </div>
                </div>
                <h3>Purchases Dashboard</h3>

                <div className="salesOptionsRight">
                    <button className='button' onClick={() => {
                        window.print()
                    }}>Print Page</button>
                </div>
            </div>

            <div className="salesMiddle">
                <div className="salesTotals">
                    <div className="cashSales">
                        <h5>Total Cash Purchases</h5>
                        <p><b>{cashPurchases?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                    <div className="creditSales" data-text='View Creditors' onClick={() => { setAllCreditors(true) }}>
                        <h5>Total Credit Purchases</h5>
                        <p><b>{creditPurchases?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                    <Link to='/returns'>
                        <div className="salesReturns" data-text='View Purchase Returns'>
                            <h5>Total Purchase Returns</h5>
                            <p style={{ color: 'red' }}><b>{purchasesReturns?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                        </div>
                    </Link>
                </div>

                <div className="recentSales">
                    <div className="mostRecentSales">
                        <h5>Most Recent Purchases (5)</h5>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th className='customerName'>Supplier Name</th>
                                    <th>Amount</th>
                                    <th>Means of Payment</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    recentPurchases?.map(purchase => (
                                        <tr key={purchase._id}>
                                            <td>{purchase.date}</td>
                                            <td className='customerName'><Link to={`/suppliers/${purchase.supplierName}`} className='customer'>{purchase.supplierName}</Link></td>
                                            <td>{purchase.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td>{purchase.purchaseType}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="topOwingCustomers">
                        <h5>5 Top Owing Suppliers</h5>
                        <table>
                            <thead>
                                <tr>
                                    <th className='customerName'>Supplier Name</th>
                                    <th>Total Debt</th>
                                    <th>Total Paid</th>
                                    <th>Balance Owing</th>
                                </tr>
                            </thead>
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
                        <div className="viewAllButton" onClick={() => { setAllCreditors(true) }}><button className='button specialBtn'>View All</button></div>
                    </div>
                </div>
                <Barchart
                    labels={months}
                    data={values}
                    tooltip='Monthly Purchases'
                />
            </div>

            {
                allCreditors &&
                <div className="allDebtors">
                    <div className="font">
                        <i className="fas fa-times fa-2x" onClick={() => { setAllCreditors(false) }}></i>
                    </div>
                    <div className="topOwingCustomers allDebtorsContainer">
                        <h3>Creditors List</h3>

                        <ul>
                            <li className="debtorsListHead">
                                <span>Supplier Name</span>
                                <span>Total Debt</span>
                                <span>Total Paid</span>
                                <span>Balance Owing</span>
                            </li>

                            {
                                creditors?.map(supplier => (
                                    <li className="debtorsListItem">
                                        <span><Link to={`/suppliers/${supplier.supplierName}`} className='customer'>{supplier.supplierName}</Link></span>
                                        <span>{supplier.totalDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                        <span>{supplier.totalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                        <span>{supplier.balanceDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            }

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
                purchaseReturns && <PurchaseReturns
                    onClick={() => {
                        setPurchaseReturns(false)
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

export default Purchases
