import React, { useState, useEffect, useRef } from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import PurchaseInvoice from './PurchaseInvoice'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import SinglePay from './SinglePay'
import Alert from './Alert'
import MessageBox from './MessageBox'

function PurchaseInvoices() {
    const history = useHistory()
    const [newPurchaseInvoice, setNewPurchaseInvoice] = useState(false)
    const [duplicate, setDuplicate] = useState(false)
    const [loader, setLoader] = useState(false)
    const [makePay, setMakePay] = useState(false)
    const wrapperRef = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [data, setData] = useState([])
    const [filter, setFilter] = useState({})
    const [payData, setPayData] = useState({})
    const [inputValue, setInputValue] = useState({
        amountToPay : '',
        meansOfPayment: 'cash'
    })

    const handleChange = (e)=>{
        const {name, value} = e.target

        setFilter(prev =>(
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const fetchInvoices = async(source, unMounted)=>{
        try {
            setLoader(true)
            const res = await baseURL.get('/purchaseInvoices', {
                cancelToken: source.token
            })
            setData(res.data)
            setLoader(false)
        } catch (error) {
            if (!unMounted) {
                if (axios.isCancel(error)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        }
    }

    const fetchElements = async()=>{
        try {
            setLoader(true)
            const res = await baseURL.get('/purchaseInvoices')
            setData(res.data)
            setLoader(false)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchInvoices(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const {purchaseInvoices} = data
    const {creditors} = data

    const overDueInvoices = []
    const dueInDaysInvoices = []
    const today = new Date()
    const thisYear = today.getFullYear()
    const thisMonth = today.getMonth()
    const thisDay = today.getDate()

    const totalCreditPurchases = purchaseInvoices?.map(item => item.grossAmount).reduce((a, b) => Number(a) + Number(b), 0)

    const totalCreditors = creditors?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const averageDays = ((totalCreditors / totalCreditPurchases) * 360).toFixed(2) || 0

    const totalOverDueDebts = overDueInvoices?.map(invoice => invoice.netPayable).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const totalDueInDays = dueInDaysInvoices?.map(invoice => invoice.netPayable).reduce((a, b) => Number(a) + Number(b), 0) || 0

    purchaseInvoices?.forEach(invoice =>{
        const invoiceDate = new Date(invoice?.invoiceInput.date)
        const futureDate = new Date(invoice?.invoiceInput.dueDate)
        const futureYear = futureDate.getFullYear()
        const futureMonth = futureDate.getMonth()
        const futureDay = futureDate.getDate()
        if (futureYear === thisYear && futureMonth === thisMonth && futureDay < thisDay) {
            overDueInvoices.push(invoice)
        }else{
            const daysTimeDate = new Date(today.setDate(today.getDate()+ 15))
            const daysTimeYear = daysTimeDate.getFullYear()
            const daysTimeMonth = daysTimeDate.getMonth()
            const daysTimeDay = daysTimeDate.getDate()
            if (daysTimeYear >= futureYear && daysTimeMonth >= futureMonth && daysTimeDay <= futureDay  && !((daysTimeDay - thisDay) < 0) ) {
                dueInDaysInvoices.push(invoice)
            }
        }
    })
    const handlePush = (route)=>{
        history.push(route)
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
            setMakePay(false);
        }
    }

    const handleSingleChange = (e)=>{
        const {name, value} = e.target
        setInputValue(prev => (
            {
                ...prev,
                [name] : value
            }
        ))
    }

    const template = [{
        ...payData,
        date: new Date().toDateString(),
        amountToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay),
        meansOfPayment: inputValue.meansOfPayment
    }]

    const makePaymentData = {
        source: 'make payment',
        template,
        totalToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay)
    }

    const handleMakePaySubmit = ()=>{
        if (inputValue.amountToPay === '') {
            setAlertMessage('Please add amount to pay')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        }else{
            setLoader(true)
            baseURL.post('/receivePayment', makePaymentData)
                // .then(() => axios.get(`/payments/${receivePaytInput.paymentNumber}`, {responseType: 'blob'}))
                // .then(res => {

                //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
                //     saveAs(pdfBlob, `paymentNumber${receivePaytInput.paymentNumber}`)
                //     axios.post(`/sendInvoice/${receivePaytInput.paymentNumber}`, {customerDetails})

                .then(() => {
                    setMakePay(false);
                    setLoader(false)
                })
            // })
        }
    }

    const dueDateCalc = (value) => {
        const today = new Date(`${thisMonth + 1}/${thisDay}/${thisYear}`);
        const futureDate = new Date(today.setDate(today.getDate() + Number(value)))
        return futureDate.toDateString();
    }

    const invoiceData = {
        invoiceInput: {
            date: today.toDateString(),
            invoiceNumber: data.purchaseInvoices?.length + 1,
            customerName: payData.invoiceInput?.customerName,
            additionalInfo: payData.invoiceInput?.additonalInfo,
            dueDate: dueDateCalc(payData?.selectInvoiceTerm)
        },
        selectInvoiceTerm: payData?.selectInvoiceTerm,
        supplierDetails: payData?.supplierDetails,
        additionsAndSubtractions: payData?.additionsAndSubtractions ? payData?.additionsAndSubtractions : {
            rebate: '',
            tradeDiscount: '',
            cashDiscount: '',
            valueAddedTax: ''
        },
        data: payData?.data,
        otherAdditions: payData.otherAdditions ? payData.otherAdditions : [],
        discountsAndVat: payData?.discountsAndVat,
        grossAmount: payData?.grossAmount,
        netPayable: payData?.netPayable,
        dueDate: dueDateCalc(payData?.selectInvoiceTerm),
        totalPaid: 0,
        balanceDue: payData?.netPayable
    }

    const handleDuplicate = async()=>{
        console.log(invoiceData);
        setTimeout(() => {
            setLoader(true)
        }, 500)

        await baseURL.post('/purchaseInvoice', invoiceData)
            // .then(() => axios.get(`/invoices/${quoteInput.invoiceNumber}`, {responseType: 'blob'}))
            // .then(res => {

            //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
            //     saveAs(pdfBlob, `invoiceNumber${quoteInput.invoiceNumber}`)
            //     axios.post(`/sendInvoice/${quoteInput.invoiceNumber}`, {customerDetails})

            .then(async(res) => {
                const response = await res.data
                await fetchElements()
                .then(async(res)=> {
                    setLoader(false)
                    setAlertMessage('Duplicate created Successfully')
                    setAlert(true)
                    setTimeout(() => {
                        setAlertMessage('')
                        setAlert(false)
                    }, 3000)
                })
            }) 
        // })
    }

    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading">
                    <h1>Purchase Invoices</h1>
                    <button className="invoiceButton" onClick={()=>{setNewPurchaseInvoice(true)}}>New Invoice</button>
                </div>

                <div className="overDueInvoices">
                    <div className="overDue">
                        <p className='title'>Total Overdue</p>
                        <p>{(Number(totalOverDueDebts).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>

                    <div className="dueInDays">
                        <p className='title'>Due in 15 Days</p>
                        <p>{(Number(totalDueInDays).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>

                    <div className="collectionDays">
                        <p className='title'>Average Collection Days</p>
                        <p>{averageDays} days</p>
                    </div>

                    <div className="totalDebt">
                        <p className='title'>Total Outstanding Creditors</p>
                        <p>{(Number(totalCreditors).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>
                </div>

                <div className="invoiceFilters">
                    <div className="nameFilter">
                        <input type="text" name='nameFilter' value={filter.nameFilter} onChange={handleChange} className='filterInput' placeholder='Filter by customer name' />
                    </div>

                    <div className="amountFilter">
                        <input type="text" name='amountFilter' value={filter.amountFilter} onChange={handleChange} className='filterInput' placeholder='Filter by amount' />
                    </div>
                </div>

                <div className="allDebtorsContainer">
                    <table className="allDebtorsTable">
                        <thead>
                            <tr>
                                <th>Supplier Name</th>
                                <th>Invoice Number</th>
                                <th>Due Date</th>
                                <th>Date</th>
                                <th>Net Amount</th>
                                <th>Total Paid</th>
                                <th>Balance Due</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                purchaseInvoices?.filter(item => item.netPayable > item.totalPaid).sort((a, b)=> new Date(b.invoiceInput.date) - new Date(a.invoiceInput.date)).filter(item => {
                                    if(!filter.nameFilter){
                                        if(!filter.amountFilter){
                                            return true
                                        }
                                    }
                                    if(!filter.amountFilter){
                                        if(!filter.nameFilter){
                                            return true
                                        }
                                    }
                                    
                                    if(item.supplierDetails.name?.toLowerCase().includes(filter.nameFilter?.toLowerCase())){return true}
                                    if(item.netPayable?.toString().includes(filter.amountFilter)){return true}
                                }).map(invoice => (
                                    <tr key={invoice._id} className='invoiceDetail'>
                                        <td onClick={()=>{handlePush(`/purchase-invoices/${invoice._id}`)}}>{invoice.supplierDetails.name}</td>
                                        <td onClick={()=>{handlePush(`/purchase-invoices/${invoice._id}`)}}>{invoice.invoiceInput.invoiceNumber}</td>
                                        <td onClick={()=>{handlePush(`/purchase-invoices/${invoice._id}`)}}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/purchase-invoices/${invoice._id}`)}}>{new Date(invoice.invoiceInput.date).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/purchase-invoices/${invoice._id}`)}}>{(Number(invoice.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/purchase-invoices/${invoice._id}`)}}>{(Number(invoice.totalPaid).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/purchase-invoices/${invoice._id}`)}}>{(Number(invoice.balanceDue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/purchase-invoices/${invoice._id}`)}}>{Number(invoice.netPayable) > Number(invoice.totalPaid) ? 'Owing' : invoice.netPayable === invoice.totalPaid ? 'Paid' : 'Over Paid'}</td>
                                        <td className='sendInvoice'>
                                            <span onClick={() =>{
                                                setPayData(invoice)
                                                setMakePay(true)
                                            }}>
                                                <i class="fas fa-file-alt fa-sm"></i>
                                                <small style={{display: 'block'}}>Pay</small>
                                            </span>
                                            <span onClick={()=>{
                                                setDuplicate(true)
                                                setPayData(invoice)
                                            }}>
                                                <i className="fas fa-share fa-sm"></i>
                                                <small style={{display: 'block'}}>Dupli</small>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    newPurchaseInvoice && <PurchaseInvoice
                    newInvoice={()=>{setNewPurchaseInvoice(true)}}
                    onClick={()=>{setNewPurchaseInvoice(false)}}
                    refetch={() =>{
                        setAlert(true);
                        setAlertMessage('Purchase Invoice Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                    }, 2000)
                    }}
                    />
                }
                <div ref={wrapperRef}>
                    {
                    makePay &&
                    <SinglePay
                        totalDebt = {!payData.netPayable ? '' : (Number(payData?.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        totalPaid = {!payData.netPayable ? '' : (Number(payData?.totalPaid).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        balance = {!payData.netPayable ? '' : (Number(payData?.balanceDue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        inputValue = {inputValue}
                        handleChange = {(e)=>{handleSingleChange(e)}}
                        cancel = {()=>{setMakePay(false)}}
                        submit = {handleMakePaySubmit}
                    />
                    }
                </div>
            </div>
            }
            {
                loader && <Loader/>
            }
            {
                <Alert
                    alert={alert}
                    message={alertMessage}
                />
            }
            {
                duplicate &&
                <MessageBox
                    onClick={()=>{setDuplicate(false)}}
                    submit={handleDuplicate}
                    message='duplicate this invoice'
                />
            }
        </div>
    )
}

export default PurchaseInvoices
