import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import {saveAs} from 'file-saver'
import print from 'print-js'
import {baseURL} from './axios'
import './InvoiceDetails.css'
import Quotation from './Quotation'
import QuotationTemplate from './QuotationTemplate'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from './userContext' 

function QuoteDetails() {
    const wrapperRef = useRef(null)
    const {quoteNumber} = useParams()
    const [newQuotation, setNewQuotation] = useState(false)
    const [loader, setLoader] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [quoteData, setQuoteData] = useState([])
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

    const [quotationData, setQuotationData] = useState({
        data : []
    })
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

            getQuotation(source, unMounted)
            return () => {
                unMounted = true;
                source.cancel('Cancelling request')
            }
        }, [])

        const getQuotation = async(source, unMounted)=>{
            try {
                setFetching(true)
                const fetch = await baseURL.get(`/quotes/${quoteNumber}`, {
                    cancelToken: source.token,
                    headers:{
                        'auth-token': user?.token
                    }
                })
                const res = await fetch.data
                setQuoteData(res)
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

    const today = new Date().toDateString()
    const dueDate = (value)=>{
        const today = new Date()
        const futureDate = new Date(today.setDate(today.getDate()+ Number(value)))
        return futureDate.toDateString();
    }

    const sumTotal = !quotationData ? 0 : quotationData.data?.map(data => {return(data.qty * data.up)}).reduce((a, b)=>{return Number(a) + Number(b)}, 0);
    const rebateValue = (sumTotal * (Number(discountsAndVat?.rebate)/100)).toFixed(2) || 0
    const commercialNet1 = sumTotal - rebateValue;
    const tradeDiscountValue = (commercialNet1 * (Number(discountsAndVat?.tradeDiscount)/100)).toFixed(2) || 0
    const commercialNet2 = commercialNet1 - tradeDiscountValue
    const cashDiscountValue = (commercialNet2 * (Number(discountsAndVat?.cashDiscount)/100)).toFixed(2) || 0
    const financialNet = commercialNet2 - cashDiscountValue
    const valueAddedTax = (financialNet * (Number(discountsAndVat?.valueAddedTax)/100)).toFixed(2) || 0
    const totalOtherAdditions = (otherAdditions.map(item => item.amount).reduce((a,b)=> (Number(a) + Number(b))))
    const additions = otherAdditions.filter(ele => ele.name !== '' && ele.amount !== '')

    // const invoiceData = {
    //     invoiceInput: {
    //         date : today,
    //         invoiceNumber : '1',
    //         customerName : quotationData.quoteInput?.customerName,
    //         dueDate : dueDate(discountsAndVat.selectInvoiceTerm)
    //     },
    //     selectInvoiceTerm : discountsAndVat.selectInvoiceTerm,
    //     customerDetails : quotationData?.customerDetails,
    //     data : quotationData?.data,
    //     additionsAndSubtractions : discountsAndVat,
    //     discountsAndVat: {
    //         rebateValue,
    //         tradeDiscountValue,
    //         cashDiscountValue,
    //         valueAddedTax
    //     },
    //     otherAdditions: additions,
    //     grossAmount: sumTotal,
    //     netPayable: (financialNet + Number(valueAddedTax) + totalOtherAdditions),
    //     totalPaid: 0,
    //     balanceDue: (financialNet + Number(valueAddedTax) + totalOtherAdditions),
    //     dueDate: dueDate(discountsAndVat.selectInvoiceTerm)
    // }

    const invoiceData = {
        invoiceInput: {
            date : today,
            invoiceNumber : '001',
            customerName : quotationData.quoteInput?.customerName,
            dueDate : dueDate(discountsAndVat.selectInvoiceTerm)
        },
        selectInvoiceTerm : discountsAndVat.selectInvoiceTerm,
        customerDetails : quotationData?.customerDetails,
        data : quotationData?.data,
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

    const quote = quoteData?.map(item => item.quoteInput.quoteNumber)
    const handleInvoiceSubmit = async()=>{
        await baseURL.post('/invoices', invoiceData)
        .then(async(res) => {
            const reponse = await res.data
            await baseURL.get(`/invoiceTemplates/${invoiceData.invoiceInput.invoiceNumber}`, {responseType: 'blob'})
            .then(async(res) => {
                const response = await res.data
                const pdfBlob = new Blob([response], {type:'application/pdf'})

                saveAs(pdfBlob, `invoiceNumber${invoiceData.invoiceInput.invoiceNumber}`)

                await baseURL.post(`/sendInvoice/${invoiceData.invoiceInput.invoiceNumber}`, invoiceData)
                .then((res)=>{
                    setUpdateToInvoice(false);
                    setFetching(false)
                    setAlert(true);
                    setAlertMessage('Invoice Added Successfully');
                    setTimeout(() => {
                        setAlert(false);
                        setAlertMessage('');
                    }, 2000)
                })
            })
        })
    }

    const handlePrint = async()=>{
        await baseURL.get(`/quotations/00${quote}`, {responseType: 'blob'})
            .then(async(res) => {
                const response = await res.data
                const pdfBlob = new Blob([response], {type:'application/pdf'})

                const pdfUrl = URL.createObjectURL(pdfBlob)

                print({
                    printable : pdfUrl,
                    type: 'pdf',
                    documentTitle: '@HK Solutions',
                })
                
            })
    }

    const handleSendQuotation = async() => {
        setFetching(true)
        await baseURL.post(`/sendQuotation/00${quote}`, quoteData[0])
        .then(async(res) => {
            setFetching(false)
            const response = await res.data

            setAlertMessage(response.message)
            setAlert(true)
            setTimeout(()=>{
                setAlertMessage('')
                setAlert(false)
            },3000)
        })
    }

    const handleExportPDF = async ()=>{
        await baseURL.get(`/quotations/00${quote}`, {responseType: 'blob'})
            .then(async(res) => {

        const pdfBlob = new Blob([res.data], {type:'application/pdf'})
                saveAs(pdfBlob, `quotationNumber${quote}`)
        })
    }




    return (
        <div className='Invoices'>
            {
                !fetching && <div className="invoicesHeading">
                <h1>Quotation #{quoteData?.map(item => item.quoteInput.quoteNumber)}</h1>
                <div className="invoiceDetailOptions invoicesHeading moreOptions">
                <button className="invoiceButton" onClick={()=>{setNewQuotation(true)}}>New Quotation</button>
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling}>More Options <i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{...styles}}>
                            <p className="option" onClick={handlePrint}>Print Quotation</p>
                            <p className="option" onClick={()=>{
                                setQuotationData(quoteData[0])
                                setUpdateToInvoice(true)
                            }}>Convert To Invoice</p>
                            <p className="option" onClick={handleExportPDF}>Export PDF</p>
                            <p className="option" onClick={handleSendQuotation}>Send Quotation</p>
                        </div>
                    </div>
                </div>
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
                quoteData?.map(item => (
                    <QuotationTemplate
                        data = {item}
                    />
                ))
            }

            {
                newQuotation && 
                <Quotation
                newQuotation={()=>{setNewQuotation(true)}}
                onClick={()=>{setNewQuotation(false)}}
                refetch={() =>{
                    setAlert(true);
                    setAlertMessage('Quotation Added Successfully');
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

export default QuoteDetails
