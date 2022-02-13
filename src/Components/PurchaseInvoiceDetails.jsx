import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link, useHistory} from 'react-router-dom'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Loader from './Loader'
import SinglePay from './SinglePay'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'
import PurchaseInvoiceTemplate from './PurchaseInvoiceTemplate'

function PurchaseInvoiceDetails() {
    const history = useHistory()
    const {user} = useContext(UserContext)
    const [receivePay, setReceivePay] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const wrapper_Ref = useRef(null)
    const wrapperRef = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [payData, setPayData] = useState({})
    const [inputValue, setInputValue] = useState({
        amountToPay : '',
        meansOfPayment: 'cash'
    })
    const {invoiceNumber} = useParams()

    const {data:suppliers, loader, setLoader} = useFetch('suppliers', [])
    const {data: invoiceData} =useFetch(`purchaseInvoices/${invoiceNumber}`, {})

    const statusStyles = {
        color: 'white',
        backgroundColor: 'blue',
        borderRadius: '0.5rem 2rem',
        width: 'max-content',
        padding: '1rem',
        textAlign: 'left',
    }

    const dueDate = new Date(invoiceData?.input?.dueDate)
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

    const handleStyling = () => {
        wrapperRef.current.classList.toggle('showOptions')
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            wrap.classList.remove('showOptions')
        }
    }

    const template = [{
        ...payData,
        date: new Date().toDateString(),
        amountToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay),
        meansOfPayment: inputValue.meansOfPayment
    }]

    const receivePaymentData = {
        userID : user.userID,
        source: 'make payment',
        submitTemplates: template,
        totalToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay),
        paymentNumber : new Date().valueOf(),
    }

    const handleDelete = async ()=>{
        try {
            setLoader(true);
            const res = await baseURL.delete(`purchaseInvoices/${invoiceNumber}`, {
                headers : {
                    'auth-token' : user?.token
                }
            })

            const {data} = await res
            data.status === 200 ? history.goBack() : setAlertMessage(data.message); setAlert(true); setTimeout(() =>{setAlert(false); setAlertMessage('')}, 2000)
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handleUpdate = async ()=>{
        history.push(`/update-purchase-invoice/${invoiceNumber}`)
    }

    return (
        <div className='Invoices'>
            {
                !loader && <div className="invoicesHeading invoicesHeadingCont">
                <h1>Invoice #{invoiceData?.input?.number}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                    <button className="invoiceButton noMobile" onClick={()=>{
                        setPayData(invoiceData)
                        setReceivePay(true)
                    }}>Make Payment</button>
                    <button className="invoiceButton noMobile" onClick={()=>{history.push('/purchase-invoice/new-purchase-invoice')}}>New Purchase Invoice</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont">
                            <p className="option mobile" onClick={()=>{history.push('/purchase-invoice/new-purchase-invoice')}}>New Invoice</p>
                            <p className="option mobile" onClick={()=>{
                                setPayData(invoiceData)
                                setReceivePay(true)
                            }}>Make Payment</p>
                            <p className="option updateQuote" onClick={handleUpdate}>Update</p>
                            <p className="option deleteQuote" onClick={()=>{
                                setConfirmDelete(true)
                            }}>Delete</p>
                        </div>
                    </div>
                </div>
            </div>
            }
                {
                    !loader && <div className="customerQuickDetails">
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
                                    <p><Link to={`/suppliers/${invoiceData?.supplier?._id}`} className='custName'>{suppliers?.filter(sup => sup._id === invoiceData?.supplier?._id && sup.number === invoiceData.supplier.number && sup.id === invoiceData.supplier.id).map(supplier => supplier?.displayName?.slice(0, 25))}...</Link></p>
                                </div>
                            </div>
                            <div className="rightDetail">
                                <div className="totalDebt specificItem">
                                    <p>Total Debt</p>
                                    <p>{(Number(invoiceData?.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                </div>
                                <div className="totalDebt specificItem">
                                    <p>Total Paid</p>
                                    <p>{(Number(invoiceData?.totalPaid)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                </div>
                                <div className="amountOwing specificItem">
                                    <p>Balance</p>
                                    <p>{(Number(invoiceData?.balanceDue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                </div>
                            </div>
                        </div>
                }

                {
                        <PurchaseInvoiceTemplate
                    data = {invoiceData}
                />
                }

            {
                loader && <Loader/>
            }
            {
                    receivePay && <div ref={wrapper_Ref}>
                    
                    <SinglePay
                        totalDebt = {!invoiceData.netPayable ? '' : (Number(invoiceData?.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        totalPaid = {!invoiceData.netPayable ? '' : (Number(invoiceData?.totalPaid)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        balance = {!invoiceData.netPayable ? '' : (Number(invoiceData?.balanceDue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        data={invoiceData}

                        input = {{
                            supplier : invoiceData?.supplier
                        }}

                        route = '/purchaseInvoices/payment'

                        setLoader = {setLoader}
                        setAlertMessage = {setAlertMessage}
                        setAlert = {setAlert}

                        cancel = {()=>{setReceivePay(false)}}
                    />
                    
                </div>}
                <Alert
                    alert={alert}
                    cancelAlert={()=>{setAlert(false)}}
                    message={alertMessage}
                />

                {
                    confirmDelete && 
                        <DeleteBox
                            message = 'This might cause irregularities in reports'
                            handleDelete = {handleDelete}
                            onClick={()=>{setConfirmDelete(false)}}
                        />
                }
        </div>
    )
}

export default PurchaseInvoiceDetails
