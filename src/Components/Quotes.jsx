import React, { useState, useEffect, useRef, useContext } from 'react'
import {saveAs} from 'file-saver'
import axios from 'axios'
import {useHistory} from 'react-router'
import './Invoices.css'
import Quotation from './Quotation'
import { baseURL } from './axios'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from './userContext'

function Quotes() {
    const history = useHistory()
    const [newQuotation, setNewQuotation] = useState(false)
    const [loader, setLoader] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} = useContext(UserContext)

    const [data, setData] = useState([])
    const [filter, setFilter] = useState({})

    const [quoteData, setQuoteData] = useState({})
    const [invoices, setInvoices] = useState([])
    const [upDateToInvoice, setUpdateToInvoice] = useState(false)
    const [discountsAndVat, setDiscountsAndVat] = useState({
        valueAddedTax: '',
        cashDiscount: '',
        tradeDiscount: '',
        rebate: '',
        selectInvoiceTerm: 15
    })

    const [otherAdditions, setOtherAdditions] = useState([
        {
            name: '',
            amount: ''
        },
        {
            name: '',
            amount: ''
        },
        {
            name: '',
            amount: ''
        },
        {
            name: '',
            amount: ''
        },
    ])
    const ref = useRef(null)

    const handleChange = (e)=>{
        const {name, value} = e.target

        setFilter(prev =>(
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const fetchQuotes = async(source, unMounted)=>{
        const req1 = baseURL.get('/quotations', {
                headers:{
                    'auth-token': user?.token
                }
            })
            const req2 = baseURL.get('/invoices', {
                headers:{
                    'auth-token': user?.token
                }
            })
            setLoader(true)
            await axios.all([req1, req2], {
            cancelToken: source.token
        })
            .then(async (res) => {
                const [quotes, invoices] = await res
                setData(quotes.data)
                setInvoices(invoices.data.invoices)
                setLoader(false)
            }).catch (error => {
            if (!unMounted) {
                if (axios.isCancel(error)) {
                console.log('Request Cancelled');
                }else{
                    console.log('Something went wrong');
                }
            }
        })
    }

    useEffect(()=>{
        let source = axios.CancelToken.source();
        let unMounted = false;
        fetchQuotes(source, unMounted)

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const quotations = []

    data.forEach(item => {
        const element = item.data
        element.forEach(quote => {
            quotations.push({
                ...quote,
                name: item.customerDetails.name,
                email: item.customerDetails.email,
                number: item.quoteInput.quoteNumber,
                date: item.quoteInput.date,
                id: item._id
            })
        })
    })

    const handlePush = (route)=>{
        history.push(route)
    }

    const handle_Change = (e) => {
        const {name, value} = e.target
        setDiscountsAndVat(prev => (
            {
                ...prev,
                [name] : value
            }
        ))
    }
    const otherAdditionsChange = (name, index) => (event) => {
        let newArr = otherAdditions.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: event.target.value };
        } else {
            return item;
        }
        });
        setOtherAdditions(newArr);
    }

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

    const today = new Date().toDateString()
    const dueDate = (value)=>{
        const today = new Date()
        const futureDate = new Date(today.setDate(today.getDate()+ Number(value)))
        return futureDate.toDateString();
    }

    const sumTotal = quoteData?.amount;
    const rebateValue = (sumTotal * (Number(discountsAndVat?.rebate)/100)).toFixed(2) || 0
    const commercialNet1 = sumTotal - rebateValue;
    const tradeDiscountValue = (commercialNet1 * (Number(discountsAndVat?.tradeDiscount)/100)).toFixed(2) || 0
    const commercialNet2 = commercialNet1 - tradeDiscountValue
    const cashDiscountValue = (commercialNet2 * (Number(discountsAndVat?.cashDiscount)/100)).toFixed(2) || 0
    const financialNet = commercialNet2 - cashDiscountValue
    const valueAddedTax = (financialNet * (Number(discountsAndVat?.valueAddedTax)/100)).toFixed(2) || 0
    const totalOtherAdditions = (otherAdditions.map(item => item.amount).reduce((a,b)=> (Number(a) + Number(b))))
    const additions = otherAdditions.filter(ele => ele.name !== '' && ele.amount !== '')

    const invoiceData = {
        userID : user.userID,
        invoiceInput: {
            date : today,
            invoiceNumber : invoices?.length + 1,
            customerName : quoteData.quoteInput?.customerName,
            dueDate : dueDate(discountsAndVat.selectInvoiceTerm)
        },
        selectInvoiceTerm : discountsAndVat.selectInvoiceTerm,
        customerDetails : quoteData?.customerDetails,
        data : [quoteData],
        additionsAndSubtractions : discountsAndVat,
        discountsAndVat: {
            rebateValue,
            tradeDiscountValue,
            cashDiscountValue,
            valueAddedTax
        },
        otherAdditions: additions,
        grossAmount: sumTotal,
        netPayable: (financialNet + Number(valueAddedTax) + totalOtherAdditions),
        totalPaid: 0,
        balanceDue: (financialNet + Number(valueAddedTax) + totalOtherAdditions),
        dueDate: dueDate(discountsAndVat.selectInvoiceTerm)
    }

    const handleInvoiceSubmit = async ()=>{
        setUpdateToInvoice(false);
        await baseURL.post('/invoices', invoiceData, {
            headers : {
                'auth-token' : user?.token
            }
        })
        .then(async() => await baseURL.get(`/invoiceTemplates/${invoices?.length + 1}-${user.userID}`, {
            responseType: 'blob',
            headers : {
                'auth-token' : user?.token
            }
        }))
        .then(async res => {
            const data = await res.data
            const pdfBlob = new Blob([data], {type:'application/pdf'})
            saveAs(pdfBlob, `invoiceNumber${invoices?.length + 1}`)
            .then(async (res)=>{
                await baseURL.post(`/sendInvoice/${invoices?.length + 1}-${user.userID}`, {
                    customerDetails : invoiceData.customerDetails
                })
                setAlert(true);
                setAlertMessage('Invoice Added Successfully');
                setTimeout(() => {
                    setAlert(false);
                    setAlertMessage('');
                }, 2000)
            })
        }).catch(err => {
            console.log(err);
        })
    }

    const handleSendEmail = async(quoteNumber, customerDetails)=>{
        setLoader(true)
        await baseURL.post(`/sendQuotation/${quoteNumber}-${user.userID}`, customerDetails, {
            headers : {
                'auth-token' : user?.token
            }
        })
        .then(async(res)=>{
            setLoader(false)
            const response = await res.data
            setAlertMessage(response.message)
            setAlert(true)
            setTimeout(()=>{
                setAlertMessage('')
                setAlert(false)
            }, 3000)
        })
    }


    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading">
                    <h1>Quotations</h1>
                    <button className="invoiceButton" onClick={()=>{setNewQuotation(true)}}>New Quotation</button>
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
                                <th>Quote Number</th>
                                <th>Date</th>
                                <th>Qty</th>
                                <th>UP</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                quotations?.sort((a, b)=> new Date(b.date) - new Date(a.date)).filter(item => {
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
                                    
                                    if(item.name?.toLowerCase().includes(filter.nameFilter?.toLowerCase())){return true}
                                    if(item.amount?.toString().includes(filter.amountFilter)){return true}
                                }).map((quote, i) => (
                                    <tr key={quote.id} className='invoiceDetail'>
                                        <td onClick={()=>{handlePush(`/quotes/${quote.id}`)}}>{quote.name}</td>
                                        <td onClick={()=>{handlePush(`/quotes/${quote.id}`)}}>{quote.number}</td>
                                        <td onClick={()=>{handlePush(`/quotes/${quote.id}`)}}>{new Date(quote.date).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/quotes/${quote.id}`)}}>{(Number(quote.qty).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/quotes/${quote.id}`)}}>{(Number(quote.up).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/quotes/${quote.id}`)}}>{(Number(quote.amount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='sendInvoice'>
                                            <span onClick={()=>{
                                                handleSendEmail(`${quote.number}`, {customerDetails: {
                                                    name: quote.name,
                                                    email: quote.email,
                                                }})
                                            }}>
                                                <i className="fas fa-share fa-sm"></i>
                                                <small style={{display: 'block'}}>Send</small>
                                            </span>
                                            <span onClick={() =>{
                                                setQuoteData({
                                                    ...quote,
                                                    customerDetails: data[i].customerDetails
                                                })
                                                setUpdateToInvoice(true)
                                            }}>
                                                <i className="fas fa-file-alt fa-sm"></i>
                                                <small style={{display: 'block'}}>New</small>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    newQuotation && <Quotation
                    onClick={()=>{setNewQuotation(false)}}
                    refetch={() =>{
                        let source = axios.cancelToken.source()
                        let unMounted = false
                        setAlert(true);
                        setAlertMessage('Quotation Added Successfully');
                        setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                    }, 2000)
                    fetchQuotes(source,unMounted)
                    }}
                    />
                }
            </div>
            }
            {
                upDateToInvoice &&
            <div className='upDateQuoteToInvoice' ref={ref}>
                <h3>Convert Quotation to Invoice</h3>
                <div className="discountsAndVatSection">
                <p><b>VAT and Other Discounts</b></p>
                    <div className="vatAndOtherDiscounts">
                        <span>VAT(%)</span>
                        <input type="number" name='valueAddedTax' value={discountsAndVat.valueAddedTax} onChange={handle_Change} />
                    </div>
                    <div className="vatAndOtherDiscounts">
                        <span>Rebate(%)</span>
                        <input type="number" name='rebate' value={discountsAndVat.rebate} onChange={handle_Change} />
                    </div>
                    <div className="vatAndOtherDiscounts">
                        <span>Trade Discount(%)</span>
                        <input type="number" name='tradeDiscount' value={discountsAndVat.tradeDiscount} onChange={handle_Change} />
                    </div>
                    <div className="vatAndOtherDiscounts">
                        <span>Cash Discount(%)</span>
                        <input type="number" name='cashDiscount' value={discountsAndVat.cashDiscount} onChange={handle_Change} />
                    </div>
                    <div className="vatAndOtherDiscounts">
                        <span>Due In</span>
                        <select name="selectInvoiceTerm" id="selectInvoiceTerm" value={discountsAndVat.selectInvoiceTerm} onChange={handle_Change} style={{width: '48%'}}>
                            <option value={15}>15 Days (Default)</option>
                            <option value={30}>30 Days</option>
                            <option value={45}>45 Days</option>
                            <option value={60}>60 Days</option>
                            <option value={75}>75 Days</option>
                            <option value={90}>90 Days</option>
                        </select>
                    </div>
                </div>

                <div className="otherAdditionsSection">
                    <p><b>Other Additons</b></p>
                    <table>
                        <thead>
                            <tr>
                                <th>Element</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                otherAdditions.map((item, index) =>(
                                    <tr>
                                        <td>
                                            <input type="text" name='name' value={item.name} onChange={otherAdditionsChange('name', index)} />
                                        </td>
                                        <td>
                                            <input type="number" name='amount' value={item.amount} onChange={otherAdditionsChange('amount', index)} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <button className="btn" onClick={()=>{setUpdateToInvoice(false)}}>Cancel</button>
                    <button className="btn" onClick={handleInvoiceSubmit}>Submit</button>
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
                    message={alertMessage}
                />
            }
        </div>
    )
}

export default Quotes
