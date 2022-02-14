import React, { useState, useEffect, useRef, useContext } from 'react'
import {useHistory} from 'react-router'
import {saveAs} from 'file-saver'
import './Invoices.css'
import { baseURL } from './axios'
import Loader from './Loader'
import SinglePay from './SinglePay'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'

function Invoices() {
    const today = new Date()
    const thisYear = today.getFullYear()
    const thisMonth = today.getMonth()
    const thisDay = today.getDate()

    const history = useHistory()
    const [receivePay, setReceivePay] = useState(false)
    const wrapperRef = useRef(null)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const {user} = useContext(UserContext)
    const [payData, setPayData] = useState({})

    const {data, loader, setLoader} = useFetch('invoices', {})
    const {data:customerData} = useFetch('customers', {})
    const {data:products} = useFetch('products', [])
    
    const customers = customerData?.customers

    const invoices = data?.invoices

    const overDueInvoices = invoices?.filter(inv => (inv.balanceDue > 0 && new Date(inv?.input?.dueDate).getFullYear() <= today.getFullYear() && new Date(inv.input.dueDate).getTime() < today.getTime()))

    const dueInDaysInvoices = invoices?.filter(inv => (inv.balanceDue > 0) && (new Date(inv.input.dueDate).getFullYear() === today.getFullYear()) && (new Date(inv?.input.dueDate).getMonth() === today.getMonth()) && (new Date(inv.input.dueDate).getTime() > today.getTime()))

    const dueInSubsequentMonths = invoices?.filter(inv => (inv.balanceDue > 0) && (new Date(inv.input.dueDate).getFullYear() >= today.getFullYear()) && (new Date(inv.input.dueDate).getMonth() > today.getMonth()) && (new Date(inv.input.dueDate).getTime() > today.getTime()))
    

    const totalCreditSales = invoices?.map(item => item?.netPayable).reduce((a, b) => Number(a) + Number(b), 0)

    const totalDebtors = customers?.map(cust => cust?.totalDebt)?.reduce((a, b) => Number(a) + Number(b), 0)

    const averageDays = ((totalDebtors / totalCreditSales) * 360).toFixed(2) || 0

    const totalOverDueDebts = overDueInvoices?.map(invoice => invoice.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const totalDueInDays = dueInDaysInvoices?.map(invoice => invoice.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const totalSubsequentMonths = dueInSubsequentMonths?.map(inv => inv?.balanceDue).reduce((a, b) => Number(a) + Number(b), 0) || 0

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
    

    const handleSendInvoice = async(invoiceNumber, invoiceData)=>{
        // const cust = customers?.filter(cust => cust._id === invoiceData?.customer?._id && cust.id === invoiceData?.customer?.id && cust.number === invoiceData?.customer?.number) ?? []

        // const printData = {
        //     image : user?.logoURL,
        //     userName : user?.companyName,
        //     userAddress : user?.country,
        //     userEmail : user?.userEmail,
        //     invoiceNumber : invoiceData?.input?.number,
        //     date : new Date(invoiceData?.input?.date)?.toLocaleDateString(),
        //     dueDate : invoiceData?.input?.dueDate,
        //     selectInvoiceTerm : invoiceData?.input?.terms,
        //     customerName : cust[0]?.displayName,
        //     companyName : cust[0]?.companyName,
        //     email : cust[0]?.email,
        //     customerAddress : cust[0]?.billingAddress?.address,
        //     city : cust[0]?.billingAddress?.city,
        //     tel : cust[0]?.billingAddress?.tel,
        //     products : invoiceData?.products?.map(pdt => {
        //         const prdt = products?.filter(product => product._id === pdt._id)
        //         return {
        //             ...pdt,
        //             name : prdt[0]?.name,
        //             amount : (Number(pdt?.qty) * Number(pdt?.up) - Number(pdt?.discount?.amount) + Number(pdt?.vat?.amount))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        //             discount : {
        //                 rate : pdt?.discount?.rate,
        //                 amount : Number(pdt?.discount?.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //             },
        //             vat : {
        //                 rate : pdt?.vat?.rate,
        //                 amount : Number(pdt?.vat?.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //             },
        //             sellingPrice : Number(pdt?.up)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //         }
        //     }),
        //     totalDiscount : (invoiceData?.products?.map(pdt => Number(pdt?.discount?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        //     totalVat : (invoiceData?.products?.map(pdt => Number(pdt?.vat?.amount))?.reduce((acc, pdt) => Number(acc) + Number(pdt), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        //     grossAmount : (invoiceData?.products?.map(pdt => (Number(pdt?.qty) * Number(pdt?.up)) + Number(pdt?.vat?.amount) - Number(pdt?.discount?.amount))?.reduce((a, b) => a + b, 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        //     additions : invoiceData?.otherCharges?.map(item => ({
        //         ...item,
        //         amount : Number(item.amount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        //     })),
        //     totalOtherAdditions : (invoiceData?.otherCharges?.map(item => Number(item.amount))?.reduce((acc, item) => Number(acc) + Number(item), 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),

        //     netPayable : Number(invoiceData?.netPayable)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        // }
        try {
            setLoader(true)
            const {data} = await baseURL.post(`/invoices/sendInvoice/${invoiceNumber}`, invoiceData, {
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

    return (
        <div className='Invoices'>
            {
            !loader && 
            <div className='Invoices'>
                <div className="invoicesHeading invoicesHeadingCont">
                    <h1>Invoices</h1>
                    <button className="invoiceButton" onClick={()=>{history.push('/invoice/new-invoice')}}>New Invoice</button>
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

                    <div className="dueInDays">
                        <p className='title'>Due in Subsequent Months</p>
                        <p>{(Number(totalSubsequentMonths)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
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

                {/* <div className="invoiceFilters">
                    <div className="nameFilter">
                        <input type="text" name='nameFilter' value={filter.nameFilter} onChange={handleChange} className='filterInput' placeholder='Filter by customer name' />
                    </div>

                    <div className="amountFilter">
                        <input type="text" name='amountFilter' value={filter.amountFilter} onChange={handleChange} className='filterInput' placeholder='Filter by amount' />
                    </div>
                </div> */}

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
                        <tbody className='invoicesBody'>
                            {
                                invoices?.map(invoice => (
                                    <tr key={invoice._id} className='invoiceDetail'>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice?._id}`)}}>{customers?.filter(item => item?._id === invoice?.customer?._id && item?.id === invoice?.customer?.id && item?.number === invoice?.customer?.number).map(item => item.displayName)}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice?._id}`)}}>Invoice #{invoice?.input?.number}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice?._id}`)}}>{new Date(invoice?.input?.dueDate).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{new Date(invoice?.input?.date).toLocaleDateString()}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{(Number(invoice.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{(Number(invoice.totalPaid)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td onClick={()=>{handlePush(`/invoices/${invoice._id}`)}}>{(Number(invoice.balanceDue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
                                                handleSendInvoice(`${invoice?._id}`, invoice)
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
                    receivePay && <div ref={wrapperRef}>
                    
                    <SinglePay
                        totalDebt = {!payData.netPayable ? '' : (Number(payData?.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        totalPaid = {!payData.netPayable ? '' : (Number(payData?.totalPaid)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        balance = {!payData.netPayable ? '' : (Number(payData?.balanceDue)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                        data={payData}

                        input = {{
                            customer : payData.customer
                        }}

                        route = '/invoices/payment'

                        setLoader = {setLoader}
                        setAlertMessage = {setAlertMessage}
                        setAlert = {setAlert}

                        cancel = {()=>{setReceivePay(false)}}
                    />
                    
                </div>}
            </div>
            }
            {
                loader && <Loader/>
            }
            {
                <Alert
                    alert={alert}
                    cancelAlert={()=>{setAlert(false)}}
                    message={alertMessage}
                />
            }
        </div>
    )
}

export default Invoices
