import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link, useHistory} from 'react-router-dom'
import uuid from 'react-uuid'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import QuotationTemplate from './QuotationTemplate'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext' 
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'

function QuoteDetails() {
    const history = useHistory()
    const wrapperRef = useRef(null)
    const {quoteNumber} = useParams()

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [deleteItem, setDeleteItem] = useState(false)

    const {data: quoteData, loader, setLoader} = useFetch(`quotations/quotes/${quoteNumber}`, {})
    const {data : {invoices}} = useFetch('invoices', {})
    const {data : receipts} = useFetch('receipts', [])
    const {data : {customers}} = useFetch('customers', {})
    const {data:products} = useFetch('products', [])
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

    const [upDateToInvoice, setUpdateToInvoice] = useState(false)
    const [updateToReceipt, setUpdateToReceipt] = useState(false)
    const [invoiceData, setInvoiceData] = useState({})
    const ref = useRef(null)

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
        document.addEventListener('mousedown', handleClick_Outside);

        return ()=>{
            document.removeEventListener('mousedown', handleClick_Outside);
        }
    }, [])

    function handleClick_Outside(e){
        const {current : wrap} = ref;
        if(wrap && !wrap.contains(e.target)){
            setUpdateToInvoice(false);
        }
    }

    const quote = quoteData?.input?.number
    
    const convertToInvoiceData = () => {
        const customer = customers?.filter(cust => cust._id === quoteData.customer._id && cust.id === quoteData.customer.id && cust.number === quoteData.customer.number)
        setInvoiceData(prev => ({
            ...prev,
            userID: user.userID,
            input: {
                date: new Date(),
                terms: '0',
                customer: customer[0],
                dueDate: function(){
                    const today = new Date(this.date);
                    const futureDate = new Date(today.setDate(today.getDate()+ Number(this.terms)))
                    return futureDate.toLocaleDateString();
                }
            },
            products: quoteData.products.map(product =>{
                const filteredProducts = products.filter(item => item._id === product._id && item.id === product.id && item.number === product.number)

                return {
                    ...filteredProducts[0],
                    sellingPrice : product.up,
                    discountType : 'value',
                    discount : product.discount.amount,
                    vatRate : product.vat.rate ?? 0,
                    qty : product.qty
                }
            }),
            charges: quoteData.otherCharges,
            grossAmount: quoteData.grossAmount,
            netAmount: quoteData.netPayable
        }))
    }

