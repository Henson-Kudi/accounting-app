import React, {useRef, useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Receipt from './Receipt'
import ReceiptTemplate from './ReceiptTemplate'
import Loader from './Loader'
import Alert from './Alert'

function ReceiptDetails() {
    const wrapperRef = useRef(null)
    const {receiptNumber} = useParams()
    const [newReceipt, setNewReceipt] = useState(false)
    const [loader, setLoader] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [receiptData, setReceipteData] = useState([])
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

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
                const fetch = await baseURL.get(`/receipts/${receiptNumber}`, {
                    cancelToken: source.token
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

    const handleExportPdf = ()=>{
        setAlertMessage('Function yet to come, do not forget')
        setAlert(true);
        setTimeout(() => {
            setAlertMessage('')
            setAlert(false);
        }, 2000)
    }

    const handleSendInvoice = ()=>{
        setAlertMessage('Function yet to come, do not forget')
        setAlert(true);
        setTimeout(() => {
            setAlertMessage('')
            setAlert(false);
        }, 2000)
    }



    return (
        <div className='Invoices'>
            {
                !fetching && <div className="invoicesHeading">
                <h1>Receipt #{receiptData?.map(item => item.receiptInput.receiptNumber)}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton" onClick={()=>{setNewReceipt(true)}}>New Receipt</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={handlePrint}>Print Receipt</p>
                            <p className="option" onClick={handleExportPdf}>Export PDF</p>
                            <p className="option" onClick={handleSendInvoice}>Send Receipt</p>
                        </div>
                    </div>
                </div>
            </div>
            }

                {
                    receiptData?.map(item => (
                        <ReceiptTemplate
                    data = {item}
                />
                    ))
                }

            {
                newReceipt && 
                <Receipt
                onClick={()=>{setNewReceipt(false)}}
                refetch={() =>{
                    setAlert(true);
                    setAlertMessage('Receipt Added Successfully');
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
            {
                alert &&
                <Alert
                    alert={alert}
                    message={alertMessage}
                />
            }
        </div>
    )
}

export default ReceiptDetails
