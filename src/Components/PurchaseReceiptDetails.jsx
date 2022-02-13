import React, {useState, useContext, useRef, useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'
import PurchaseReceiptTemplate from './PurchaseReceiptTemplate'

function PurchaseReceiptDetails() {
    const history = useHistory()
    const wrapperRef = useRef(null)
    const {receiptNumber} = useParams()
    const [loader, setLoader] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const {data : receiptData, loader : fetching} = useFetch(`purchaseReceipts/${receiptNumber}`, {})
    const {data:suppliers} = useFetch('suppliers', [])

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} = useContext(UserContext)


    const handleDelete = async ()=>{
        try {
            setLoader(true);
            const res = await baseURL.delete(`purchaseReceipts/${receiptNumber}`, {
                headers : {
                    'auth-token' : user?.token
                }
            })

            const {data} = await res
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() =>{
                setAlert(false);
                setAlertMessage('')
                data.status = 200 && history.goBack()
            }, 3000)

        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handleUpdate = async ()=>{
        history.push(`/update-purchase-receipt/${receiptNumber}`)
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


    return (
        <div className='Invoices'>
            {
                !fetching && <div className="invoicesHeading invoicesHeadingCont">
                <h1>Purchase Receipt #{receiptData?.input?.number}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                    <button className="invoiceButton noMobile" onClick={()=>{history.push('/purchase-receipt/new-purchase-receipt')}}>New Purchase Receipt</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont">
                            <p className="option mobile" onClick={()=>{history.push('/purchase-receipt/new-purchase-receipt')}}>New Purchase Receipt</p>
                            <p className="option updateQuote" onClick={handleUpdate}>Update</p>
                            <p className="option deleteQuote" onClick={()=>{
                                setConfirmDelete(true)
                            }}>Delete</p>
                        </div>
                    </div>
                </div>
            </div>
            }

            <PurchaseReceiptTemplate
                data = {receiptData}
                suppliers={suppliers}
            />

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

export default PurchaseReceiptDetails
