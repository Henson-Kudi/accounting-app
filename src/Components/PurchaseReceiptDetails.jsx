import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import CashPurchase from './CashPurchase'
import ReceiptTemplate from './ReceiptTemplate'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from './userContext'

function PurchaseReceiptDetails() {
    const wrapperRef = useRef(null)
    const {receiptNumber} = useParams()
    const [newReceipt, setNewReceipt] = useState(false)
    const [loader, setLoader] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [receiptData, setReceipteData] = useState([])
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} =useContext(UserContext)

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

            getReceipt(source, unMounted)
            return () => {
                unMounted = true;
                source.cancel('Cancelling request')
            }
        }, [])

        const getReceipt = async(source, unMounted)=>{
            try {
                setFetching(true)
                const fetch = await baseURL.get(`/purchaseReceipts/${receiptNumber}`, {
                    cancelToken: source.token,
                    headers:{
                        'auth-token': user?.token
                    }
                })
                const res = await fetch.data
                setReceipteData(res)
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
            printable : 'ReceiptTemplate',
            type: 'html',
            targetStyles: ['*'],
            maxWidth: '120%',
            documentTitle: '@HK Solutions',
        })
        }, 1000)
    }

    const receiptTemplateData = receiptData?.map(item => (
        {
        source: 'cash purchases',
        receiptInput : item.receiptInput,
        customerDetails : item.supplierDetails,
        data: item.data,
        additionsAndSubtractions : item.additionsAndSubtractions,
        discountsAndVat: item.discountsAndVat,
        otherAdditions: item.otherAdditions,
        grossAmount: item.grossAmount,
        netPayable: item.netPayable,
    }
    ))
    const handleExportPdf = ()=>{
        setAlert(true);
        setAlertMessage('Function coming soon!!!');
        setTimeout(() => {
            setAlert(false);
            setAlertMessage('');
        }, 2000)
    }

    const handleSendReceipt = ()=>{
        setAlert(true);
        setAlertMessage('Function coming soon!!!');
        setTimeout(() => {
            setAlert(false);
            setAlertMessage('');
        }, 2000)
    }



    return (
        <div className='Invoices'>
            {
                !fetching && <div className="invoicesHeading">
                <h1>Receipt #{receiptData?.map(item => item.receiptInput.receiptNumber)}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton" onClick={()=>{setNewReceipt(true)}}>New Receipt</button>
                    {/* <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={handlePrint}>Print Receipt</p>
                            <p className="option" onClick={handleExportPdf}>Export PDF</p>
                            <p className="option" onClick={handleSendReceipt}>Send Receipt</p>
                        </div>
                    </div> */}
                </div>
            </div>
            }

                {
                    receiptTemplateData?.map(item => (
                        <ReceiptTemplate
                    data = {item}
                />
                    ))
                }

            {
                newReceipt && 
                <CashPurchase
                onClick={()=>{setNewReceipt(false)}}
                refetch={() =>{
                    setAlert(true);
                    setAlertMessage('Purchase Receipt Added Successfully');
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
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default PurchaseReceiptDetails
