import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link, useHistory} from 'react-router-dom'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Loader from './Loader'
import Alert from './Alert'
import { UserContext} from './userContext'
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'
import PurchaseOrderTemplate from './PurchaseOrderTemplate'

function PurchaseOrderDetails() {
    const history = useHistory()
    const {user} = useContext(UserContext)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const wrapper_Ref = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {orderNumber} = useParams()
    const {data: order, loader, setLoader} =useFetch(`purchaseOrders/${orderNumber}`, {})

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
        document.addEventListener('mousedown', handleClick_Outside);

        return () => {
            document.removeEventListener('mousedown', handleClick_Outside);
        }
    }, [])

    function handleClick_Outside(e) {
        const { current: wrap } = wrapper_Ref;
        if (wrap && !wrap.contains(e.target)) {
            setStyler({transform: 'translateY(-5rem)', visibility: 'hidden'})
        }
    }



    const handlePrint = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.get(`/purchaseOrders/orderTemplates/${orderNumber}`, {
                responseType: 'blob',
                headers: {
                    'auth-token' : user?.token
                }
            })
            const pdfBlob = new Blob([data], {type:'application/pdf'})

            const pdfUrl = await URL.createObjectURL(pdfBlob)

            print({
                printable : pdfUrl,
                type: 'pdf',
                documentTitle: '@HK Solutions',
            })
        } catch (error) {
            setAlertMessage('File not found. Maybe file has been deleted.')
            setAlert(true)
            setTimeout(() => {
                setAlertMessage('')
                setAlert(false)
            }, 3000);
        }finally {
            setLoader(false)
        }
    }

    const handleSendInvoice = async() => {
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/purchaseOrders/sendOrder/${orderNumber}`, order, {
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
            const {data} = await baseURL.get(`purchaseOrders/orderTemplates/${orderNumber}`, {
                responseType: 'blob',
                headers : {
                    'auth-token' : user?.token
                }
            })

            const pdfBlob = new Blob([data], {type:'application/pdf'})
            saveAs(pdfBlob, `orderNumber${order?.input?.number}`)
        } catch (error) {
            setAlertMessage('File not found. Maybe file has been deleted.')
            setAlert(true)
            setTimeout(() => {
                setAlertMessage('')
                setAlert(false)
            }, 3000);
        }finally{
            setLoader(false)
        }
    }

    const handleDelete = async ()=>{
        try {
            setLoader(true);
            const res = await baseURL.delete(`purchaseOrders/${orderNumber}`, {
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
        history.push(`/update-purchase-order/${orderNumber}`)
    }

    return (
        <div className='Invoices'>
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>Order #{order?.input?.number}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton noMobile" onClick={()=>{history.push('/purchase-order/new-purchase-order')}}>New Order</button>
                <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="invoiceButton mobile" onClick={()=>{history.push('/purchase-order/new-purchase-order')}}>New Order</p>
                            <p className="option" onClick={handlePrint}>Print Order</p>
                            <p className="option" onClick={handleExportPDF}>Export PDF</p>
                            <p className="option" onClick={handleSendInvoice}>Send Order</p>
                            <p className="updateQuote option" onClick={handleUpdate}>Update</p>
                            <p className="deleteQuote option" onClick={()=>{setConfirmDelete(true)}}>Delete</p>
                        </div>
                    </div>
                </div>
            </div>
            {
                <PurchaseOrderTemplate
                    data = {order}
                />
            }

            {
                loader && <Loader/>
            }
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

export default PurchaseOrderDetails
