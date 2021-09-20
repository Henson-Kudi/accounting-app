import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import PurchaseInvoice from './PurchaseInvoice'
import InvoiceTemplate from './InvoiceTemplate'
import Loader from './Loader'
import SinglePay from './SinglePay'
import Alert from './Alert'
import MessageBox from './MessageBox'
import {UserContext} from './userContext'

function PurchaseInvoiceDetails() {
    const [makePay, setMakePay] = useState(false)
    const wrapper_Ref = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [payData, setPayData] = useState({})
    const [duplicate, setDuplicate] = useState(false)
    const [inputValue, setInputValue] = useState({
        amountToPay : '',
        meansOfPayment: 'cash'
    })
    const {user} = useContext(UserContext)
    const wrapperRef = useRef(null)
    const {invoiceNumber} = useParams()
    const [newPurchaseInvoice, setNewPurchaseInvoice] = useState(false)
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

            getInvoice(source, unMounted)
            return () => {
                unMounted = true;
                source.cancel('Cancelling request')
            }
        }, [])

        const getInvoice = async(source, unMounted)=>{
            try {
                setFetching(true)
                const fetch = await baseURL.get(`/purchaseInvoices/${invoiceNumber}`, {
                    cancelToken: source.token,
                    headers:{
                        'auth-token': user?.token
                    }
                })
                const res = await fetch.data
                setInvoiceData(res)
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

        return () => {
            document.removeEventListener('mousedown', handleClick_Outside);
        }
    }, [])

    function handleClick_Outside(e) {
        const { current: wrap } = wrapper_Ref;
        if (wrap && !wrap.contains(e.target)) {
            setMakePay(false);
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

    const makePaymentData = {
        userID : user.userID,
        source: 'make payment',
        makePaymentInput : {
            date: new Date().toDateString(),
            meansOfPayment: inputValue.meansOfPayment
        },
        template,
        totalToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay)
    }

    const handleMakePaySubmit = ()=>{
        if (inputValue.amountToPay === '') {
            setAlertMessage('Please add amount to pay')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        }else{
            setLoader(true)
            baseURL.post('/receivePayment', makePaymentData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
                .then(() => {
                    setMakePay(false);
                    setLoader(false)
                })
        }
    }

    const invoiceTemplateData = invoiceData?.map(item => ({
        userID : user.userID,
        invoiceInput: {
            date : item.invoiceInput.date,
            invoiceNumber : item.invoiceInput.invoiceNumber,
            customerName : item.invoiceInput.supplierName,
            dueDate : item.dueDate
        },
        selectInvoiceTerm: item.selectInvoiceTerm,
        customerDetails : item.supplierDetails,
        data : item.data,
        additionsAndSubtractions : item.additionsAndSubtractions,
        discountsAndVat: {
            rebateValue : item.discountsAndVat.rebateValue,
            tradeDiscountValue: item.discountsAndVat.tradeDiscountValue,
            cashDiscountValue : item.discountsAndVat.cashDiscountValue,
            valueAddedTax : item.discountsAndVat.valueAddedTax
        },
        otherAdditions: item.otherAdditions,
        grossAmount: item.grossAmount,
        netPayable: item.netPayable,
        totalPaid: item.totalPaid,
        balanceDue: item.balanceDue,
        dueDate: item.dueDate
    }))

    const dueDateCalc = (value) => {
        const today = new Date(`${month + 1}/${day}/${year}`);
        const futureDate = new Date(today.setDate(today.getDate() + Number(value)))
        return futureDate.toDateString();
    }

    const invoiceDuplicate = {
        userID : user.userID,
        invoiceInput: {
            date: today.toDateString(),
            invoiceNumber: payData.invoiceInput?.invoiceNumber + 'copy',
            customerName: payData.invoiceInput?.customerName,
            additionalInfo: payData.invoiceInput?.additonalInfo,
            dueDate: dueDateCalc(payData?.selectInvoiceTerm)
        },
        selectInvoiceTerm: payData?.selectInvoiceTerm,
        supplierDetails: payData?.supplierDetails,
        additionsAndSubtractions: payData?.additionsAndSubtractions ? payData?.additionsAndSubtractions : {
            rebate: '',
            tradeDiscount: '',
            cashDiscount: '',
            valueAddedTax: ''
        },
        data: payData?.data,
        otherAdditions: payData.otherAdditions ? payData.otherAdditions : [],
        discountsAndVat: payData?.discountsAndVat,
        grossAmount: payData?.grossAmount,
        netPayable: payData?.netPayable,
        dueDate: dueDateCalc(payData?.selectInvoiceTerm),
        totalPaid: 0,
        balanceDue: payData?.netPayable
    }

    const handleDuplicate = async()=>{
        await baseURL.post('/purchaseInvoice', invoiceDuplicate, {
            headers :{
                'auth-token' : user?.token
            }
        })
        .then(async(res) => {
            setAlertMessage('Duplicate created Successfully')
            setLoader(false)
                setAlert(true)
                setTimeout(() => {
                    setAlertMessage('')
                    setAlert(false)
            }, 3000)
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
                    setMakePay(true)
                }}>Make Payment</button>
                <button className="invoiceButton" onClick={()=>{setNewPurchaseInvoice(true)}}>New Invoice</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={()=>{
                            setDuplicate(true)
                            setPayData(invoiceData[0])
                        }}>Duplicate
                        {/* <i className="fas fa-sort-down"></i> */}
                        </button>
                        {/* <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={handlePrint}>Print Invoice</p>
                            <p className="option" onClick={handleSendInvoice}>Export PDF</p>
                            <p className="option" onClick={handleSendInvoice}>Send Invoice</p>
                        </div> */}
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
                                    <p>Supplier Name</p>
                                    <p><Link to={`/suppliers/${item.supplierDetails.name}`} className='custName'>{item.supplierDetails.name.slice(0, 25)}...</Link></p>
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
                    invoiceTemplateData?.map(item => (
                        <InvoiceTemplate
                            data = {item}
                        />
                    ))
                }

            {
                newPurchaseInvoice && 
                <PurchaseInvoice
                newInvoice={()=>{setNewPurchaseInvoice(true)}}
                onClick={()=>{setNewPurchaseInvoice(false)}}
                refetch={() =>{
                    setAlert(true);
                    setAlertMessage('Purchase Invoice Added Successfully');
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
                makePay &&
                <SinglePay
                    totalDebt = {!payData.netPayable ? '' : (Number(payData?.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    totalPaid = {!payData.netPayable ? '' : (Number(payData?.totalPaid).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    balance = {!payData.netPayable ? '' : (Number(payData?.balanceDue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    inputValue = {inputValue}
                    handleChange = {(e)=>{handleSingleChange(e)}}
                    cancel = {()=>{setMakePay(false)}}
                    submit = {handleMakePaySubmit}
                    />
                    }
                </div>
                <Alert
                    alert={alert}
                    message={alertMessage}
                />
                {
                    duplicate && 
                    <MessageBox
                        submit={handleDuplicate}
                        onClick={()=>{setDuplicate(false)}}
                        message={'duplicate this invoice'}
                    />
                }
        </div>
    )
}

export default PurchaseInvoiceDetails
