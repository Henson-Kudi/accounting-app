import React, { useState, useEffect, useRef } from 'react'
import {useHistory} from 'react-router'
import './Invoices.css'
import Invoice from './Invoice'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import SinglePay from './SinglePay'
import Alert from './Alert'

function Invoices() {
    const history = useHistory()
    const [newInvoice, setNewInvoice] = useState(false)
    const [loader, setLoader] = useState(false)
    const [receivePay, setReceivePay] = useState(false)
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
            const res = await baseURL.get('/invoices', {
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

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchInvoices(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const {invoices} = data
    const {debtors} = data

    const overDueInvoices = []
    const dueInDaysInvoices = []
    const today = new Date()
    const thisYear = today.getFullYear()
    const thisMonth = today.getMonth()
    const thisDay = today.getDate()

    const totalCreditSales = invoices?.map(item => item.grossAmount).reduce((a, b) => Number(a) + Number(b), 0)

    const totalDebtors = debtors?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const averageDays = ((totalDebtors / totalCreditSales) * 360).toFixed(2) || 0

    invoices?.forEach(invoice =>{
        const futureDate = new Date(invoice?.dueDate)
        const futureYear = futureDate.getFullYear()
        const futureMonth = futureDate.getMonth()
        const futureDay = futureDate.getDate()
        if (futureYear === thisYear) {
            if (futureMonth < thisMonth) {
                overDueInvoices.push(invoice)
            }
            if (futureMonth === thisMonth) {
                if (futureDay < thisDay) {
                    overDueInvoices.push(invoice)
                }
            }
        }
        if (futureMonth === thisMonth) {
            dueInDaysInvoices.push(invoice)
        }
    })

    const totalOverDueDebts = overDueInvoices?.map(invoice => invoice.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const totalDueInDays = dueInDaysInvoices?.map(invoice => invoice.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

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
            setReceivePay(false);
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

    const receivePaymentData = {
        source: 'receive payment',
        template,
        totalToPay: inputValue.amountToPay === '' ? 0 : Number(inputValue.amountToPay)
    }

    const handleReceivePaySubmit = ()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        if (inputValue.amountToPay === '') {
            setAlertMessage('Please add amount to pay')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        }else{
            setLoader(true)
            baseURL.post('/receivePayment', receivePaymentData)
                // .then(() => axios.get(`/payments/${receivePaytInput.paymentNumber}`, {responseType: 'blob'}))
                // .then(res => {

                //     const pdfBlob = new Blob([res.data], {type:'application/pdf'})
                //     saveAs(pdfBlob, `paymentNumber${receivePaytInput.paymentNumber}`)
                //     axios.post(`/sendInvoice/${receivePaytInput.paymentNumber}`, {customerDetails})

                .then(() => {
                    fetchInvoices(source, unMounted)
                    setReceivePay(false);
                    setLoader(false)
                })
            // })
        }
    }

    const handleSendInvoice = async(invoiceNumber, details)=>{
        setLoader(true)
        await baseURL.post(`/sendInvoice/${invoiceNumber}`, details)
        .then(async(res) => {
            setLoader(false)
            const response = await res.data

            setAlertMessage(response.message)
            setAlert(true)
            setTimeout(()=>{
                setAlertMessage('')
                setAlert(false)
            },3000)
        })
    }

    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading">
                    <h1>Invoices</h1>
                    <button className="invoiceButton" onClick={()=>{setNewInvoice(true)}}>New Invoice</button>
                </div>

                <div className="overDueInvoices">
                    <div className="overDue">
                        <p className='title'>Total Overdue</p>
                        <p>{(Number(totalOverDueDebts).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>

                    <div className="dueInDays">
                        <p className='title'>Due this Month</p>
                        <p>{(Number(totalDueInDays).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>

                    <div className="collectionDays">
                        <p className='title'>Average Collection Days</p>
                        <p>{averageDays} days</p>
                    </div>

                    <div className="totalDebt">
                        <p className='title'>Total Outstanding Debtors</p>
                        <p>{(Number(totalDebtors).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
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
                                <th>Customer Name</th>
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
                                invoices?.filter(item => item.netPayable > item.totalPaid).sort((a, b)=> new Date(b.invoiceInput.date) - new Date(a.invoiceInput.date)).filter(item => {
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
                                    
                                    if(item.customerDetails.name?.toLowerCase().includes(filter.nameFilter?.toLowerCase())){return true}
                                    if(item.netPayable?.toString().includes(filter.amountFilter)){return true}
                                }).map(invoice => (
                                    <tr key={invoice._id} className='invoiceDetail'>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{invoice.customerDetails.name}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{invoice.invoiceInput.invoiceNumber}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{new Date(invoice.invoiceInput.date).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{(Number(invoice.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{(Number(invoice.totalPaid).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{(Number(invoice.balanceDue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{Number(invoice.netPayable) > Number(invoice.totalPaid) ? 'Owing' : invoice.netPayable === invoice.totalPaid ? 'Paid' : 'Over Paid'}</td>
                                        <td className='sendInvoice'>
                                            <span onClick={() =>{
                                                setPayData(invoice)
                                                setReceivePay(true)
                                            }}
                                            >
                                                <i class="fas fa-file-alt fa-sm"></i>
                                                <small style={{display: 'block'}}>Pay</small>
                                            </span>
                                            <span onClick={()=>{
                                                handleSendInvoice(invoice.invoiceInput.invoiceNumber, invoice)
                                            }}
                                            >
                                                <i className="fas fa-share fa-sm"></i>
                                                <small style={{display: 'block'}}>Send</small>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    newInvoice && <Invoice
                    newInvoice={()=>{setNewInvoice(true)}}
                    onClick={()=>{setNewInvoice(false)}}
                    refetch={() =>{
                    let source = axios.CancelToken.source();
                    let unMounted = false
                    setAlert(true);
                    setAlertMessage('Invoice Added Successfully');
                    setTimeout(() => {
                    setAlert(false);
                    setAlertMessage('');
                    }, 2000)
                    fetchInvoices(source, unMounted)
                    }}
                    />
                }
                <div ref={wrapperRef}>
                    {
                    receivePay &&
                    <SinglePay
                        totalDebt = {!payData.netPayable ? '' : (Number(payData?.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        totalPaid = {!payData.netPayable ? '' : (Number(payData?.totalPaid).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        balance = {!payData.netPayable ? '' : (Number(payData?.balanceDue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        inputValue = {inputValue}
                        handleChange = {(e)=>{handleSingleChange(e)}}
                        cancel = {()=>{setReceivePay(false)}}
                        submit = {handleReceivePaySubmit}
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
        </div>
    )
}

export default Invoices
