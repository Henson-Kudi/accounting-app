import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link, useHistory} from 'react-router-dom'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import InvoiceTemplate from './InvoiceTemplate'
import Loader from './Loader'
import SinglePay from './SinglePay'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'

function InvoiceDetails() {
    const history = useHistory()
    const {user} = useContext(UserContext)
    const [receivePay, setReceivePay] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const wrapper_Ref = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const wrapperRef = useRef(null)
    const {invoiceNumber} = useParams()
    const {data:customerData} = useFetch('customers', {})
    const {data: invoiceData, loader, setLoader} = useFetch(`invoices/${invoiceNumber}`, {})
    
    const customers = customerData?.customers

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


    const dueDate = new Date(invoiceData?.dueDate)
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


    const handlePrint = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.get(`/invoices/invoiceTemplates/${invoiceNumber}`, {
                responseType: 'blob',
                headers: {
                    'auth-token' : user?.token
                }
            })

            const pdfBlob = new Blob([data], {type:'application/pdf'})

            const pdfUrl = URL.createObjectURL(pdfBlob)

            print({
                printable : pdfUrl,
                type: 'pdf',
                documentTitle: '@HK Solutions',
            })
        } catch (error) {
            setAlertMessage('File not found. Maybe file has been deleted.')
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            }, 3000)
        }finally{
            setLoader(false)
        }
    }

    const handleSendInvoice = async() => {
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/invoices/sendInvoice/${invoiceNumber}`, invoiceData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(()=>{
                setAlertMessage('')
                setAlert(false)
            },3000)
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handleExportPDF = async ()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.get(`invoices/invoiceTemplates/${invoiceNumber}`, {
                responseType: 'blob',
                headers : {
                    'auth-token' : user?.token
                }
            })

            const pdfBlob = new Blob([await data], {type:'application/pdf'})

            saveAs(pdfBlob, `invoiceNumber${invoiceData?.input?.number}`)
        } catch (error) {
            setAlertMessage('File not found. Maybe file has been deleted.')
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            }, 3000)
        }finally{
            setLoader(false);
        }
    }

    const handleDelete = async ()=>{
        try {
            setLoader(true);
            const {data} = await baseURL.delete(`invoices/${invoiceNumber}`, {
                headers : {
                    'auth-token' : user?.token
                }
            })

            data.status === 200 ? history.goBack() : setAlertMessage(data.message); setAlert(true); setTimeout(() =>{setAlert(false); setAlertMessage('')}, 1000)
            
        } catch (error) {
            console.log(error);
            setAlertMessage(error.message);
            setAlert(true);
            setTimeout(() =>{
                setAlert(false);
                setAlertMessage('')
            }, 2000)
        }finally{
            setLoader(false)
        }
    }

    const handleUpdate = async ()=>{
        history.push(`/update-invoice/${invoiceNumber}`)
    }

    return (
        <div className='Invoices'>
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>Invoice #{invoiceData?.input?.number}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton noMobile" onClick={()=>{
                    setReceivePay(true)
                }}>Receive Payment</button>
                <button className="invoiceButton noMobile" onClick={()=>{history.push('/invoice/new-invoice')}}>New Invoice</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option mobile" onClick={()=>{history.push('/invoice/new-invoice')}}>New Invoice</p>
                            <p className="option mobile" onClick={()=>{
                                setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
                                setReceivePay(true)
                            }}>Receive Payment</p>
                            <p className="option" onClick={handlePrint}>Print Invoice</p>
                            <p className="option" onClick={handleExportPDF}>Export PDF</p>
                            <p className="option" onClick={handleSendInvoice}>Send Invoice</p>
                            <p className="option updateQuote" onClick={handleUpdate}>Update</p>
                            <p className="option deleteQuote" onClick={()=>{setConfirmDelete(true)}}>Delete</p>
                        </div>
                    </div>
                </div>
            </div>
                {
                    !loader && <div className="customerQuickDetails">
                            <div className="leftDetail">
                                <div className="status" style={{
                                    backgroundColor: backgroundColor
                                }}>
                                    <p>Status</p>
                                    <p>{status}</p>
                                </div>
                                <div className="customer specificItem">
                                    <p>Customer Name</p>
                                    <p><Link to={`/customers/${invoiceData?.customer?._id}`} className='custName'>{customers?.filter(cust => cust._id === invoiceData?.customer?._id && cust.number === invoiceData.customer.number && cust.id === invoiceData.customer.id).map(customer => customer?.displayName?.slice(0, 25))}...</Link></p>
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
                        <InvoiceTemplate
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
                            customer : invoiceData.customer
                        }}

                        route = '/invoices/payment'

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
                        >
                            <p>This might cause irregularities in reports.</p>
                        </DeleteBox>
                }
        </div>
    )
}

export default InvoiceDetails
