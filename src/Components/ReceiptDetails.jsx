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
import {UserContext} from './userContext'
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'

function ReceiptDetails() {
    const history = useHistory()
    const wrapperRef = useRef(null)
    const {receiptNumber} = useParams()
    const [newReceipt, setNewReceipt] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const {data : receiptData, loader, setLoader} = useFetch(`receipts/${receiptNumber}`, {})
    const {data:customerData} = useFetch('customers', {})
    const customers = customerData?.customers

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} = useContext(UserContext)

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

    const receipt = receiptData?.input?.number

    const handlePrint = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.get(`/receipts/receiptTemplates/${receiptData?._id}`, {
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
            const {data} = await baseURL.post(`/receipts/sendReceipt/${receiptNumber}`, receiptData, {
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
            const {data} = await baseURL.get(`/receipts/receiptTemplates/${receiptNumber}`, {
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
                        <div className="moreOptionsCont" style={{...styles}}>
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
