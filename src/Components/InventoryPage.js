import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import {useParams, Link} from 'react-router-dom'
import {baseURL} from './axios'
import './InventoryPage.css'
import Barchart from './Barchart'
import Loader from './Loader'
import Invoice from './Invoice'
import AddProduct from './AddProductForm'
import Receipt from './Receipt'
import PurchaseInvoice from './PurchaseInvoice'
import PurchaseReceipt from './CashPurchase'

function InventoryPage() {
    const [fetching, setfetching] = useState(false)
    const [transactionOptions, setTransactionOptions] = useState(false)
    const [newProduct, setNewProduct] = useState(false)
    const [invoice, setInvoice] = useState(false)
    const [receipt, setReceipt] = useState(false)
    const [purchaseInvoice, setPurchaseInvoice] = useState(false)
    const [purchaseReceipt, setPurchaseReceipt] = useState(false)
    const [overview, setOverview] = useState(true)

    const [products, setProducts] = useState([])
    const [entriesAndExits, setEntriesAndExits] = useState([])
    

    const {productName} = useParams()
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

    useEffect(async() => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get(`/products/${productName}`)
        const request2 = baseURL.get(`/entriesAndExits/${productName}`)
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
        .then(res => {
            const [result1, result2] = res
            setProducts(result1.data)
            setEntriesAndExits(result2.data)
            setfetching(false)
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


    const totalEntriesAmount = entriesAndExits.filter(item => item.exitOrEntry === 'entry').map(item => item.amount).reduce((a,b) => a + b, 0)

    const totalExitsAmount = entriesAndExits.filter(item => item.exitOrEntry === 'exit').map(item => item.amount).reduce((a,b) => a + b, 0)

    const totalEntriesQty = entriesAndExits.filter(item => item.exitOrEntry === 'entry').map(item => item.qty).reduce((a,b) => a + b, 0)

    const totalExitsQty = entriesAndExits.filter(item => item.exitOrEntry === 'exit').map(item => item.qty).reduce((a,b) => a + b, 0)
    
    const unitSp = products.map(item => (item.sellingPrice).toFixed(2))

    const wac = ((totalEntriesAmount - totalExitsAmount)/ (totalEntriesQty - totalExitsQty)).toFixed(2) || 0

    const grossProfit = (unitSp[0] - wac).toFixed(2)

    const entries = entriesAndExits.filter(item => item.exitOrEntry === 'entry')
    const exits = entriesAndExits.filter(item => item.exitOrEntry === 'exit')

    const [viewEntries, setViewEntries] = useState(false)

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

    function getGraphData(entriesOrExits){
        entriesOrExits.filter( element => {
        const month = new Date(element.date).getMonth()
        switch (month) {
            case 0:
                jan.push(element.amount)
                break;
            
            case 1:
                feb.push(element.amount)
                break;

            case 2:
                mar.push(element.amount)
                break;

            case 3:
                apr.push(element.amount)
                break;

            case 4:
                may.push(element.amount)
                break;

            case 5:
                jun.push(element.amount)
                break;

            case 6:
                jul.push(element.amount)
                break;

            case 7:
                aug.push(element.amount)
                break;

            case 8:
                sept.push(element.amount)
                break;

            case 9:
                oct.push(element.amount)
                break;

            case 10:
                nov.push(element.amount)
                break;
        
            case 11:
                dec.push(element.amount)
                break;

            
            default: return null
                break;
        }
    })
    }
    getGraphData(viewEntries ? entries : exits)



    

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
        <div className='InventoryPage'>
            <div className="salesTop">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                    <div className='salesTransactions' ref={wrapperRef}>
                        <button onClick={() => { setTransactionOptions(!transactionOptions) }} className='button'>New Transaction <i className="fas fa-angle-down"></i></button>
                        {
                            transactionOptions &&
                            <ul className='transactionOptions'>
                                <li className='transactionOption' onClick={() => { setNewProduct(true) }}>New Product</li>
                                <li className='transactionOption' onClick={() => { setInvoice(true) }}>Invoice</li>
                                <li className='transactionOption' onClick={() => { setReceipt(true) }}>Receipt</li>
                                <li className='transactionOption' onClick={() => { setPurchaseInvoice(true) }}>Purchase Invoice</li>
                                <li className='transactionOption' onClick={() => { setPurchaseReceipt(true) }}>Purchase Receipt</li>

                            </ul>
                        }
                    </div>
                </div>

                <div className="salesOptionsRight">
                    <button className='button' onClick={() => {
                        window.print()
                    }}>Print Page</button>
                </div>
            </div>

            <div className="productDetails">
                {
                    products.map(item => (
                        <div className="productInfo">
                            <p className='detail'><b>Product: {item.productName}</b></p>
                            <p>{item.description}</p>
                            <p className='detail'>Qty In Stock: {(totalEntriesQty - totalExitsQty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p className='detail'>Unit Selling Price: {unitSp[0]}</p>
                        </div>
                    ))
                }
                <div className="stockInfo">
                    <p className='detail'><b>Value In Stock:</b> {((totalEntriesAmount).toFixed(2) - (totalExitsAmount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    
                    <p className='detail'><b>WAC/Unit:</b> {(wac).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    
                    <p className='detail'><b>Gross Profit/Unit:</b> <span style={{color: grossProfit < 0 ? 'red' : 'black'}}>{(grossProfit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                    <p className='detail'><b>Gross Profit(%):</b> <span style={{color: grossProfit < 0 ? 'red' : 'black'}}>{(((unitSp[0] - wac)/unitSp[0])*100).toFixed(2)}</span></p>
                </div>
            </div>

            <div className="recentSalesAndPurchases">
                    <div className="recentProductSales">
                    <h3>Recent Product Sales</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th className="recentInfo">Date</th>
                                    <th className="recentInfo">Quantity</th>
                                    <th className="recentInfo">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {
                                        entriesAndExits?.filter(item => item.exitOrEntry === 'exit').map(item => (
                                            <tr>
                                                <td className="recentInfo">{item.date}</td>
                                                <td className="recentInfo">{(item.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td className="recentInfo">{(item.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                            </tbody>
                        </table>
                    </div>

                    <div className="recentProductPurchases">
                    <h3>Recent Product Purchases</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th className="recentInfo">Date</th>
                                    <th className="recentInfo">Quantity</th>
                                    <th className="recentInfo">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {
                                        entriesAndExits?.filter(item => item.exitOrEntry === 'entry').map(item => (
                                            <tr>
                                                <td className="recentInfo">{item.date}</td>
                                                <td className="recentInfo">{(item.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td className="recentInfo">{(item.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                            </tbody>
                        </table>
                    </div>
                </div>
            
            <div className="overviewAndTransactions">
                <div className="overviewOptions">
                    <button className={overview ? "button" : 'btn'} onClick={() =>{setOverview(true);}}>
                        Overview
                    </button>
                    <button className={!overview ? "button" : 'btn'} onClick={() =>{setOverview(false);}}>
                        All transactions
                    </button>
                </div>
                {
                    overview &&
                    <div className="salesAndPurchaseTrend">
                        <div className="viewOptions">
                            <button className={!viewEntries ? "button" : 'btn'} onClick={() =>{
                                setViewEntries(false);
                            }}>Sales Trend</button>
                            <button className={viewEntries ? "button" : 'btn'} onClick={() =>{
                                setViewEntries(true);
                            }}>Purchase Trend</button>
                        </div>
                        <Barchart
                            labels = {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}
                                data={
                                [jan, feb,mar, apr, may, jun, jul, aug, sept, oct, nov, dec]
                            }
                            tooltip={`${viewEntries ? 'Purchase' : 'Sales'} Trend for ${productName}`}
                        />
                    </div>
                }

                {
                    !overview &&
                    <div className="transactions">
                    <ul className='transactionsHead'>
                        <li>Transaction Date</li>
                        <li>Entry or Exit</li>
                        <li>Quantity</li>
                        <li>Unit Price</li>
                        <li>Amount</li>
                    </ul>
                        {
                            entriesAndExits.sort((a, b) => new Date(b.date) - new Date(a.date)).map(item =>(
                                <ul className='transactionsBody'>
                                    <li>{item.date}</li>
                                    <li>{item.exitOrEntry}</li>
                                    <li>{(item.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>
                                    <li>{(item.up).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>
                                    <li>{(item.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</li>
                                </ul>
                            ))
                        }
                    </div>
                }
            </div>

            {
                fetching &&
                <Loader />
            }

            {
                newProduct &&
                <AddProduct
                    onClick={()=>{
                        setNewProduct(false)
                    }}
                />
            }

            {
                invoice &&
                <Invoice
                    onClick={()=>{
                        setInvoice(false)
                    }}
                />
            }

            {
                receipt &&
                <Receipt
                    onClick={()=>{
                        setReceipt(false)
                    }}
                />
            }

            {
                purchaseInvoice &&
                <PurchaseInvoice
                    onClick={()=>{
                        setPurchaseInvoice(false)
                    }}
                />
            }

            {
                purchaseReceipt &&
                <PurchaseReceipt
                    onClick={()=>{
                        setPurchaseReceipt(false)
                    }}
                />
            }
        </div>
    )
}

export default InventoryPage
