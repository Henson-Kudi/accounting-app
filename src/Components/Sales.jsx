import React, { useState, useRef, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
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
import Alert from './Alert'

function Sales() {

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [invoice, setInvoice] = useState(false)
    const [receipt, setReceipt] = useState(false)
    const [receivePayment, setReceivePayment] = useState(false)
    const [quotation, setQuotation] = useState(false)
    const [creditNote, setCreditNote] = useState(false)
    const [fetching, setFetching] = useState(true)
    const history = useHistory()

    const [salesData, setSalesData] = useState([])
    const [graphInfo, setGraphInfo] = useState([])
    const [creditSalesGraph, setCreditSalesGraph] = useState([])
    const [cashSalesGraph, setCashSalesGraph] = useState([])
    const [returns, setReturns] = useState([])

    useEffect(async() => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        await baseURL.get('/sales', {
            cancelToken: source.token
        })
        .then(res => {
            console.log(res.data);
            const sales = res.data.sales
            setSalesData(res.data.sales)
            setGraphInfo(res.data.graph)
            setCreditSalesGraph(res.data.creditSales)
            setCashSalesGraph(res.data.cashSales)
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

        const creditSales = salesData?.filter(a => {
            return (a.saleType === 'credit')
        }).map(a => a.amount). reduce((a,b)=> a + b,0)

        const cashSaleElements = []

    salesData?.filter(a => {
        if(a.saleType === 'cash'){
            cashSaleElements.push(a)
        }
        if(a.saleType === 'bank'){
            cashSaleElements.push(a)
        }
        if(a.saleType === 'mobileMoney'){
            cashSaleElements.push(a)
        }
    })

    const cashSales = cashSaleElements?.map(a => a.amount).reduce((a, b) => a + b, 0)
    

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
                <h1>Sales Dashboard</h1>
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                        <p className="option" onClick={()=>{setInvoice(true)}}>New Invoice</p>
                            <p className="option" onClick={()=>{setReceipt(true)}}>New Receipt</p>
                            <p className="option" onClick={()=>{setCreditNote(true)}}>Sales Returns</p>
                            <p className="option" onClick={()=>{setReceivePayment(true)}}>Receive Payment</p>
                            <p className="option" onClick={()=>{setQuotation(true)}}>Quotation</p>
                        </div>
                </div>
            </div>

            <div className="salesMiddle">
                <div className="salesTotals">
                    <div className="cashSales" data-text='go to receipts' onClick={()=>{history.push('/receipts')}}>
                        <h5>Total Sales Receipts</h5>
                        <p><b>{(Number(cashSales)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                    <div className="creditSales" data-text='go to invoices' onClick={()=>{history.push('/invoices')}}>
                        <h5>Total Credit Sales</h5>
                        <p><b>{(Number(creditSales)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                    </div>

                        <div className="salesReturns" data-text='go to credit notes' onClick={()=>{history.push('/credit-notes')}}>
                            <h5>Total Sales Returns</h5>
                            <p style={{color: 'red'}}><b>{(Number(salesReturns)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></p>
                        </div>
                </div>

                <Barchart
                    labels={months}
                    data3={values}
                    tooltip3='Total Sales Per Month'
                    data1={creditSalesGraph?.map(item => item.value)}
                    tooltip1='Credit Sales'
                    data2={cashSalesGraph?.map(item => item.value)}
                    tooltip2='Sales Receipts'
                />
            </div>

            {
                invoice && <Invoice
                    onClick={()=>{setInvoice(false)}}
                    refetch={() =>{
                    setAlert(true);
                    setAlertMessage('Invoice Added Successfully');
                    setTimeout(() => {
                    setAlert(false);
                    setAlertMessage('');
                    }, 2000)
                    }}
                />
            }
            {
                receipt && <Receipt
                    onClick={()=>{
                        setReceipt(false)
                    }}
                    refetch={() =>{
                    setAlert(true);
                    setAlertMessage('Receipt Added Successfully');
                    setTimeout(() => {
                    setAlert(false);
                    setAlertMessage('');
                    }, 2000)
                    }}
                />
            }
            {
                receivePayment && <ReceivePayment
                    onClick={()=>{
                        setReceivePayment(false)
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
                quotation && <Quotation
                    onClick={()=>{
                        setQuotation(false)
                    }}
                    refetch={() =>{
                    setAlert(true);
                    setAlertMessage('Quotation Added Successfully');
                    setTimeout(() => {
                    setAlert(false);
                    setAlertMessage('');
                    }, 2000)
                    }}
                />
            }
            {
                creditNote && <CreditNote
                    onClick={()=>{
                        setCreditNote(false)
                    }}
                    refetch={() =>{
                    setAlert(true);
                    setAlertMessage('Credit Note Added Successfully');
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
                alert &&
                <Alert
                    alert={alert}
                    message={alertMessage}
                />
            }
        </div>
    )
}

export default Sales
