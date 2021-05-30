import React, { useState, useRef, useEffect } from 'react'
import {Link} from 'react-router-dom'
import './Sales.css'
import {baseURL} from './axios'
import axios from 'axios'
import Barchart from './Barchart'
import Invoice from './Invoice'
import Receipt from './Receipt'
import ReceivePayment from './ReceivePayment'
import Quotation from './Quotation'
import CreditNote from './CreditNote'
import Loader from './Loader'
import NewCustomerForm from './NewCustomerForm'

function Sales() {

    const [transactionOptions, setTransactionOptions] = useState(false)
    const [invoice, setInvoice] = useState(false)
    const [receipt, setReceipt] = useState(false)
    const [receivePayment, setReceivePayment] = useState(false)
    const [quotation, setQuotation] = useState(false)
    const [creditNote, setCreditNote] = useState(false)
    const [newCustomer, setNewCustomer] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [allDebtors, setAllDebtors] = useState(false)

    const [salesData, setSalesData] = useState([])
    const [graphInfo, setGraphInfo] = useState([])
    const [recentSales, setRecentSales] = useState([])
    const [debtors, setDebtors] = useState([])
    const [returns, setReturns] = useState([])

    useEffect(async() => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        await baseURL.get('/sales', {
            cancelToken: source.token
        })
        .then(res => {
            const sales = res.data.sales
            setSalesData(res.data.sales)
            setGraphInfo(res.data.graph)
            setRecentSales(sales.slice(sales.length -5))
            setDebtors(res.data.debtors)
            setReturns(res.data.salesReturns)
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

    const values = graphInfo?.map(a => a.value)
    const months = graphInfo?.map(a => a.month)

    const salesReturns = returns.map(a => a.netPayable).reduce((a,b) => a + b, 0)
    
    
    
    
    const wrapperRef = useRef(null)
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

        const creditSales = salesData?.filter(a => {
            return (a.saleType === 'credit')
        }).map(a => a.amount). reduce((a,b)=> a + b,0)

        const cashSales = salesData?.filter(a => {
            return (a.saleType === 'cash')
        }).map(a => a.amount).reduce((a,b)=> a + b,0)


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
                <h3>Sales Dashboard</h3>

                <div className="salesOptionsRight">
                    <button className='button' onClick={()=>{
                        window.print()
                    }}>Print Page</button>
                </div>
            </div>

            <div className="salesMiddle">
                <div className="salesTotals">
                    <div className="cashSales">
                        <h5>Total Cash Sales</h5>
                        <p><b>{cashSales?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                    <div className="creditSales" data-text='View Debtors' onClick={()=>{setAllDebtors(true)}}>
                        <h5>Total Credit Sales</h5>
                        <p><b>{creditSales?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                    <Link to='/returns'>
                        <div className="salesReturns" data-text='View Sales Returns'>
                            <h5>Total Sales Returns</h5>
                            <p style={{color: 'red'}}><b>{salesReturns?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                        </div>
                    </Link>
                </div>

                <div className="recentSales">
                    <div className="mostRecentSales">
                        <h5>Most Recent Sales (5)</h5>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th className='customerName'>Customer Name</th>
                                    <th>Amount</th>
                                    <th>Means of Payment</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    recentSales.map(sale =>(
                                        <tr key={sale._id}>
                                            <td>{sale.date}</td>
                                            <td className='customerName'><Link to={`/customers/${sale.customerName}`} className='customer'>{sale.customerName}</Link></td>
                                            <td>{sale.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            <td>{sale.saleType}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="topOwingCustomers">
                    <h5>5 Top Owing Debtors</h5>
                        <table>
                            <thead>
                                <tr>
                                    <th className='customerName'>Customer Name</th>
                                    <th>Total Debt</th>
                                    <th>Total Paid</th>
                                    <th>Balance Owing</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                debtors?.sort((a,b)=> b.balanceDue - a.balanceDue).slice(0,5).map(debtor =>(
                                    <tr>
                                    <td className='customerName'><Link to={`/customers/${debtor.customerName}`} className='customer'>{debtor.customerName}</Link></td>
                                    <td>{debtor.totalDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{debtor.totalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{debtor.balanceDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                                ))
                            }
                            </tbody>
                            
                        </table>
                        <div className="viewAllButton" onClick={()=>{setAllDebtors(true)}}><button className='button specialBtn'>View All</button></div>
                    </div>
                </div>
                <Barchart
                    labels={months}
                    data={values}
                    tooltip='Monthly Sales'
                />
            </div>

            {
                allDebtors &&
                    <div className="allDebtors">
                    <div className="font">
                        <i className="fas fa-times fa-2x" onClick={()=>{setAllDebtors(false)}}></i>
                    </div>
                        <div className="topOwingCustomers allDebtorsContainer">
                                <h3>Debtors List</h3>
                        
                                <ul>
                                    <li className="debtorsListHead">
                                        <span>Customer Name</span>
                                        <span>Total Debt</span>
                                        <span>Total Paid</span>
                                        <span>Balance Owing</span>
                                    </li>
                                
                            {
                                debtors?.map(debtor =>(
                                    <li className="debtorsListItem">
                                        <span><Link to={`/customers/${debtor.customerName}`} className='customer'>{debtor.customerName}</Link></span>
                                        <span>{debtor.totalDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                        <span>{debtor.totalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                        <span>{debtor.balanceDue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                    </li>
                                ))
                            }
                            </ul>
                    </div>
                    </div>
            }

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

export default Sales
