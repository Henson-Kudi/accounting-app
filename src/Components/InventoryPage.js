import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'
import {baseURL} from './axios'
import './InventoryPage.css'
import './Sales.css'
import Barchart from './Barchart'
import Loader from './Loader'
import Invoice from './Invoice'
import AddProduct from './AddProductForm'
import Receipt from './Receipt'
import PurchaseInvoice from './PurchaseInvoice'
import PurchaseReceipt from './CashPurchase'
import Alert from './Alert'

function InventoryPage({productId, productName}) {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [fetching, setfetching] = useState(false)
    const [newProduct, setNewProduct] = useState(false)
    const [invoice, setInvoice] = useState(false)
    const [receipt, setReceipt] = useState(false)
    const [purchaseInvoice, setPurchaseInvoice] = useState(false)
    const [purchaseReceipt, setPurchaseReceipt] = useState(false)
    const [overview, setOverview] = useState(true)

    const [products, setProducts] = useState([])
    const [entriesAndExits, setEntriesAndExits] = useState([])
    
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
                setNewProduct(false);
            }
        }

    useEffect(async() => {
        setfetching(true)
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get(`/products/${productId}`)
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

        entries.filter( element => {
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

    const janEx1 = []
    const janEx2 = []
    const janEx3 = []
    const janEx4 = []
    const janEx5 = []
    const janEx6 = []
    const janEx7 = []
    const janEx8 = []
    const janEx9 = []
    const janEx10 = []
    const janEx11 = []
    const janEx12 = []

    exits.filter( element => {
        const month = new Date(element.date).getMonth()
        switch (month) {
            case 0:
                janEx1.push(element.amount)
                break;
            
            case 1:
                janEx2.push(element.amount)
                break;

            case 2:
                janEx3.push(element.amount)
                break;

            case 3:
                janEx4.push(element.amount)
                break;

            case 4:
                janEx5.push(element.amount)
                break;

            case 5:
                janEx6.push(element.amount)
                break;

            case 6:
                janEx7.push(element.amount)
                break;

            case 7:
                janEx8.push(element.amount)
                break;

            case 8:
                janEx9.push(element.amount)
                break;

            case 9:
                janEx10.push(element.amount)
                break;

            case 10:
                janEx11.push(element.amount)
                break;
        
            case 11:
                janEx12.push(element.amount)
                break;

            
            default: return null
                break;
        }
    })



    const recentProductSales = entriesAndExits?.filter(item => item.exitOrEntry === 'exit').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0,5)

    const recentProductPurchases = entriesAndExits?.filter(item => item.exitOrEntry === 'entry').sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0,5)

    const  janEntry1 = jan.reduce((a, b) => Number(a) + Number(b), 0)
    const  janEntry2 = feb.reduce((a, b) => Number(a) + Number(b), 0)
    const  janEntry3 = mar.reduce((a, b) => Number(a) + Number(b), 0)
    const  janEntry4 = apr.reduce((a, b) => Number(a) + Number(b), 0)
    const  janEntry5 = may.reduce((a, b) => Number(a) + Number(b), 0)
    const  janEntry6 = jun.reduce((a, b) => Number(a) + Number(b), 0)
    const  janEntry7 = jul.reduce((a, b) => Number(a) + Number(b), 0)
    const  janEntry8 = aug.reduce((a, b) => Number(a) + Number(b), 0)
    const  janEntry9 = sept.reduce((a, b) => Number(a) + Number(b), 0)
    const janEntry10 = oct.reduce((a, b) => Number(a) + Number(b), 0)
    const janEntry11 = nov.reduce((a, b) => Number(a) + Number(b), 0)
    const janEntry12 = dec.reduce((a, b) => Number(a) + Number(b), 0)

    const janExit1 = janEx1.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit2 = janEx2.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit3 = janEx3.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit4 = janEx4.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit5 = janEx5.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit6 = janEx6.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit7 = janEx7.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit8 = janEx8.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit9 = janEx9.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit10 = janEx10.reduce((a, b) => Number(a) + Number(b), 0)
    const janExit11 = janEx11.reduce((a, b) => Number(a) + Number(b), 0)    
    const janExit12 = janEx12.reduce((a, b) => Number(a) + Number(b), 0)


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
                <h1>Product: {products.map(product => product.productName)}</h1>
                <div className="moreOptions">
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                        <p className="option" onClick={()=>{setPurchaseInvoice(true)}}>Purchase Invoice</p>
                            <p className="option" onClick={()=>{setPurchaseReceipt(true)}}>Purchase Receipt</p>
                            <p className="option" onClick={()=>{setInvoice(true)}}>Sales Invoice</p>
                            <p className="option" onClick={()=>{setReceipt(true)}}>Sales Receipt</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="filterContainer">
                <div className='filter'>
                    <button
                        className={overview ? 'button' : 'btn'}
                        onClick={() => {
                            setOverview(true)
                        }}
                    >
                        Overview
                    </button>

                    <button
                        className={!overview ? 'button' : 'btn'}
                        onClick={() => {
                            setOverview(false)
                        }}
                    >
                        All Transactions
                    </button>
                </div>
            </div>

            {
                overview &&
                <div className="customerBodyELements">
                {
                    products.map(item => (
                        <div className="customerDetailsInfo">
                            <i class="fas fa-image fa-5x"></i>
                            <div className="customerName group">
                                <h2>Name: {item.productName}</h2>
                                <p>{item.description}</p>
                                <p className='detail'>Unit Selling Price: {unitSp[0]}</p>
                                
                            </div>
                            

                            <div className="contactInfos group">
                                <h3 className='customerDetail'><u>Stock Info</u></h3>
                                <p className='detail'>Qty In Stock: {(totalEntriesQty - totalExitsQty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>

                                <p className='detail'><b>Value In Stock: &nbsp; </b> {((Number(totalEntriesAmount) - Number(totalExitsAmount)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    
                                <p className='detail'><b>WAC/Unit:</b> {(wac).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    
                                <p className='detail'><b>Gross Profit/Unit:</b> <span style={{color: grossProfit < 0 ? 'red' : 'black'}}>{(grossProfit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                <p className='detail'><b>Gross Profit(%):</b> <span style={{color: grossProfit < 0 ? 'red' : 'black'}}>{(((unitSp[0] - wac)/unitSp[0])*100).toFixed(2)}</span></p>
                            </div>
                        </div>
                    ))
                }
                
                    <div className="recentAndBarChart">
                        <div className="recentTransactions">
                            <div className="totalPurchases">
                                <p><b>Total Entries</b></p>
                                <p><span style= {{padding: '0.5rem'}}><b>Qty:</b></span>{(Number(totalEntriesQty).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                <p><span style={{padding: '0.5rem'}}><b>Amount:</b></span>{(Number(totalEntriesAmount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="totalPurchases">
                                <p><b>Total Exits</b></p>
                                <p><p><span style={{padding: '0.5rem'}}><b>Qty:</b></span>{(Number(totalExitsQty).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                <p><span style={{padding: '0.5rem'}}><b>Amount:</b></span>{(Number(totalExitsAmount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p></p>
                            </div>
                            
                        </div>

                        <div className="barChartChart">
                            <Barchart
                            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']}
                            data1={
                                [janEntry1, janEntry2, janEntry3, janEntry4, janEntry5, janEntry6, janEntry7, janEntry8, janEntry9, janEntry10, janEntry11, janEntry12]
                            }
                            tooltip1={`Credit Purchases`}
                            data2={
                                [janExit1, janExit2, janExit3, janExit4, janExit5, janExit6, janExit7, janExit8, janExit9, janExit10, janExit11, janExit12]
                            }
                            tooltip2={`Cash Purchases`}
                            />
                        </div>

                    </div>
            </div>
            }

            <div className='allDebtorsContainer'>
                    {
                        !overview &&
                            entriesAndExits.length > 0 ? 
                            <table className="allDebtorsTable">
                                <thead>
                                    <tr className='invoiceListHead'>
                                        <th>Date</th>
                                        <th>Entry or Exit</th>
                                        <th>Quantity</th>

                                        <th>Unit Price</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {
                                        entriesAndExits?.map((invoice, index) => (
                                            <tr className='invoiceListbody'>
                                                <td>{new Date(invoice.date).toLocaleDateString()}</td>
                                                <td>{invoice.exitOrEntry}</td>
                                                <td>{Number(invoice.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(Number(invoice.up).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>{(Number(invoice.amount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : !overview && <h2 className='noData'>No Transactions To Display. Please Record Transactions</h2>
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
                        }, 2000)
                    }}
                />
            }
            {
                purchaseReceipt && <PurchaseReceipt
                    onClick={() => {
                        setPurchaseReceipt(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Purchase Receipt Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000)
                    }}
                />
            }
            {
                invoice && <Invoice
                    onClick={() => {
                        setInvoice(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Sales Invoice Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000)
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
                        }, 2000)
                    }}
                />
            }

            {
                fetching && <Loader />
            }

            {
                newProduct && <div ref={wrapperRef}>
                    <AddProduct
                    onClick={() => {
                        setNewProduct(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Product Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000)
                    }}
                />
                </div>
            }
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default InventoryPage
