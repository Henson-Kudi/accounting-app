import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link, useHistory} from 'react-router-dom'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Receipt from './Receipt'
import ReceiptTemplate from './ReceiptTemplate'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'

function ReceiptDetails() {
    const history = useHistory()
    const wrapperRef = useRef(null)
    const {receiptNumber} = useParams()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const {data : receiptData, loader, setLoader} = useFetch(`receipts/${receiptNumber}`, {})
    const {data:customerData} = useFetch('customers', {})
    const {data:products} = useFetch('products', [])
    const customers = customerData?.customers

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} = useContext(UserContext)

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

    const receipt = receiptData?.input?.number

    const cust = customers?.filter(cust => cust._id === receiptData?.customer?._id && cust.id === receiptData?.customer?.id && cust.number === receiptData?.customer?.number) ?? []

    const printData = {
        image : user?.logoURL,
        userName : user?.companyName,
        userAddress : user?.country,
        userEmail : user?.userEmail,
        receiptNumber : receiptData?.input?.number,
        date : new Date(receiptData?.input?.date)?.toLocaleDateString(),
        dueDate : receiptData?.input?.dueDate,
        selectInvoiceTerm : receiptData?.input?.terms,
        customerName : cust[0]?.displayName,
        companyName : cust[0]?.companyName,
        email : cust[0]?.email,
        customerAddress : cust[0]?.billingAddress?.address,
        city : cust[0]?.billingAddress?.city,
        tel : cust[0]?.billingAddress?.tel,
        products : receiptData?.products?.map(pdt => {
            const prdt = products?.filter(product => product._id === pdt._id)
            return {
                ...pdt,
                name : prdt[0]?.name,
                amount : (Number(pdt?.qty) * Number(pdt?.up) - Number(pdt?.discount?.amount) + Number(pdt?.vat?.amount))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                discount : {
                    rate : pdt?.discount?.rate,
                    amount : Number(pdt?.discount?.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                },
                vat : {
                    rate : pdt?.vat?.rate,
                    amount : Number(pdt?.vat?.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                },
                sellingPrice : Number(pdt?.up)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        }),
        totalDiscount : (receiptData?.products?.map(pdt => Number(pdt?.discount?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        totalVat : (receiptData?.products?.map(pdt => Number(pdt?.vat?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        grossAmount : (receiptData?.products?.map(pdt => (Number(pdt?.qty) * Number(pdt?.up)) + Number(pdt?.vat?.amount) - Number(pdt?.discount?.amount))?.reduce((a, b) => a + b, 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        additions : receiptData?.otherCharges?.map(item => ({
            ...item,
            amount : Number(item.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        })),
        totalOtherAdditions : (receiptData?.otherCharges?.map(item => Number(item.amount))?.reduce((acc, item) => Number(acc) + Number(item), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        netPayable : Number(receiptData?.netPayable)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        cash : Number(receiptData?.input?.payments?.cash)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        bank : Number(receiptData?.input?.payments?.bank)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        momo : Number(receiptData?.input?.payments?.mobileMoney)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        totalPay : Number(receiptData?.netPayable)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        netPay : 0,
    }

    const handlePrint = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/receipts/receiptTemplates/${receiptData?._id}`, printData, {
                responseType: 'blob',
                headers : {
                    'auth-token' : user?.token
                }
            })
            
            const pdfBlob = new Blob([data], {type:'application/pdf'})

            const pdfUrl = URL.createObjectURL(pdfBlob)

            print({
                printable : pdfUrl,
                type: 'pdf',
                documentTitle: user?.userName,
            })

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

    const handleSendReceipt = async() => {
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/receipts/sendReceipt/${receiptNumber}`, printData, {
                headers :{
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
            const {data} = await baseURL.post(`/receipts/receiptTemplates/${receiptNumber}`, printData, {
                responseType: 'blob',
                headers : {
                    'auth-token' : user?.token
                }
            })
            const pdfBlob = new Blob([data], {type:'application/pdf'})
            
            saveAs(pdfBlob, `receiptNumber${receipt}`)
            
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

    const handleDelete = async ()=>{
        try {
            setLoader(true);
            const res = await baseURL.delete(`receipts/${receiptNumber}`, {
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
        history.push(`/update-receipt/${receiptNumber}`)
    }


    return (
        <div className='Invoices'>
            {
                <div className="invoicesHeading invoicesHeadingCont">
                <h1>Receipt #{receiptData?.input?.number}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton noMobile" onClick={()=>{history.push('/receipt/new-receipt')}}>New Receipt</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont">
                            <p className="option mobile" onClick={()=>{history.push('/receipt/new-receipt')}}>New Receipt</p>
                            <p className="option" onClick={handlePrint}>Print Receipt</p>
                            <p className="option" onClick={handleExportPDF}>Export PDF</p>
                            <p className="option" onClick={handleSendReceipt}>Send Receipt</p>
                            <p className="option updateQuote" onClick={handleUpdate}>Update</p>
                            <p className="option deleteQuote" onClick={()=>{setConfirmDelete(true)}}>Delete</p>
                        </div>
                    </div>
                </div>
            </div>
            }

            <ReceiptTemplate
                data = {receiptData}
                customers={customers}
            />
            {
                loader && <Loader/>
            }

            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />

            {
                confirmDelete && <DeleteBox
                    message = 'This might cause irregularities in reports'
                    handleDelete = {handleDelete}
                    onClick={()=>{setConfirmDelete(false)}}
                />
            }
        </div>
    )
}

export default ReceiptDetails
