import React, {useEffect, useRef, useState, useContext} from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import queryString from 'query-string'
import './InventoryPage.css'
import './Sales.css'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'
import useFetch from '../customHooks/useFetch'
import DeleteBox from './DeleteBox'
import { baseURL } from './axios'


function InventoryPage() {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [deleteBox, setDeleteBox] = useState(false)
    const history = useHistory()
    const {search} = useLocation()
    const {productNumber} = useParams()
    const query = queryString.parse(search)
    const {user} = useContext(UserContext)
    const {data, loader:fetching, setLoader:setFetching} = useFetch(`products/${productNumber}`)

    const product = data?.product
    const invoices = data?.invoices
    const receipts = data?.receipts
    const creditNotes = data?.creditNotes
    const purchaseReceipts = data?.purchaseReceipts
    const purchaseInvoices = data?.purchaseInvoices
    const purchaseReturns = data?.purchaseReturns

    const today = new Date()

    const wrapper_Ref = useRef(null)
    const detailsRef = useRef(null)

    const handleStyling = () => {
        wrapper_Ref.current.classList.toggle('showOptions')
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

        return ()=>{
            document.removeEventListener('mousedown', handleClick_Outside);
        }
    }, [])

    function handleClick_Outside(e) {
        const { current: wrap } = wrapper_Ref;
        if (wrap && !wrap.contains(e.target)) {
            wrap.classList.remove('showOptions')
        }
    }

    const showDeleteBox = ()=>{setDeleteBox(!deleteBox)}

    const handleDelete = async()=>{
        try {
            setFetching(true)
            const res = await baseURL.delete(`/products/${productNumber}`, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            const {data} = await res
            setAlertMessage(data.message)
            setAlert(true)
            setTimeout(() => {
                setAlert(false)
                setAlertMessage('')
                data.status === 200 && history.push('/inventories')
            }, 3000);
        } catch (error) {
            console.log(error);
        }finally{
            setFetching(false)
        }
    }

    return (
        <div className='CustomerDetails Invoices InventoryPage'>
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>Product: {product?.name}</h1>
                <div className="moreOptions mainOptionsCont">
                    <div className="moreOptions">
                        <div className="moreOptions invoicesHeading" ref={wrapper_Ref}>
                            <button className="invoiceButton" onClick={handleStyling}>New Transaction<i className="fas fa-sort-down"></i></button>
                            <div className="moreOptionsCont">
                                <p className="option" onClick={()=>{history.push('/purchase-invoice/new-purchase-invoice')}}>Purchase Invoice</p>
                                <p className="option" onClick={()=>{history.push('/purchase-receipt/new-purchase-receipt')}}>Purchase Receipt</p>
                                <p className="option" onClick={()=>{history.push('/invoice/new-invoice')}}>Sales Invoice</p>
                                <p className="option" onClick={()=>{history.push('/receipt/new-receipt')}}>Sales Receipt</p>
                                <p className="option" onClick={()=>{history.push('/products/new-product')}}>New Product</p>
                                <p className="option updateQuote" onClick={()=>{history.push(`/update-product/${productNumber}`)}}>Edit Product</p>
                                <p className="option deleteQuote" onClick={showDeleteBox}>Delete Product</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="filterContainer">
                <div className='filter'>
                        <span
                            className={Object.keys(query).length === 0 && 'button'}
                            onClick={() => {
                                Object.keys(query).length > 0 && history.push(`/inventories/${product?._id}`) 
                            }}
                        >
                            Overview
                        </span>

                        <span
                            className={query.view_invoices && 'button'}
                            onClick={() => {
                                !query.view_invoices && history.push(`/inventories/${product?._id}?view_invoices=true`)
                            }}
                        >
                            Invoices
                        </span>

                        <span
                            className={query.view_receipts && 'button'}
                            onClick={() => {
                                !query.view_receipts && history.push(`/inventories/${product?._id}?view_receipts=true`)
                            }}
                        >
                            Receipts
                        </span>

                        {/* <span
                            className={query.view_credit_notes && 'button'}
                            onClick={() => {
                                !query.view_credit_notes && history.push(`/inventories/${product?._id}?view_credit_notes=true`)
                            }}
                        >
                            Credit Notes
                        </span> */}

                        <span
                            className={query.view_purchase_invoices && 'button'}
                            onClick={() => {
                                !query.view_purchase_invoices && history.push(`/inventories/${product?._id}?view_purchase_invoices=true`)
                            }}
                        >
                            Purchase Invoices
                        </span>

                        <span
                            className={query.view_purchase_receipts && 'button'}
                            onClick={() => {
                                !query.view_purchase_receipts && history.push(`/inventories/${product?._id}?view_purchase_receipts=true`)
                            }}
                        >
                            Purchase Receipts
                        </span>

                        {/* <span
                            className={query.view_purchase_returns && 'button'}
                            onClick={() => {
                                !query.view_purchase_returns && history.push(`/inventories/${product?._id}?view_purchase_returns=true`)
                            }}
                        >
                            Purchase Returns
                        </span> */}
                </div>
            </div>

            <div className="customerBodyELements">
                <div className="toggleCustDetails">
                    <span className="toggleDetails" onClick={()=>{
                        detailsRef.current.classList.toggle('showCustDetails')
                    }}>Show Details</span>
                </div>
                    <div className="customerDetailsInfo" ref={detailsRef}>
                        <h2>{product?.companyName}</h2>
                        <div className="productImage" style={{backgroundImage : `url(${product?.images[0]})`}}></div>
                        <div className="customerName group">
                            <p>Name: {product?.name}</p>
                            <p className='customerDetail'><span>Units: </span>{product?.units}</p>
                            <p className='customerDetail'><span>Selling Price: </span>{product?.sellingPrice}</p>
                            <p className='customerDetail'><span>Cost Price: </span>{product?.costPrice}</p>
                        </div>

                        <div className="contactInfos group">
                            <h3 className='customerDetail'><u>Other Info</u></h3>
                            <p className='customerDetail'><span>Product ID:</span>{product?.id}</p>
                            <p className='customerDetail'><span>Product Number:</span>{product?.number}</p>
                            <br />
                            <p className='customerDetail'><span>Description: </span>{product?.description}</p>
                        </div>
                    </div>

                    <div className="customerBalancesContt">
                        <div className="customerBalancesCont">
                            <div className="customerBalance">
                                <p className='title'>Opening Stock</p>
                                <p style={{display : 'flex', justifyContent : 'space-evenly', gap : '1rem'}}><span>Qty: </span><span> {Number(product?.stockSummary?.openingStock?.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                <p style={{display : 'flex', justifyContent : 'space-evenly', gap : '1rem'}}><span>Amount: </span><span> {Number(product?.stockSummary?.openingStock?.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                            </div>
                            <div className="customerBalance">
                                <p className='title'>Closing Stock</p>
                                <p style={{display : 'flex', justifyContent : 'space-evenly', gap : '1rem'}}><span>Qty: </span><span> {Number(product?.stockSummary?.closingStock?.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                <p style={{display : 'flex', justifyContent : 'space-evenly', gap : '1rem'}}><span>Amount: </span><span> {Number(product?.stockSummary?.closingStock?.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
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
                                    <h3 className='custInvoiceHeading'>Recent Purchase Invoices</h3>
                                    {
                                        purchaseInvoices?.length > 0 ? purchaseInvoices?.slice(-3)?.map(invoice => (
                                            <div className="custInvoiceItem" onClick={()=>{
                                                history.push(`/purchase-invoices/${invoice?._id}`)
                                            }}>
                                                <p className="invoiceNumber">
                                                    Note # {invoice?.input?.number}
                                                </p>
                                                <div className="invoiceDueDate">
                                                    <span>Date</span><span>{new Date(invoice?.input?.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="totalDe">
                                                    <p className="debtTitle">
                                                        Net Amount
                                                    </p>
                                                    <p className="debtValue">
                                                        {Number(invoice?.netPayable).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : <div className="noInvoice">
                                            No invoice <Link to='/purchase-invoice/new-purchase-invoice' className='addNewInvoice'>Add invoice</Link>
                                        </div>
                                    }
                                </div>

                                <div className="customerInvoices">
                                    <h3 className='custInvoiceHeading'>Recent Purchase Receipts</h3>
                                    {
                                        purchaseReceipts?.length > 0 ? purchaseReceipts?.slice(-3)?.map(receipt => (
                                            <div className="custInvoiceItem" onClick={()=>{
                                                history.push(`/purchase-receipts/${receipt?._id}`)
                                            }}>
                                                <p className="invoiceNumber">
                                                    Rcp # {receipt?.input?.number}
                                                </p>
                                                <div className="invoiceDueDate">
                                                    <p>Date</p>
                                                    <p>{new Date(receipt?.input?.date).toLocaleDateString()}</p>
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
                                            No receipts <Link to='/purchase-receipt/new-purchase-receipt' className='addNewInvoice'>Add receipt</Link>
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
                            query.view_purchase_invoices && (
                                purchaseInvoices?.length > 0 ? <table className="allDebtorsTable">
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
                                        purchaseInvoices?.map(invoice => (
                                            <tr className="invoiceListbody invoiceDetail" onClick={()=>{
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
                            query.view_purchase_receipts && (
                                purchaseReceipts?.length > 0 ? <table className="allDebtorsTable">
                                <thead>
                                    <tr className='customersHeading'>
                                        <th>Receipt Number</th>
                                        <th>Date</th>
                                        <th>Net Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        purchaseReceipts?.map(receipt => (
                                            <tr className="invoiceListbody invoiceDetail" onClick={()=>{
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
                            </table> : <p className="noInvoice">No Data to Display <Link to='/purchase-recipt/new-purchase-receipt' className='addNewInvoice'>Add new receipt</Link></p>
                            )
                        }
                        </div>
                    </div>
                </div>



            {
                fetching && <Loader />
            }

            {
                deleteBox && <DeleteBox
                    handleDelete={handleDelete}
                    onClick={showDeleteBox}
                    message='Confirm delete of this product? This might cause irregularities in reports.'
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

export default InventoryPage
