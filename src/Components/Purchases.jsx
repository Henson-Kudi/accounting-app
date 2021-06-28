import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
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
import Alert from './Alert'

function Purchases() {

    const history = useHistory()
    const [purchaseInvoice, setPurchaseInvoice] = useState(false)
    const [cashPurchase, setCashPurchase] = useState(false)
    const [makePayment, setMakePayment] = useState(false)
    const [purchaseOrder, setPurchaseOrder] = useState(false)
    const [purchaseReturns, setPurchaseReturns] = useState(false)
    const [newSupplier, setNewSupplier] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [purchaseData, setPurchaseData] = useState([])
    const [graphInfo, setGraphInfo] = useState([])
    const [creditPurchasesGraph, setCreditPurchasesGraph] = useState([])
    const [cashPurchasesGraph, setCashPurchasesGraph] = useState([])
    // const [recentPurchases, setRecentPurchases] = useState([])
    // const [creditors, setCreditors] = useState([])
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
                setCreditPurchasesGraph(res.data.creditPurchases)
                setCashPurchasesGraph(res.data.cashPurchases)
                // setRecentPurchases(purchases.slice(purchases.length - 5))
                // setCreditors(res.data.creditors)
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
    
    const values = graphInfo?.map(a => a.value)
    const months = graphInfo?.map(a => a.month)

    const purchasesReturns = returns?.map(a => a.netPayable).reduce((a, b) => a + b, 0)


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
        <div className='Sales Invoices'>
            <div className="invoicesHeading">
                <h1>Purchases Dashboard</h1>
                <div className="moreOptions">
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                        <p className="option" onClick={()=>{setPurchaseInvoice(true)}}>Purchase Invoice</p>
                            <p className="option" onClick={()=>{setCashPurchase(true)}}>Purchase Receipt</p>
                            <p className="option" onClick={()=>{setPurchaseReturns(true)}}>Purchase Returns</p>
                            <p className="option" onClick={()=>{setPurchaseOrder(true)}}>Purchase Order</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="salesMiddle">
                <div className="salesTotals">
                    <div className="cashSales" data-text='purchase receipts' onClick={()=>{history.push('/purchase-receipts')}}>
                        <h5>Total Cash Purchases</h5>
                        <p><b>{cashPurchases?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                    <div className="creditSales" data-text='purchase invoices' onClick={() => { history.push('/purchase-invoices') }}>
                        <h5>Total Credit Purchases</h5>
                        <p><b>{creditPurchases?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                        <div className="salesReturns" data-text='purchase returns' onClick={()=>{history.push('/purchase-returns')}}>
                            <h5>Total Purchase Returns</h5>
                            <p style={{ color: 'red' }}><b>{purchasesReturns?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                        </div>
                </div>

                <Barchart
                    labels={months}
                    data3={values}
                    tooltip3='Total Monthly Purchases'
                    data1={creditPurchasesGraph?.map(item => item.value)}
                    tooltip1='Credit Purchases'
                    data2={cashPurchasesGraph?.map(item => item.value)}
                    tooltip2='Cash Purchases'
                />
            </div>

            {
                purchaseInvoice && <PurchaseInvoice
                    onClick={() => { setPurchaseInvoice(false) }}
                    refetch={() =>{
                        setAlert(true);
                        setAlertMessage('Purchase Invoice Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('')
                    }, 2000)
                    }}
                />
            }
            {
                cashPurchase && <CashPurchase
                    onClick={() => {
                        setCashPurchase(false)
                    }}
                    refetch={() =>{
                        setAlert(true);
                        setAlertMessage('Purchase Receipt Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                    }, 2000)
                    }}
                />
            }
            {
                makePayment && <MakePayment
                    onClick={() => {
                        setMakePayment(false)
                    }}
                    refetch={() =>{
                        setAlert(true);
                        setAlertMessage('Payment Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                    }, 2000)
                    }}
                />
            }
            {
                purchaseOrder && <PurchaseOrder
                    onClick={() => {
                        setPurchaseOrder(false)
                    }}
                    refetch={() =>{
                        setAlert(true);
                        setAlertMessage('Purchase Order Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                    }, 2000)
                    }}
                />
            }
            {
                purchaseReturns && <PurchaseReturns
                    onClick={() => {
                        setPurchaseReturns(false)
                    }}
                    refetch={() =>{
                        setAlert(true);
                        setAlertMessage('Puirchase Returns Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                    }, 2000)
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
                    refetch={() =>{
                        setAlert(true);
                        setAlertMessage('Supplier Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                    }, 2000)
                    }}
                />
            }
            <Alert
                aler={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default Purchases
