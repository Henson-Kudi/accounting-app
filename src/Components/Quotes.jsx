import React, { useState, useEffect, useRef, useContext } from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import { baseURL } from './axios'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import uuid from 'react-uuid'

function Quotes() {
    const history = useHistory()
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} = useContext(UserContext)

    const {data: quotations, loader, setLoader} = useFetch('quotations', [])
    const {data:customerData} = useFetch('customers', {})
    const {data: {invoices}} = useFetch('invoices', {})
    const {data: receipts} = useFetch('receipts', [])
    const {data:products} = useFetch('products', [])
    
    const customers = customerData?.customers

    const [invoiceData, setInvoiceData] = useState({})
    const [upDateToInvoice, setUpdateToInvoice] = useState(false)
    const [updateToReceipt, setUpdateToReceipt] = useState(false)
    const ref = useRef(null)
    const wrapperRef = useRef(null)

    const handlePush = (route)=> () => history.push(route);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e){
        const {current : wrap} = ref;
        if(wrap && !wrap.contains(e.target)){
            setUpdateToInvoice(false);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClick_Outside);

        return ()=>{
            document.removeEventListener('mousedown', handleClick_Outside);
        }
    }, [])

    function handleClick_Outside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            setUpdateToReceipt(false);
        }
    }

    const convertToInvoiceData = (data) => {
        const customer = customers?.filter(cust => cust._id === data.customer._id && cust.id === data.customer.id && cust.number === data.customer.number)
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
            products: data.products.map(product =>{
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
            charges: data.otherCharges,
            grossAmount: data.grossAmount,
            netAmount: data.netPayable
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

    const handleSendEmail = async(quoteData)=>{
        const cust = customers?.filter(cust => cust._id === quoteData?.customer?._id && cust.id === quoteData?.customer?.id && cust.number === quoteData?.customer?.number) ?? []

    const printData = {
            image : user?.logoURL,
            userName : user?.companyName,
            userAddress : user?.country,
            userEmail : user?.userEmail,
            quoteNumber : quoteData?.input?.number,
            date : new Date(quoteData?.input?.date)?.toLocaleDateString(),
            dueDate : new Date(quoteData?.input?.dueDate)?.toLocaleDateString(),
            selectInvoiceTerm : quoteData?.input?.terms,
            customerName : cust[0]?.displayName,
            companyName : cust[0]?.companyName,
            email : cust[0]?.email,
            customerAddress : cust[0]?.billingAddress?.address,
            city : cust[0]?.billingAddress?.city,
            tel : cust[0]?.billingAddress?.tel,
            products : quoteData?.products?.map(pdt => {
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
            totalDiscount : (quoteData?.products?.map(pdt => Number(pdt?.discount?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

            totalVat : (quoteData?.products?.map(pdt => Number(pdt?.vat?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

            grossAmount : (quoteData?.products?.map(pdt => (Number(pdt?.qty) * Number(pdt?.up)) + Number(pdt?.vat?.amount) - Number(pdt?.discount?.amount))?.reduce((a, b) => a + b, 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

            additions : quoteData?.otherCharges?.map(item => ({
                ...item,
                amount : Number(item.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            })),
            totalOtherAdditions : (quoteData?.otherCharges?.map(item => Number(item.amount))?.reduce((acc, item) => Number(acc) + Number(item), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

            netPayable : Number(quoteData?.netPayable)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        }
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/quotations/sendQuotation/${quoteData._id}`, printData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(()=>{
            setAlertMessage('')
                setAlert(false)
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
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading invoicesHeadingCont">
                    <h1>Quotations</h1>
                    <button className="invoiceButton" onClick={()=>{history.push('/quotation/new-quotation')}}>New Quotation</button>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Quote Number</th>
                                <th>Date</th>
                                <th>Expiry Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                quotations?.sort((a, b)=> new Date(b.input.date) - new Date(a.input.date))?.map((quote, i) => (
                                    <tr key={quote.input.id} className='invoiceDetail' onClick={handlePush(`/quotes/${quote._id}`)}>
                                        <td>{
                                            customers?.filter(cust => cust._id === quote?.customer?._id && cust.id === quote?.customer?.id && cust.number === quote?.customer?.number)?.map(customer => customer?.displayName)
                                        }</td>
                                        <td>
                                        Quote #{quote?.input?.number}</td>
                                        <td>{new Date(quote?.input?.date).toLocaleDateString()}</td>
                                        <td>{new Date(quote?.input?.expDate).toLocaleDateString()}</td>
                                        <td>{(Number(quote.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td>{
                                            new Date().valueOf() > new Date(quote?.input?.expDate).valueOf() ? 'Expired' : 'Valid'
                                        }</td>
                                        <td className='sendInvoice'>
                                            <span onClick={(e)=>{
                                                e.stopPropagation()
                                                handleSendEmail(quote)
                                            }}>
                                                <i className="fas fa-share fa-sm"></i>
                                                <small style={{display: 'block'}}>Send</small>
                                            </span>
                                            <span onClick={(e) =>{
                                                e.stopPropagation()
                                                convertToInvoiceData(quote)
                                                setUpdateToInvoice(true)
                                            }}>
                                                <i className="fas fa-file-alt fa-sm"></i>
                                                <small style={{display: 'block'}}>Inv</small>
                                            </span>
                                            <span onClick={(e) =>{
                                                e.stopPropagation()
                                                convertToInvoiceData(quote)
                                                setUpdateToReceipt(true)
                                            }}>
                                                <i className="fas fa-file-alt fa-sm"></i>
                                                <small style={{display: 'block'}}>Rcp</small>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            }
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
                alert &&
                <Alert
                    alert={alert}
                    cancelAlert={()=>{setAlert(false)}}
                    message={alertMessage}
                />
            }
        </div>
    )
}

export default Quotes
