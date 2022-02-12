import React, {useState, useEffect, useRef, useContext} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import query_string from 'query-string'
import Loader from './Loader'
import {baseURL} from './axios'
import './CustomerDetails.css'
import ReceivePayment from './ReceivePayment';
import Alert from './Alert'
import DeleteBox from './DeleteBox'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'

function CustomerDetails() {
    const {customerNumber} = useParams()
    const history = useHistory()
    const today = new Date()
    const [receivePayment, setReceivePayment] = useState(false)
    const [deleteItem, setDeleteItem] = useState(false)
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const {data, loader, setLoader} = useFetch(`customers/${customerNumber}`)
    const invoices = data?.invoices
    const receipts = data?.receipts
    const quotations = data?.quotations
    const creditNotes = data?.creditNotes
    const customer = data?.customer
    const {search} = useLocation()
    const query = query_string.parse(search)

    const wrapperRef = useRef(null)
    const wrapper_Ref = useRef(null)
    const detailsRef = useRef(null)

    const handleStyling = () => {
        wrapperRef.current.classList.toggle('showOptions')
    }
    const handleStyling2 = () => {
        wrapper_Ref.current.classList.toggle('showOptions')
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

    useEffect(() => {
        document.addEventListener('mousedown', removeDetailsCont);

        return () => {
            document.removeEventListener('mousedown', removeDetailsCont);
        }
    }, [])

    const removeDetailsCont = (e) => {
        const { current: wrap } = detailsRef;
        if (wrap && !wrap.contains(e.target)) {
            wrap.classList.remove('showCustDetails')
        }
        
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClick_Outside);

        return () => {
            document.removeEventListener('mousedown', handleClick_Outside);
        }
    }, [])

    function handleClick_Outside(e) {
        const { current: wrap } = wrapper_Ref;
        if (wrap && !wrap.contains(e.target)) {
            wrap.classList.remove('showOptions')
        }
    }

    const handleUpdate = () => {
        history.push(`/update-customer/${customerNumber}`)
    }

    const handleDelete = async ()=>{
        try {
            setLoader(true)
            const {data} = await baseURL.delete(`/customers/${customerNumber}`, {
                headers: {
                    'auth-token' : user.token,
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
                setAlertMessage('')
                data.status === 200 && history.goBack()
            }, 3000)
        } catch (error) {
            console.log(error);
        }finally{
            setLoader(false)
        }
    }

    
    
    return (
        <div className='CustomerDetails Invoices'>
            <div className="invoicesHeading invoicesHeadingCont ">
                <h1>{customer?.displayName}</h1>
                <div className="moreOptions mainOptionsCont">
                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton noMobile" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont">
                            <p className="option" onClick={()=>{
                                history.push('/invoice/new-invoice')
                            }}>Invoice</p>
                            <p className="option" onClick={()=>{
                                history.push('/receipt/new-receipt')
                            }}>Receipt</p>
                            <p className="option" onClick={()=>{
                                history.push('/payments/customer-payment')
                            }}>Receive Payment</p>
                            <p className="option" onClick={()=>{
                                history.push('/credit-note/new-credit-note')
                            }}>Credit Note</p>
                            <p className="option" onClick={()=>{
                                history.push('/quotation/new-quotation')
                            }}>Quotation</p>
                            <p className="option" onClick={()=>{
                                history.push('/customer/new-customer')
                            }}>New Customer</p>
                        </div>
                    </div>

                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton" onClick={handleStyling2}>{window.innerWidth > 768 ? 'More Options' : 'Options'}<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont">
                            <p className="option mobile" onClick={()=>{
                                history.push('/invoice/new-invoice')
                            }}>Invoice</p>
                            <p className="option mobile" onClick={()=>{
                                history.push('/receipt/new-receipt')
                            }}>Receipt</p>
                            <p className="option mobile" onClick={()=>{
                                history.push('/payments/customer-payment')
                            }}>Receive Payment</p>
                            <p className="option mobile" onClick={()=>{
                                history.push('/customer/new-customer')
                            }}>New Customer</p>
                            <p className="option" onClick={()=>{window.open(`mailto:${customer?.email}`);}}>Send Mail</p>
                            <p className="option updateQuote" onClick={handleUpdate}>Edit Info</p>
                            <p className="option deleteQuote" onClick={()=>{setDeleteItem(true)}}>Delete</p>
                            
                        </div>
                    </div>
                </div>

            </div>
            <div className="filterContainer">
                <div className='filter'>
                        <span
                            className={Object.keys(query).length === 0 && 'button'}
                            onClick={() => {
                                Object.keys(query).length > 0 && history.push(`/customers/${customer?._id}`) 
                            }}
                        >
                            Overview
                        </span>

                        <span
                            className={query.view_invoices && 'button'}
                            onClick={() => {
                                !query.view_invoices && history.push(`/customers/${customer?._id}?view_invoices=true`)
                            }}
                        >
                            All Invoices
                        </span>

                        <span
                            className={query.view_receipts && 'button'}
                            onClick={() => {
                                !query.view_receipts && history.push(`/customers/${customer?._id}?view_receipts=true`)
                            }}
                        >
                            Receipts
                        </span>

                        <span
                            className={query.view_quotes && 'button'}
                            onClick={() => {
                                !query.view_quotes && history.push(`/customers/${customer?._id}?view_quotes=true`)
                            }}
                        >
                            Quotations
                        </span>

                        <span
                            className={query.view_notes && 'button'}
                            onClick={() => {
                                !query.view_notes && history.push(`/customers/${customer?._id}?view_notes=true`)
                            }}
                        >
                            Credit Notes
                        </span>
                </div>
            </div>

            
                <div className="customerBodyELements">
                    <div className="toggleCustDetails">
                        <span className="toggleDetails" onClick={()=>{
                            detailsRef.current.classList.toggle('showCustDetails')
                        }}>Show Details</span>
                    </div>
                    <div className="customerDetailsInfo" ref={detailsRef}>
                        <h2>{customer?.companyName}</h2>
                        <i class="fas fa-user-circle fa-5x"></i>
                        <div className="customerName group">
                            <p>Name: {customer?.displayName}</p>
                            <p className='customerDetail'><span>Email:</span>{customer?.email}</p>
                            <p className='customerDetail'><span>Tel:</span>{customer?.billingAddress?.tel}</p>
                        </div>
                        <div className="contactInfos group">
                            <h3 className='customerDetail'><u>Billing Address</u></h3>
                            <p className='customerDetail'><span>Addres:</span>{customer?.billingAddress?.address}</p>
                            <p className='customerDetail'><span>Country:</span>{customer?.billingAddress?.country}</p>
                            <p className='customerDetail'><span>City:</span>{customer?.billingAddress?.city}</p>
                            <p className='customerDetail'><span>Tel:</span>{customer?.billingAddress?.tel}</p>
                            <p className='customerDetail'><span>WhatsApp:</span>{customer?.billingAddress?.whatsApp}</p>
                            <p className='customerDetail'><span>Mobile:</span>{customer?.billingAddress?.mobile}</p>
                            <p className='customerDetail'><span>Fax: </span>{customer?.billingAddress?.fax}</p>
                        </div>

                        <div className="contactInfos group">
                            <h3 className='customerDetail'><u>Shipping Address</u></h3>
                            <p className='customerDetail'><span>Addres:</span>{customer?.shippingAddress?.address}</p>
                            <p className='customerDetail'><span>Country:</span>{customer?.shippingAddress?.country}</p>
                            <p className='customerDetail'><span>City:</span>{customer?.shippingAddress?.city}</p>
                            <p className='customerDetail'><span>Tel:</span>{customer?.shippingAddress?.tel}</p>
                            <p className='customerDetail'><span>WhatsApp:</span>{customer?.shippingAddress?.whatsApp}</p>
                            <p className='customerDetail'><span>Mobile:</span>{customer?.shippingAddress?.mobile}</p>
                            <p className='customerDetail'><span>Fax: </span>{customer?.shippingAddress?.fax}</p>
                        </div>

                        <div className="contactInfos group">
                            <h3 className='customerDetail'><u>Other Info</u></h3>
                            <p className='customerDetail'><span>Customer ID:</span>{customer?.id}</p>
                            <p className='customerDetail'><span>Customer Number:</span>{customer?.number}</p>
                        </div>
                    </div>

                    <div className="customerBalancesContt">
                        <div className="customerBalancesCont">
                            <div className="customerBalance">
                                <p className='title'>Opening Balance</p>
                                <p>{Number(customer?.openingBalance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            <div className="customerBalance">
                                <p className='title'>Outstanding Debt</p>
                                <p>{Number(customer?.totalDebt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                            
                        </div>
                        {
                            Object.keys(query).length === 0 && 
                            <div className="overviewCustomerTrans">
                                <div className="customerInvoices">
                                    <h3 className='custInvoiceHeading'>Recent Invoices</h3>
                                    {
                                        invoices?.length > 0 ? invoices?.slice(-3)?.map(invoice => (
                                            <div className="custInvoiceItem" onClick={()=>{
                                                history.push(`/invoices/${invoice?._id}`)
                                            }}>
                                                <p className="invoiceNumber">
                                                    Inv # {invoice?.input?.number}
                                                </p>
                                                <div className="invoiceDueDate">
                                                    <span>Due On</span><span>{new Date(invoice?.input?.dueDate).toLocaleDateString()}</span>
                                                    <p className="invoiceStatus">
                                                        {
                                                            today > new Date(invoice?.input?.dueDate) ? 'Over due' : 'Not Due'
                                                        }
                                                    </p>
                                                </div>
                                                <div className="totalDe">
                                                    <p className="debtTitle">
                                                        Total Debt
                                                    </p>
                                                    <p className="debtValue">
                                                        {Number(invoice?.netPayable).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                                <div className="totalDe">
                                                    <p className="debtTitle">
                                                        Balance Due
                                                    </p>
                                                    <p className="debtValue">
                                                        {Number(invoice?.balanceDue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : <div className="noInvoice">
                                            No Invoice <Link to='/invoice/new-invoice' className='addNewInvoice'>Add Invoice</Link>
                                        </div>
                                    }
                                </div>

                                <div className="customerInvoices">
                                    <h3 className='custInvoiceHeading'>Recent Receipts</h3>
                                    {
                                        receipts?.length > 0 ? receipts?.slice(-3)?.map(receipt => (
                                            <div className="custInvoiceItem" onClick={()=>{
                                                history.push(`/receipts/${receipt?._id}`)
                                            }}>
                                                <p className="invoiceNumber">
                                                    Rcp # {receipt?.input?.number}
                                                </p>
                                                <div className="invoiceDueDate">
                                                    <span>Date</span><span>{new Date(receipt?.input?.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="totalDe">
                                                    <p className="debtTitle">
                                                        Net Amount
                                                    </p>
                                                    <p className="debtValue">
                                                        {Number(receipt?.netPayable).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : <div className="noInvoice">
                                            No Receipt <Link to='/receipt/new-receipt' className='addNewInvoice'>Add Receipt</Link>
                                        </div>
                                    }
                                </div>

                                <div className="customerInvoices">
                                    <h3 className='custInvoiceHeading'>Recent Credit Notes</h3>
                                    {
                                        creditNotes?.length > 0 ? creditNotes?.slice(-3)?.map(creditNote => (
                                            <div className="custInvoiceItem" onClick={()=>{
                                                history.push(`/credit-notes/${creditNote?._id}`)
                                            }}>
                                                <p className="invoiceNumber">
                                                    Note # {creditNote?.input?.number}
                                                </p>
                                                <div className="invoiceDueDate">
                                                    <span>Date</span><span>{new Date(creditNote?.input?.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="totalDe">
                                                    <p className="debtTitle">
                                                        Net Amount
                                                    </p>
                                                    <p className="debtValue">
                                                        {Number(creditNote?.netPayable).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : <div className="noInvoice">
                                            No credit note <Link to='/credit-note/new-credit-note' className='addNewInvoice'>Add credit note</Link>
                                        </div>
                                    }
                                </div>

                                <div className="customerInvoices">
                                    <h3 className='custInvoiceHeading'>Recent Quotes</h3>
                                    {
                                        quotations?.length > 0 ? quotations?.slice(-3)?.map(quote => (
                                            <div className="custInvoiceItem" onClick={()=>{
                                                history.push(`/quotes/${quote?._id}`)
                                            }}>
                                                <p className="invoiceNumber">
                                                    Quote # {quote?.input?.number}
                                                </p>
                                                <div className="invoiceDueDate">
                                                    <span>Exp Date</span><span>{new Date(quote?.input?.dueDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="totalDe">
                                                    <p className="debtTitle">
                                                        Net Amount
                                                    </p>
                                                    <p className="debtValue">
                                                        {Number(quote?.netPayable).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : <div className="noInvoice">
                                            No quote <Link to='/quotation/new-quotation' className='addNewInvoice'>Add quote</Link>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                        <div className="allDebtorsContainer">
                        {
                            query.view_invoices && (
                                invoices?.length > 0 ? <table className="allDebtorsTable">
                                <thead>
                                    <tr className='customersHeading'>
                                        <th>Invoice Number</th>
                                        <th>Date</th>
                                        <th>Due Date</th>
                                        <th>Net Amount</th>
                                        <th>Balance Due</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        invoices?.map(invoice => (
                                            <tr className="invoiceListbody invoiceDetail" onClick={()=>{
                                                history.push(`/invoices/${invoice?._id}`)
                                            }}>
                                                <td>
                                                    Inv #{invoice?.input?.number}
                                                </td>
                                                <td>
                                                    {new Date(invoice?.input?.date).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {new Date(invoice?.input?.dueDate).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {
                                                        Number(invoice?.netPayable)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        Number(invoice?.balanceDue)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        today > new Date(invoice?.input?.dueDate) ? 'Over due' : 'Not due'
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : <p className="noInvoice">No Data to Display <Link to='/invoice/new-invoice' className='addNewInvoice'>Add new invoice</Link></p>
                            )
                        }
                        {
                            query.view_receipts && (
                                receipts?.length > 0 ? <table className="allDebtorsTable">
                                <thead>
                                    <tr className='customersHeading'>
                                        <th>Receipt Number</th>
                                        <th>Date</th>
                                        <th>Net Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        receipts?.map(receipt => (
                                            <tr className="invoiceListbody invoiceDetail" onClick={()=>{
                                                history.push(`/receipts/${receipt?._id}`)
                                            }}>
                                                <td>
                                                    Rcp #{receipt?.input?.number}
                                                </td>
                                                <td>
                                                    {new Date(receipt?.input?.date).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {
                                                        Number(receipt?.netPayable)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : <p className="noInvoice">No Data to Display <Link to='/receipt/new-receipt' className='addNewInvoice'>Add new receipt</Link></p>
                            )
                        }

                        {
                            query.view_notes && (
                                creditNotes?.length > 0 ? <table className="allDebtorsTable">
                                    <thead>
                                        <tr className='customersHeading'>
                                            <th>Note Number</th>
                                            <th>Date</th>
                                            <th>Net Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            creditNotes?.map(note => (
                                                <tr className="invoiceListbody invoiceDetail" onClick={()=>{
                                                    history.push(`/credit-notes/${note?._id}`)
                                                }}>
                                                    <td>
                                                        Note #{note?.input?.number}
                                                    </td>
                                                    <td>
                                                        {new Date(note?.input?.date).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {
                                                            Number(note?.netPayable)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table> : <p className="noInvoice">No Data to Display <Link to='/credit-note/new-credit-note' className='addNewInvoice'>Add new credit note</Link></p>
                            )
                        }

                        {
                            query.view_quotes && (
                                quotations?.length > 0 ? <table className="allDebtorsTable">
                                    <thead>
                                        <tr className='customersHeading'>
                                            <th>Quote Number</th>
                                            <th>Date</th>
                                            <th>Exp Date</th>
                                            <th>Net Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            quotations?.map(quote => (
                                                <tr className="invoiceListbody invoiceDetail" onClick={()=>{
                                                    history.push(`/quotations/${quote?._id}`)
                                                }}>
                                                    <td>
                                                        Quote #{quote?.input?.number}
                                                    </td>
                                                    <td>
                                                        {new Date(quote?.input?.date).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {new Date(quote?.input?.dueDate).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {
                                                            Number(quote?.netPayable)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            today > new Date(quote?.input?.dueDate) ? 'Expired' : 'Not expired'
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table> : <p className="noInvoice">No Data to Display <Link to='/quotation/new-quotation' className='addNewInvoice'>Add new quotation</Link></p>
                            )
                        }
                        </div>
                    </div>
                </div>
            
            {
                receivePayment && <ReceivePayment
                    onClick={() => {
                        setReceivePayment(false)
                    }}
                    refetch={()=>{
                        setAlertMessage('Customer Payment Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }
            
            {
                deleteItem && <DeleteBox
                    onClick = {()=>{setDeleteItem(false) }}
                    handleDelete = {handleDelete}
                    message='Please ensure customer closing balance is zero to avoid irregularities in financial statements'
                />
            }

            {
                loader && <Loader />
            }

            <Alert
                alert={alert}
                message={alertMessage}
                cancelAlert={()=>{setAlert(false)}}
            />
        </div>
    )
}

export default CustomerDetails
