import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Invoice from './Invoice'
import InvoiceTemplate from './InvoiceTemplate'
import Loader from './Loader'
import SinglePay from './SinglePay'
import Alert from './Alert'
import { UserContext} from './userContext'

function InvoiceDetails() {
    const {user} = useContext(UserContext)
    const [receivePay, setReceivePay] = useState(false)
    const wrapper_Ref = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [payData, setPayData] = useState({})
    const [inputValue, setInputValue] = useState({
        amountToPay : '',
        meansOfPayment: 'cash'
    })
    const wrapperRef = useRef(null)
    const {invoiceNumber} = useParams()
    const [newInvoice, setNewInvoice] = useState(false)
    const [loader, setLoader] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [invoiceData, setInvoiceData] = useState([])

    const [statusStyles, setStatusStyles] = useState({
        color: 'white',
        backgroundColor: 'blue',
        borderRadius: '0.5rem 2rem',
        width: 'max-content',
        padding: '1rem',
        textAlign: 'left',
    })

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

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchInvoice(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const fetchInvoice = async(source, unMounted)=>{
        try {
            setLoader(true)
            const res = await baseURL.get(`/invoices/${invoiceNumber}`, {
                cancelToken: source.token,
                headers:{
                    'auth-token': user?.token
                }
            })
            setInvoiceData(res.data)
            setLoader(false)
        } catch (error) {
            if (!unMounted) {
                if (axios.isCancel(error)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        }
    }

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


    const dueDate = new Date(invoiceData?.map(item => item.dueDate))
    const dueDay = dueDate.getDate()
    const dueMonth = dueDate.getMonth()
    const dueYear = dueDate.getFullYear()

    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth()
    const year = today.getFullYear()


    let status = '';
    let backgroundColor = ''

    if (year === dueYear) {
        if (month < dueMonth) {
            status = 'Not Due';
            backgroundColor = 'rgba(0, 0, 255, 0.5)'
        }
        if (month === dueMonth) {
            if (day === dueDay) {
                status = 'Due Today'
                backgroundColor = 'rgba(0, 0, 255, 0.5)'
            }
            if (day < dueDay) {
                status = `Due in ${dueDay - day} days`
                backgroundColor = 'rgba(0, 0, 255, 0.5)'
            }
            if (day > dueDay) {
                status = `Overdue ${day - dueDay} days`
                backgroundColor = 'rgba(255, 0, 0, 0.7)'
            }
        }
        if (month > dueMonth) { 
            status = 'Overdue'
            backgroundColor = 'rgba(255, 0, 0, 0.7)'
        }
    }else if (year < dueYear) {
        status = 'Not Due'
        backgroundColor = 'rgba(0, 0, 255, 0.5)'
    }else{
        status = 'Overdue'
        backgroundColor = 'rgba(255, 0, 0, 0.7)'
    }

useEffect(() => {
        document.addEventListener('mousedown', handleClick_Outside);

        return () => {
            document.removeEventListener('mousedown', handleClick_Outside);
        }
    }, [])

    function handleClick_Outside(e) {
        const { current: wrap } = wrapper_Ref;
        if (wrap && !wrap.contains(e.target)) {
            setReceivePay(false);
        }
    }

    const handleSingleChange = (e)=>{
        const {name, value} = e.target
        setInputValue(prev => (
            {
                ...prev,
                [name] : value
            }
        ))
    }

    const template = [{
        ...payData,
        date: new Date().toDateString(),
        amountToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay),
        meansOfPayment: inputValue.meansOfPayment
    }]

    const receivePaymentData = {
        userID : user.userID,
        source: 'receive payment',
        submitTemplates: template,
        totalToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay),
        paymentNumber : new Date().valueOf(),
    }

    const handleReceivePaySubmit = async()=>{
        if (inputValue.amountToPay === '') {
            setAlertMessage('Please add amount to pay')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        }else{
            setLoader(true)
            await baseURL.post('/receivePayment', receivePaymentData, {
                    headers :{
                        'auth-token' : user?.token
                    }
                })
                .then(async(res) =>{
                    const response = await res.data 
                    await baseURL.get(`/receiptPaymentTemplates/${response.paymentNumber}-${user.userID}`, {
                        responseType: 'blob',
                        headers : {
                            'auth-token' : user?.token
                        }
                    })
                    .then(async(res) => {
                        const response = await res.data
                        const pdfBlob = new Blob([response], {type:'application/pdf'})
                        saveAs(pdfBlob, `payment-receipt-number${receivePaymentData.paymentNumber}`)
                    })
                })
                .then(() => {
                    setReceivePay(false);
                    setLoader(false)
                })
        }
    }

    const invoice = invoiceData?.map(item => item.invoiceInput.invoiceNumber)

    const handlePrint = async()=>{
        await baseURL.get(`/invoiceTemplates/${invoice}-${user.userID}`, {
            responseType: 'blob',
            headers: {
                'auth-token' : user?.token
            }
        })
            .then(async(res) => {
                const response = await res.data
                const pdfBlob = new Blob([response], {type:'application/pdf'})

                const pdfUrl = URL.createObjectURL(pdfBlob)

                print({
                    printable : pdfUrl,
                    type: 'pdf',
                    documentTitle: '@HK Solutions',
                })
                
            })
    }

    const handleSendInvoice = async() => {
        setFetching(true)
        await baseURL.post(`/sendInvoice/${invoice}-${user.userID}`, invoiceData[0], {
            headers : {
                'auth-token' : user?.token
            }
        })
        .then(async(res) => {
            setFetching(false)
            const response = await res.data
            setAlertMessage(response.message)
            setAlert(true)
            setTimeout(()=>{
                setAlertMessage('')
                setAlert(false)
            },3000)
        })
    }

    const handleExportPDF = async ()=>{
        await baseURL.get(`/invoiceTemplates/${invoice}-${user.userID}`, {
            responseType: 'blob',
            headers : {
                'auth-token' : user?.token
            }
        })
            .then(async(res) => {

        const pdfBlob = new Blob([res.data], {type:'application/pdf'})
                saveAs(pdfBlob, `invoiceNumber${invoice}`)
        })
    }



    return (
        <div className='Invoices'>
            {
                !fetching && <div className="invoicesHeading">
                <h1>Invoice #{invoiceData?.map(item => item.invoiceInput.invoiceNumber)}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton" onClick={()=>{
                    setPayData(invoiceData[0])
                    setReceivePay(true)
                }}>Receive Payment</button>
                <button className="invoiceButton" onClick={()=>{setNewInvoice(true)}}>New Invoice</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={handlePrint}>Print Invoice</p>
                            <p className="option" onClick={handleExportPDF}>Export PDF</p>
                            <p className="option" onClick={handleSendInvoice}>Send Invoice</p>
                        </div>
                    </div>
                </div>
            </div>
            }
                {
                    invoiceData?.map(item => (
                        !fetching && <div className="customerQuickDetails">
                            <div className="leftDetail">
                                <div className="status" style={{
                                    ...statusStyles,
                                    backgroundColor: backgroundColor
                                }}>
                                    <p>Status</p>
                                    <p>{status}</p>
                                </div>
                                <div className="customer specificItem">
                                    <p>Customer Name</p>
                                    <p><Link to={`/customers/${item.customerDetails.name}`} className='custName'>{item.customerDetails.name.slice(0, 25)}...</Link></p>
                                </div>
                            </div>
                            <div className="rightDetail">
                                <div className="totalDebt specificItem">
                                    <p>Total Debt</p>
                                    <p>{(Number(item.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                </div>
                                <div className="totalDebt specificItem">
                                    <p>Total Paid</p>
                                    <p>{(Number(item.totalPaid).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                </div>
                                <div className="amountOwing specificItem">
                                    <p>Balance</p>
                                    <p>{(Number(item.balanceDue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                </div>
                            </div>
                        </div>
                    ))
                }

                {
                    invoiceData?.map(item => (
                        <InvoiceTemplate
                    data = {item}
                />
                    ))
                }

            {
                newInvoice && 
                <Invoice
                    newInvoice={()=>{setNewInvoice(true)}}
                    onClick={()=>{setNewInvoice(false)}}
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
                loader && <Loader/>
            }
            {
                fetching && <Loader/>
            }
            <div ref={wrapper_Ref}>
                {
                receivePay &&
                <SinglePay
                    totalDebt = {!payData.netPayable ? '' : (Number(payData?.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    totalPaid = {!payData.netPayable ? '' : (Number(payData?.totalPaid).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    balance = {!payData.netPayable ? '' : (Number(payData?.balanceDue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    inputValue = {inputValue}
                    handleChange = {(e)=>{handleSingleChange(e)}}
                    cancel = {()=>{setReceivePay(false)}}
                    submit = {handleReceivePaySubmit}
                    />
                    }
                </div>
                <Alert
                    alert={alert}
                    message={alertMessage}
                />
        </div>
    )
}

export default InvoiceDetails
