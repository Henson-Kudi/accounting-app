import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link, useHistory} from 'react-router-dom'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
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
    const {data: suppliers} = useFetch('suppliers', [])
    const {data:products} = useFetch('products', [])

    const handleStyling = () => {
        wrapper_Ref.current.classList.toggle('showOptions')
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapper_Ref;
        if (wrap && !wrap.contains(e.target)) {
            wrap.classList.remove('showOptions')
        }
    }

    const supplier = suppliers?.filter(sup => sup?._id === order?.supplier?._id && sup?.id === order?.supplier?.id && sup?.number === order?.supplier?.number) ?? []
console.log(order);
    const printData = {
        image : user?.logoURL,
        userName : user?.companyName,
        userAddress : user?.country,
        userEmail : user?.userEmail,
        orderNumber : order?.input?.number,
        date : new Date(order?.input?.date)?.toLocaleDateString(),
        dueDate : new Date(order?.input?.dueDate)?.toLocaleDateString(),
        terms : order?.input?.terms,
        supplierName : supplier[0]?.displayName,
        companyName : supplier[0]?.companyName,
        email : supplier[0]?.email,
        supplierAddress : supplier[0]?.billingAddress?.address,
        city : supplier[0]?.billingAddress?.city,
        tel : supplier[0]?.billingAddress?.tel,
        products : order?.products?.map(pdt => {
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
                costPrice : Number(pdt?.unitCost)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
        }),
        totalDiscount : (order?.products?.map(pdt => Number(pdt?.discount?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        totalVat : (order?.products?.map(pdt => Number(pdt?.vat?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        grossAmount : (order?.products?.map(pdt => (Number(pdt?.qty) * Number(pdt?.unitCost)) + Number(pdt?.vat?.amount) - Number(pdt?.discount?.amount))?.reduce((a, b) => a + b, 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        additions : order?.otherCharges?.map(item => ({
            ...item,
            amount : Number(item?.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        })),
        totalOtherAdditions : (order?.otherCharges?.map(item => Number(item.amount))?.reduce((acc, item) => Number(acc) + Number(item), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        netPayable : order?.netPayable,
    }



    const handlePrint = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/purchaseOrders/orderTemplates/${orderNumber}`, printData, {
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
            const {data} = await baseURL.post(`/purchaseOrders/sendOrder/${orderNumber}`, printData, {
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
            const {data} = await baseURL.post(`purchaseOrders/orderTemplates/${orderNumber}`, printData, {
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
                        <div className="moreOptionsCont">
                            <p className="option mobile" onClick={()=>{history.push('/purchase-order/new-purchase-order')}}>New Order</p>
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