const handleChange = (e)=>{
    const {name, value} = e.target

    setInvoiceData((prev) => ({
        ...prev,
        input : {
            ...prev.input,
            [name]: value 
        }
    }))
}

    const handleInvoiceSubmit = async ()=>{
        const subData = {
            ...invoiceData,
            input : {
                ...invoiceData.input,
                dueDate : invoiceData.input.dueDate(),
                invoiceNumber: invoices?.length > 0 ? Number(invoices[invoices?.length - 1]?.input?.number) + 1 : 1,
                invoiceId : uuid()
            }
        }
        
        try {
            setUpdateToInvoice(false)
            setLoader(true)
            const {data} = await baseURL.post('/invoices', subData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            })
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handleReceiptSubmit = async()=>{
        const subData = {
            ...invoiceData,
            input : {
                ...invoiceData.input,
                dueDate : invoiceData.input.dueDate(),
                receiptNumber : receipts?.length > 0 ? Number(receipts[receipts?.length - 1]?.input?.number) + 1 : 1,
                receiptId : uuid()
            }
        }

        if (Number(invoiceData?.input?.cashPayment || 0) + Number(invoiceData?.input?.bankPayment || 0) + Number(invoiceData?.input?.mobileMoneyPayment || 0) !== invoiceData.netAmount) {
            return window.alert('Please sum of payments must equal net amount.')
        }

        try {
            setUpdateToReceipt(false)
            setLoader(true)
            const {data} = await baseURL.post('/receipts', subData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            })
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    const handlePrint = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.get(`/quotations/${quoteNumber}`, {
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

    const handleSendQuotation = async() => {
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/quotations/sendQuotation/${quoteNumber}`, quoteData, {
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
            const {data} =await baseURL.get(`/quotations/${quoteNumber}`, {
                responseType: 'blob',
                headers : {
                    'auth-token' : user?.token
                }
            })

            const pdfBlob = new Blob([data], {type:'application/pdf'})
            saveAs(pdfBlob, `quotationNumber${quote}`)
        } catch (error) {
            setAlertMessage('File not found. Maybe file has been deleted.')
            setAlert(true)
            setTimeout(() =>{
                setAlert(false)
                setAlertMessage('')
            }, 3000)
        }finally {
            setLoader(false)
        }
    }

    const handleDelete = async()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.delete(`quotations/quotes/${quoteData?._id}`, {
                headers:{
                    'auth-token': user?.token
                }
            })

            setAlertMessage(data.message);
            setAlert(true);
            setTimeout(()=>{
                setAlert(false);
                setAlertMessage('');
                data.status === 200 && history.goBack()
            }, 3000)

        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }




    return (
        <div className='Invoices'>
            {
                !loader && <div className="invoicesHeading invoicesHeadingCont">
                <h1>Quotation #{quoteData?.input?.number}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton noMobile" onClick={()=>{history.push('/quotation/new-quotation')}}>New Quotation</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option mobile" onClick={()=>{history.push('/quotation/new-quotation')}}>New Quotation</p>
                            <p className="option" onClick={handlePrint}>Print Quotation</p>
                            <p className="option" onClick={()=>{
                                setUpdateToInvoice(true)
                                convertToInvoiceData()
                            }}>Convert To Invoice</p>
                            <p className="option" onClick={()=>{
                                setUpdateToReceipt(true)
                                convertToInvoiceData()
                            }}>Convert To Receipt</p>
                            <p className="option" onClick={handleExportPDF}>Export PDF</p>
                            <p className="option" onClick={handleSendQuotation}>Send Quotation</p>
                            <p className="option updateQuote" onClick={()=>{history.push(`/update-quotation/${quoteData?._id}`)}}>Update Quotation</p>
                            <p className="option deleteQuote" onClick={()=>{setDeleteItem(true)}}>Delete Quotation</p>
                        </div>
                    </div>
                </div>
            </div>
            }


                

            <QuotationTemplate
                data = {quoteData}
            />

            {
                upDateToInvoice &&
            <div className='upDateQuoteToInvoice' ref={ref}>
                <h3>Update Quotation to Invoice</h3>

                <h4>Select Invoice Terms</h4>
                <select
                    name="terms"
                    id="invoiceDuration" className='invoiceSelectInput'
                    onChange={handleChange}
                    value={invoiceData?.input?.terms}
                >
                    <option value={0}>Due on receipt</option>
                    <option value={15}>15 days</option>
                    <option value={30}>30 days</option>
                    <option value={45}>45 days</option>
                    <option value={60}>60 days</option>
                    <option value={75}>75 days</option>
                    <option value={90}>90 days</option>
                </select>

                <div className="discountsAndVatSection">
                    <button className="btn" onClick={()=>{setUpdateToInvoice(false)}}>Cancel</button>
                    <button className="btn" onClick={handleInvoiceSubmit}>Submit</button>
                </div>
            </div>
            }

            {
                updateToReceipt && <div className="SinglePay" ref={wrapperRef}>
                    <h3>Update Quote to Receipt</h3>

                    <p><span>Net Amount:  </span><span> {invoiceData?.netAmount}</span></p>
                    <div className="amountToPay">
                        <div className="invoiceSinglePayControl">
                            <label htmlFor="cashPayment" className="singlePayLabel">Cash Payment</label>
                            <input type="text" name='cashPayment' id='cashPayment' value={invoiceData?.input?.cashPayment} onChange={(e)=>{
                                if(isNaN(e.target.value)){
                                    window.alert('Please input valid characters. Only Numbers allowed')
                                    e.target.value = ''
                                    return
                                }
                                handleChange(e)
                            }} placeholder='Enter cash payment' className='captureValue' />
                        </div>

                        <div className="invoiceSinglePayControl">
                            <label htmlFor="bankPayment" className="singlePayLabel">Bank Payment</label>
                            <input type="text" name='bankPayment' id='bankPayment' value={invoiceData?.input?.bankPayment} onChange={(e)=>{
                                if(isNaN(e.target.value)){
                                    window.alert('Please input valid characters. Only Numbers allowed')
                                    e.target.value = ''
                                    return
                                }
                                handleChange(e)
                            }} placeholder='Enter bank payment' className='captureValue' />
                        </div>

                        <div className="invoiceSinglePayControl">
                            <label htmlFor="mobileMoneyPayment" className="singlePayLabel">MoMo Payment</label>
                            <input type="text" name='mobileMoneyPayment' id='mobileMoneyPayment' value={invoiceData?.input?.mobileMoneyPayment} onChange={(e)=>{
                                if(isNaN(e.target.value)){
                                    window.alert('Please input valid characters. Only Numbers allowed')
                                    e.target.value = ''
                                    return
                                }
                                handleChange(e)
                            }} placeholder='Enter MoMo payment' className='captureValue' />
                        </div>

                    </div>
                    <div className="optionButtons">
                        <button className="singlePayBtn" onClick={()=>{
                            setUpdateToReceipt(false)
                        }}>Cancel</button>
                        <button className="singlePayBtn" onClick={handleReceiptSubmit}>Submit</button>
                    </div>
                </div>
            }

            
            {
                loader && <Loader/>
            }

            {
                deleteItem && <DeleteBox
                    handleDelete={handleDelete}
                    onClick={()=>{setDeleteItem(false)}}
                />
            }

            <Alert
                alert={alert}
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
        </div>
    )
}

export default QuoteDetails
