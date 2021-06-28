import React, {useRef, useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import PurchaseOrder from './PurchaseOrder'
import InvoiceTemplate from './InvoiceTemplate'
import Loader from './Loader'
import ConfirmMessageBox from './ConfirmMessageBox'
import Alert from './Alert'

function PurchaseOrderDetails() {
    const wrapperRef = useRef(null)
    const {orderNumber} = useParams()
    const [newOrder, setNewOrder] = useState(false)
    const [loader, setLoader] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [orderData, setOrderData] = useState([])
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

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

    const [upDateToInvoice, setUpdateToInvoice] = useState(false)

    const ref = useRef(null)

    const handleStyling = ()=>{
        styler.visibility === 'hidden' ? setStyler({transform: 'translateY(0)', visibility: 'visible'}) : setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
    }

    useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);

            return ()=>{
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [])

        function handleClickOutside(e){
                const {current : wrap} = wrapperRef;
                if(wrap && !wrap.contains(e.target)){
                    setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
                }
        }

        useEffect(() => {
            let unMounted = false;
            let source = axios.CancelToken.source();

            getOrder(source, unMounted)
            return () => {
                unMounted = true;
                source.cancel('Cancelling request')
            }
        }, [])

        const getOrder = async(source, unMounted)=>{
            try {
                setFetching(true)
                const fetch = await baseURL.get(`/purchaseOrders/${orderNumber}`, {
                    cancelToken: source.token
                })
                const res = await fetch.data
                setOrderData(res)
                setFetching(false)
            } catch (err) {
                if (!unMounted) {
                    if (axios.isCancel(err)) {
                        console.log('Request Cancelled');
                    }else{
                        console.log('Something went wrong');
                    }
                }
            }
        }

    const handlePrint = ()=>{
        setLoader(true)
        setTimeout(()=>{
            setLoader(false)
            print({
            printable : 'invoiceTemplate',
            type: 'html',
            targetStyles: ['*'],
            maxWidth: '120%',
            documentTitle: '@HK Solutions',
        })
        }, 1000)
    }


    useEffect(() => {
        document.addEventListener('mousedown', handleClick_Outside);

        return ()=>{
            document.removeEventListener('mousedown', handleClick_Outside);
        }
    }, [])

    function handleClick_Outside(e){
        const {current : wrap} = ref;
        if(wrap && !wrap.contains(e.target)){
            setUpdateToInvoice(false);
        }
    }

    const invoiceData = orderData?.map(item => (
        {
            invoiceInput: item?.orderInput,
            selectInvoiceTerm : item?.selectInvoiceTerm,
            supplierDetails : item?.supplierDetails,
            data : item?.data,
            additionsAndSubtractions : item?.additionsAndSubtractions,
            discountsAndVat: item?.discountsAndVat,
            otherAdditions: item?.otherAdditions,
            grossAmount: item?.grossAmount,
            netPayable: item?.netPayable,
            totalPaid: item?.totalPaid,
            balanceDue: item?.balanceDue,
            dueDate: item?.dueDate
        }
    ))

    const invoiceTemplateData = orderData?.map(item => (
        {
            invoiceInput: {
                date: item.orderInput.date,
                customerName: item.orderInput.supplierName,
                dueDate: item?.orderInput.dueDate
                },
            selectInvoiceTerm : item?.selectInvoiceTerm,
            customerDetails : item?.supplierDetails,
            data : item?.data,
            additionsAndSubtractions : item?.additionsAndSubtractions,
            discountsAndVat: item?.discountsAndVat,
            otherAdditions: item?.otherAdditions,
            grossAmount: item?.grossAmount,
            netPayable: item?.netPayable,
            totalPaid: item?.totalPaid,
            balanceDue: item?.balanceDue,
            dueDate: item?.dueDate
        }
    ))

    const handleInvoiceSubmit = ()=>{
        
        baseURL.post('/purchaseInvoice', invoiceData[0])
        // .then(() => axios.get(`/invoices/${quoteInput.invoiceNumber}`, {responseType: 'blob'}))
        // .then(res => {
            
        //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
        //     saveAs(pdfBlob, `invoiceNumber${quoteInput.invoiceNumber}`)
        //     axios.post(`/sendInvoice/${quoteInput.invoiceNumber}`, {customerDetails})
            
            .then((res)=>{
                console.log(res.data);
                setUpdateToInvoice(false);
                setFetching(false)
                setAlert(true)
                setAlertMessage('Updated To Invoice Successfully')
                setTimeout(()=>{
                    setAlert(false)
                    setAlertMessage('')
                }, 2000)
            })
        // })
    }

    const handleExportPdf = ()=>{
        setAlert(true);
        setAlertMessage('function coming soon!!!');
        setTimeout(() => {
            setAlert(false);
            setAlertMessage('');
        }, 2000)
    }



    return (
        <div className='Invoices'>
            {
                !fetching && <div className="invoicesHeading">
                <h1>Order #{orderData?.map(item => item.orderInput.orderNumber)}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton" onClick={()=>{setNewOrder(true)}}>Place New Order</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={handlePrint}>Print Order</p>
                            <p className="option" onClick={()=>{
                                setUpdateToInvoice(true)
                            }}>Convert To Invoice</p>
                            <p className="option" onClick={handleExportPdf}>Export PDF</p>
                        </div>
                    </div>
                </div>
            </div>
            }

            {
                upDateToInvoice &&
            <div className='upDateQuoteToInvoice' ref={ref}>
                <ConfirmMessageBox
                    message="Confirm Update Order to Invoice??"
                    submit={handleInvoiceSubmit}
                />
            </div>
            }

            {
                invoiceTemplateData?.map((item, i) => (
                    <InvoiceTemplate
                    key={item.i}
                        data = {item}
                    />
                ))
            }

            {
                newOrder && 
                <PurchaseOrder
                onClick={()=>{setNewOrder(false)}}
                fetching={()=>{
                    setAlert(true)
                    setAlertMessage('Order Added Successfully')
                    setTimeout(()=>{
                        setAlert(false)
                        setAlertMessage('')
                    }, 2000)
                }}
                />
            }
            {
                loader && <Loader/>
            }
            {
                fetching && <Loader/>
            }
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default PurchaseOrderDetails
