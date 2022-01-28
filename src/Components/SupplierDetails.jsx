import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import query_string from 'query-string'
import Loader from './Loader'
import './CustomerDetails.css'
import ReceivePayment from './ReceivePayment';
import Alert from './Alert'
import { UserContext } from './userContext'
import useFetch from '../customHooks/useFetch'
import { baseURL } from './axios'
import DeleteBox from './DeleteBox'

function SupplierDetails() {
    const { supplierNumber } = useParams()
    const history = useHistory()
    const today = new Date()
    const [receivePayment, setReceivePayment] = useState(false)
    const [deleteItem, setDeleteItem] = useState(false)
    const { user } = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')


    const { data, loader, setLoader } = useFetch(`suppliers/${supplierNumber}`, {})
    const invoices = data?.invoices
    const receipts = data?.receipts
    const quotations = data?.orders
    const creditNotes = data?.returns
    const supplier = data?.supplier

    const { search } = useLocation()
    const query = query_string.parse(search)

    const wrapper_Ref = useRef(null)
    const wrapperRef = useRef(null)

    const [styler, setStyler] = useState({
        transform: 'translateY(-5rem)',
        visibility: 'hidden'
    })
    const [styler2, setStyler2] = useState({
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
        transform: styler.transform,
        visibility: styler.visibility,
        transition: 'transform 0.5s ease',
    }
    const styles2 = {
        width: '100%',
        position: 'absolute',
        color: 'gray',
        fontWeight: '550',
        padding: '1rem',
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        transform: styler2.transform,
        visibility: styler2.visibility,
        transition: 'transform 0.5s ease',
    }

    const handleStyling = () => {
        styler.visibility === 'hidden' ? setStyler({ transform: 'translateY(0)', visibility: 'visible' }) : setStyler({ transform: 'translateY(-5rem)', visibility: 'hidden' })
    }

    const handleStyling2 = () => {
        styler2.visibility === 'hidden' ? setStyler2({ transform: 'translateY(0)', visibility: 'visible' }) : setStyler2({ transform: 'translateY(-5rem)', visibility: 'hidden' })
    }

    useEffect(() => {
        document.addEventListener('mousedown', handle_Click_Outside);

        return () => {
            document.removeEventListener('mousedown', handle_Click_Outside);
        }
    }, [])

    function handle_Click_Outside(e) {
        const { current: wrap } = wrapper_Ref;
        if (wrap && !wrap.contains(e.target)) {
            setStyler({ transform: 'translateY(-5rem)', visibility: 'hidden' })
        }
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
            setStyler2({ transform: 'translateY(-5rem)', visibility: 'hidden' })
        }
    }

    const handleUpdate = () => {
        history.push(`/update-supplier/${supplierNumber}`)
    }

    const handleDelete = async () => {
        try {
            setLoader(true)
            const { data } = await baseURL.delete(`suppliers/${supplierNumber}`, {
                headers: {
                    'auth-token': user.token,
                }
            })
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                data.status === 200 && history.goBack()
            }, 3000)
        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false)
        }
    }



    return (
        <div className='CustomerDetails Invoices'>
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>{supplier?.displayName}</h1>
                <div className="moreOptions mainOptionsCont">
                    <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                        <button className="invoiceButton noMobile" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{ ...styles }}>
                            <p className="option" onClick={() => {
                                history.push('/purchase-invoice/new-purchase-invoice')
                            }}>Purchase Invoice</p>
                            <p className="option" onClick={() => {
                                history.push('/purchase-receipt/new-purchase-receipt')
                            }}>Purchase Receipt</p>
                            <p className="option" onClick={() => {
                                history.push('/payments/supplier-payment')
                            }}>Make Payment</p>
                            <p className="option" onClick={() => {
                                history.push('/purchase-order/new-purchase-order')
                            }}>Purchase Order</p>
                            <p className="option" onClick={() => {
                                history.push('/purchase-return/new-purchase-return')
                            }}>Purchase Return</p>
                            <p className="option" onClick={() => {
                                history.push('/supplier/new-supplier')
                            }}>New Supplier</p>
                        </div>
                    </div>

                    <div className="moreOptions invoicesHeading" ref={wrapperRef}>
                        <button className="invoiceButton" onClick={handleStyling2}>{window.innerWidth > 768 ? 'More Options' : 'Options'}<i className="fas fa-sort-down"></i></button>
                        <div className="moreOptionsCont" style={{ ...styles2 }}>
                            <p className="option mobile" onClick={() => {
                                history.push('/purchase-invoice/new-purchase-invoice')
                            }}>Purchase Invoice</p>
                            <p className="option mobile" onClick={() => {
                                history.push('/purchase-receipt/new-purchase-receipt')
                            }}>Purchase Receipt</p>
                            <p className="option mobile" onClick={() => {
                                history.push('/payments/supplier-payment')
                            }}>Make Payment</p>
                            <p className="option mobile" onClick={() => {
                                history.push('/supplier/new-supplier')
                            }}>New Supplier</p>
                            <p className="option" onClick={() => { window.open(`mailto:${supplier?.email}`); }}>Send Mail</p>
                            <p className="option updateQuote" onClick={handleUpdate}>Edit Info</p>
                            <p className="option deleteQuote" onClick={() => { setDeleteItem(true) }}>Delete</p>

                        </div>
                    </div>
                </div>

            </div>
            <div className="filterContainer">
                <div className='filter'>
                    <span
                        className={Object.keys(query).length === 0 && 'button'}
                        onClick={() => {
                            Object.keys(query).length > 0 && history.push(`/suppliers/${supplier?._id}`)
                        }}
                    >
                        Overview
                    </span>

                    <span
                        className={query.view_invoices && 'button'}
                        onClick={() => {
                            !query.view_invoices && history.push(`/suppliers/${supplier?._id}?view_invoices=true`)
                        }}
                    >
                        All Invoices
                    </span>

                    <span
                        className={query.view_receipts && 'button'}
                        onClick={() => {
                            !query.view_receipts && history.push(`/suppliers/${supplier?._id}?view_receipts=true`)
                        }}
                    >
                        Receipts
                    </span>

                    <span
                        className={query.view_orders && 'button'}
                        onClick={() => {
                            !query.view_orders && history.push(`/suppliers/${supplier?._id}?view_orders=true`)
                        }}
                    >
                        Orders
                    </span>

                    <span
                        className={query.view_returns && 'button'}
                        onClick={() => {
                            !query.view_returns && history.push(`/suppliers/${supplier?._id}?view_returns=true`)
                        }}
                    >
                        Purchase Returns
                    </span>
                </div>
            </div>


            <div className="customerBodyELements">
                <div className="customerDetailsInfo">
                    <h2>{supplier?.companyName}</h2>
                    <i class="fas fa-user-circle fa-5x"></i>
                    <div className="customerName group">
                        <p>Name: {supplier?.displayName}</p>
                        <p className='customerDetail'><span>Email:</span>{supplier?.email}</p>
                        <p className='customerDetail'><span>Tel:</span>{supplier?.billingAddress?.tel}</p>
                    </div>
                    <div className="contactInfos group">
                        <h3 className='customerDetail'><u>Billing Address</u></h3>
                        <p className='customerDetail'><span>Addres:</span>{supplier?.billingAddress?.address}</p>
                        <p className='customerDetail'><span>Country:</span>{supplier?.billingAddress?.country}</p>
                        <p className='customerDetail'><span>City:</span>{supplier?.billingAddress?.city}</p>
                        <p className='customerDetail'><span>Tel:</span>{supplier?.billingAddress?.tel}</p>
                        <p className='customerDetail'><span>WhatsApp:</span>{supplier?.billingAddress?.whatsApp}</p>
                        <p className='customerDetail'><span>Mobile:</span>{supplier?.billingAddress?.mobile}</p>
                        <p className='customerDetail'><span>Fax: </span>{supplier?.billingAddress?.fax}</p>
                    </div>

                    <div className="contactInfos group">
                        <h3 className='customerDetail'><u>Shipping Address</u></h3>
                        <p className='customerDetail'><span>Addres:</span>{supplier?.shippingAddress?.address}</p>
                        <p className='customerDetail'><span>Country:</span>{supplier?.shippingAddress?.country}</p>
                        <p className='customerDetail'><span>City:</span>{supplier?.shippingAddress?.city}</p>
                        <p className='customerDetail'><span>Tel:</span>{supplier?.shippingAddress?.tel}</p>
                        <p className='customerDetail'><span>WhatsApp:</span>{supplier?.shippingAddress?.whatsApp}</p>
                        <p className='customerDetail'><span>Mobile:</span>{supplier?.shippingAddress?.mobile}</p>
                        <p className='customerDetail'><span>Fax: </span>{supplier?.shippingAddress?.fax}</p>
                    </div>

                    <div className="contactInfos group">
                        <h3 className='customerDetail'><u>Other Info</u></h3>
                        <p className='customerDetail'><span>Customer ID:</span>{supplier?.id}</p>
                        <p className='customerDetail'><span>Customer Number:</span>{supplier?.number}</p>
                    </div>
                </div>

                <div className="customerBalancesContt">
                    <div className="customerBalancesCont">
                        <div className="customerBalance">
                            <p className='title'>Opening Balance</p>
                            <p>{Number(supplier?.openingBalance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                        <div className="customerBalance">
                            <p className='title'>Outstanding Debt</p>
                            <p>{Number(supplier?.totalDebt).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>

                    </div>
                    {
                        Object.keys(query).length === 0 &&
                        <div className="overviewCustomerTrans">
                            <div className="customerInvoices">
                                <h3 className='custInvoiceHeading'>Recent Invoices</h3>
                                {
                                    invoices?.length > 0 ? invoices?.slice(-3)?.map(invoice => (
                                        <div className="custInvoiceItem" onClick={() => {
                                            history.push(`/purchase-invoices/${invoice?._id}`)
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
                                        No Invoice <Link to='/purchase-invoice/new-purchase-invoice' className='addNewInvoice'>Add Invoice</Link>
                                    </div>
                                }
                            </div>

                            <div className="customerInvoices">
                                <h3 className='custInvoiceHeading'>Recent Receipts</h3>
                                {
                                    receipts?.length > 0 ? receipts?.slice(-3)?.map(receipt => (
                                        <div className="custInvoiceItem" onClick={() => {
                                            history.push(`/purchase-receipts/${receipt?._id}`)
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
                                        No Receipt <Link to='/purchase-receipt/new-purchase-receipt' className='addNewInvoice'>Add Receipt</Link>
                                    </div>
                                }
                            </div>

                            <div className="customerInvoices">
                                <h3 className='custInvoiceHeading'>Recent Purchase Returns</h3>
                                {
                                    creditNotes?.length > 0 ? creditNotes?.slice(-3)?.map(creditNote => (
                                        <div className="custInvoiceItem" onClick={() => {
                                            history.push(`/purchase-returns/${creditNote?._id}`)
                                        }}>
                                            <p className="invoiceNumber">
                                                Rtn # {creditNote?.input?.number}
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
                                        No purchase return <Link to='/purchase-return/new-purchase-return' className='addNewInvoice'>Add purchase return</Link>
                                    </div>
                                }
                            </div>

                            <div className="customerInvoices">
                                <h3 className='custInvoiceHeading'>Recent Orders</h3>
                                {
                                    quotations?.length > 0 ? quotations?.slice(-3)?.map(quote => (
                                        <div className="custInvoiceItem" onClick={() => {
                                            history.push(`/purchase-orders/${quote?._id}`)
                                        }}>
                                            <p className="invoiceNumber">
                                                Order # {quote?.input?.number}
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
                                        No purchase order <Link to='/purchase-order/new-purchase-order' className='addNewInvoice'>Add purchase order</Link>
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
                                                <tr className="invoiceListbody invoiceDetail" onClick={() => {
                                                    history.push(`/purchase-invoices/${invoice?._id}`)
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
                                </table> : <p className="noInvoice">No Data to Display <Link to='/purchase-invoice/new-purchase-invoice' className='addNewInvoice'>Add new invoice</Link></p>
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
                                                <tr className="invoiceListbody invoiceDetail" onClick={() => {
                                                    history.push(`/purchase-receipts/${receipt?._id}`)
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
                                </table> : <p className="noInvoice">No Data to Display <Link to='/purchase-receipt/new-purchase-receipt' className='addNewInvoice'>Add new receipt</Link></p>
                            )
                        }

                        {
                            query.view_returns && (
                                creditNotes?.length > 0 ? <table className="allDebtorsTable">
                                    <thead>
                                        <tr className='customersHeading'>
                                            <th>Return Number</th>
                                            <th>Date</th>
                                            <th>Net Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            creditNotes?.map(note => (
                                                <tr className="invoiceListbody invoiceDetail" onClick={() => {
                                                    history.push(`/purchase-returns/${note?._id}`)
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
                                </table> : <p className="noInvoice">No Data to Display <Link to='/purchase-return/new-purchase-return' className='addNewInvoice'>Add new purchase return</Link></p>
                            )
                        }

                        {
                            query.view_orders && (
                                quotations?.length > 0 ? <table className="allDebtorsTable">
                                    <thead>
                                        <tr className='customersHeading'>
                                            <th>Order Number</th>
                                            <th>Date</th>
                                            <th>Exp Date</th>
                                            <th>Net Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            quotations?.map(quote => (
                                                <tr className="invoiceListbody invoiceDetail" onClick={() => {
                                                    history.push(`/purchase-orders/${quote?._id}`)
                                                }}>
                                                    <td>
                                                        Order #{quote?.input?.number}
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
                                </table> : <p className="noInvoice">No Data to Display <Link to='/purchase-order/new-purchase-order' className='addNewInvoice'>Add new order</Link></p>
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
                    refetch={() => {
                        setAlertMessage('Customer Payment Added Successfully')
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                            setAlertMessage('')
                        })
                    }}
                />
            }

            <Alert
                alert={alert}
                message={alertMessage}
                cancelAlert={() => { setAlert(false) }}
            />

            {
                loader && <Loader />
            }
            {
                deleteItem && <DeleteBox
                    onClick={() => { setDeleteItem(false) }}
                    handleDelete={handleDelete}
                    message='Ensure suppliers debt is equal to zero'
                />
            }


        </div>
    )
}

export default SupplierDetails
