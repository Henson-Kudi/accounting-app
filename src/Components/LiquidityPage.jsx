import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import Barchart from './Barchart'
import Loader from './Loader'
import Invoice from './Invoice'
import Receipt from './Receipt'
import MakePayment from './MakePayment'
import ReceivePayment from './ReceivePayment'
import PurchaseInvoice from './PurchaseInvoice'
import PurchaseReceipt from './CashPurchase'
import NewCustomerForm from './NewCustomerForm'
import NewSupplierForm from './NewSupplierForm'
import './LiquidityPage.css'

function LiquidityPage() {

    const [fetching, setfetching] = useState(false)
    const [data, setData] = useState([])
    const [transactionOptions, setTransactionOptions] = useState(false)
    const [newInvoice, setNewInvoice] = useState(false)
    const [newReceipt, setNewReceipt] = useState(false)
    const [newMakePayment, setNewMakePayment] = useState(false)
    const [newReceivePayment, setNewReceivePayment] = useState(false)
    const [newPurchaseInvoice, setNewPurchaseInvoice] = useState(false)
    const [newPurchaseReceipt, setNewPurchaseReceipt] = useState(false)
    const [newCustomer, setNewCustomer] = useState(false)
    const [newSupplier, setNewSupplier] = useState(false)
    const [overview, setOverview] = useState(true)
    const [selected, setSelected] = useState('cash')

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


    useEffect(async() => {
        let source = axios.CancelToken.source();
        let unMounted = false;
        await baseURL.get('/meansOfPayment', {
            cancelToken: source.token
        })
        .then(res =>{
            setfetching(false)
            setData(res.data)
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

    const totalOut = data.filter(item => item.meansOfPayment === selected).filter(item => item.inOrOut === 'out').map(item => item.amount).reduce((a, b) => a + b, 0)

    const totalIn = data.filter(item => item.meansOfPayment === selected).filter(item => item.inOrOut === 'in').map(item => item.amount).reduce((a, b) => a + b, 0)

    const accountBalance = totalIn - totalOut

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

    const chart = data.filter(item => item.meansOfPayment === selected)

    chart.filter( item => {
        const month = new Date(item.date).getMonth()
        switch (month) {
            case 0:
                jan.push(item.amount)
                break;
            
            case 1:
                feb.push(item.amount)
                break;

            case 2:
                mar.push(item.amount)
                break;

            case 3:
                apr.push(item.amount)
                break;

            case 4:
                may.push(item.amount)
                break;

            case 5:
                jun.push(item.amount)
                break;

            case 6:
                jul.push(item.amount)
                break;

            case 7:
                aug.push(item.amount)
                break;

            case 8:
                sept.push(item.amount)
                break;

            case 9:
                oct.push(item.amount)
                break;

            case 10:
                nov.push(item.amount)
                break;
        
            case 11:
                dec.push(item.amount)
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

    return (
        <div className='liquidityPage'>
            <div className="expenseTop salesTop homeAndPrint">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                </div>

                <div className="salesOptionsMiddle">
                    <h1>Cash, Bank and Mobile Money Transactions</h1>
                </div>

                <div className="salesOptionsRight">
                    <div className='salesTransactions' ref={wrapperRef}>
                        <button onClick={() => { setTransactionOptions(!transactionOptions) }} className='button'>New Transaction <i className="fas fa-angle-down"></i></button>
                        {
                            transactionOptions &&
                            <ul className='transactionOptions'>
                                <li className='transactionOption' onClick={() => { setNewCustomer(true) }}>Add Customer</li>
                                <li className='transactionOption' onClick={() => { setNewSupplier(true) }}>New Supplier</li>
                                <li className='transactionOption' onClick={() => { setNewInvoice(true) }}>Invoice</li>
                                <li className='transactionOption' onClick={() => { setNewReceipt(true) }}>Sale Receipt</li>
                                <li className='transactionOption' onClick={() => { setNewReceivePayment(true) }}>Receive Payment</li>
                                <li className='transactionOption' onClick={() => { setNewPurchaseInvoice(true) }}>Purchase Invoice</li>
                                <li className='transactionOption' onClick={() => { setNewPurchaseReceipt(true) }}>Purchase Receipt</li>
                                <li className='transactionOption' onClick={() => { setNewMakePayment(true) }}>Make Payment</li>
                            </ul>
                        }
                    </div>
                    <button className="button" onClick={()=>{window.print()}}>
                        Print Page
                    </button>
                </div>
            </div>
            
            
            <div className="liquidityOptions">
                <p className={selected === 'cash' ? 'selected' : 'option'} onClick={()=>{setSelected('cash')}}>Cash Account</p>
                <p className={selected === 'bank' ? 'selected' : 'option'} onClick={()=>{setSelected('bank')}}>Bank Account</p>
                <p className={selected === 'mobileMoney' ? 'selected' : 'option'} onClick={()=>{setSelected('mobileMoney')}}>Mobile Money Account</p>
            </div>

            <div className="mostRecentTrans">
                <div>
                    <h3>Recent Transactions</h3>
                <table>
                    <thead>
                        <tr className='recentItemHead'>
                            <th className='recentItem'>Date</th>
                            <th className='recentItem'>Sent to / Received from:</th>
                            <th className='recentItem'>Description</th>
                            <th className='recentItem'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.filter(item => item.meansOfPayment === selected).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(item => (
                            <tr key={item._id} className='recentItemHead'>
                                <td className='recentItem'>{item.date}</td>
                                <td className='recentItem'>{item.name}</td>
                                <td className='recentItem'>{item.reason}</td>
                                <td className='recentItem'>{(item.amount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
                </div>

                <div className="totalInAccount">
                    <p className='accountTotal'>
                        Balance in Account: {(accountBalance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                </div>
            </div>
        
            <div className="filter">
                <button className={overview ? "button" : 'btn'} onClick={()=>{setOverview(true)}}>
                    Overview
                </button>

                <button className={!overview ? "button" : 'btn'} onClick={()=>{setOverview(false)}}>
                    All Transactions
                </button>
            </div>

            <div>
                {
                    overview &&
                    <Barchart
                        labels = {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}

                        data={
                                [jan, feb,mar, apr, may, jun, jul, aug, sept, oct, nov, dec]
                            }
                        tooltip={`${selected} trend`}
                    />
                }

                {
                    !overview &&
                    <div className="allTrans">
                        <table>
                            <thead>
                                <tr className='recentItemHead'>
                                    <th className='recentItem'>Date</th>
                                    <th className='recentItem'>Sent to / Received from:</th>
                                    <th className='recentItem'>Description</th>
                                    <th className='recentItem'>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.filter(item => item.meansOfPayment === selected).sort((a, b) => new Date(b.date) - new Date(a.date)).map(item => (
                                    <tr key={item._id} className='recentItemHead'>
                                        <td className='recentItem'>{item.date}</td>
                                        <td className='recentItem'>{item.name}</td>
                                        <td className='recentItem'>{item.reason}</td>
                                        <td className='recentItem'>{(item.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </div>

            {
                fetching &&
                <Loader/>
            }
            {
                newInvoice &&
                <Invoice
                    onClick={()=>{setNewInvoice(false)}}
                />
            }
            {
                newReceipt &&
                <Receipt
                    onClick={()=>{setNewReceipt(false)}}
                />
            }
            {
                newMakePayment&&
                <MakePayment
                    onClick={()=>{setNewMakePayment(false)}}
                />
            }
            {
                newReceivePayment &&
                <ReceivePayment
                    onClick={()=>{setNewReceivePayment(false)}}
                />
            }
            {
                newPurchaseInvoice &&
                <PurchaseInvoice
                    onClick={()=>{setNewPurchaseInvoice(false)}}
                />
            }
            {
                newPurchaseReceipt &&
                <PurchaseReceipt
                    onClick={()=>{setNewPurchaseReceipt(false)}}
                />
            }
            {
                newCustomer &&
                <NewCustomerForm
                    onClick={()=>{setNewCustomer(false)}}
                />
            }
            {
                newSupplier &&
                <NewSupplierForm
                    onClick={()=>{setNewSupplier(false)}}
                />
            }
        </div>
    )
}

export default LiquidityPage
