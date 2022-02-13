 import React, { useContext } from 'react'
import useFetch from '../customHooks/useFetch'
import './InvoiceTemplate.css'
import {UserContext} from '../customHooks/userContext'

function InvoiceTemplate({data, products}) {
    const {user} = useContext(UserContext)

    const {data:customerData} = useFetch('customers', {})
    
    const customers = customerData?.customers

    const totalDiscounts = data?.products?.map(item => Number(item?.discount?.amount) || 0).reduce((a, b) => a + b, 0)

    const totalVAT = data?.products?.map(item => Number(item?.vat?.amount) || 0).reduce((a, b) => a + b, 0)

    const netPay = data?.products?.map(item => Number(item?.netValueTI)).reduce((a, b) => a + b, 0)


            
    return (
        <div className='InvoiceTemplate' id='invoiceTemplate'>
            <div className="invoiceContainer" id='invoiceContainer'>
                <div className="invoiceTop">
                    <div className="logoSection">
                    <div className="logo" style={{backgroundImage: `url(${user?.logoURL})`}}>
                        
                    </div>
                    <div className="companyDetails">
                        <h4>{user?.userName}</h4>
                        <p>{user?.address}</p>
                        <p>{user?.userEmail}</p>
                    </div>
                    </div>

                    <div className="invoiceDetailsSection">
                    <h4>Number: {data?.input?.number}</h4>
                    <p>Date: {new Date(data.input?.date).toLocaleDateString()}</p>
                    <p>Due Date: {new Date(data.input?.dueDate).toLocaleDateString()}</p>
                    <p>Due In: {data?.input?.selectInvoiceTerm} days</p>
                    </div>
                </div>

                <div className="customerDetails">
                    <div>
                    <div className="heading">
                        <h3>Bill To:</h3>
                    </div>
                    <div className="addressInfos">
                        <p><b>Customer Name:</b> {customers?.filter(item => item._id === data?.customer?._id && item.id === data?.customer?.id && item?.number === data?.customer?.number).map(item => item?.displayName)}</p>
                        <p><b>Email:</b> {customers?.filter(item => item._id === data?.customer?._id && item.id === data?.customer?.id && item?.number === data?.customer?.number).map(item => item?.email)}</p>
                        <p><b>Country:</b> {customers?.filter(item => item._id === data?.customer?._id && item.id === data?.customer?.id && item?.number === data?.customer?.number).map(item => item?.billingAddress?.country)}</p>
                        <p><b>City:</b> {customers?.filter(item => item._id === data?.customer?._id && item.id === data?.customer?.id && item?.number === data?.customer?.number).map(item => item?.billingAddress?.city)}</p>
                        <p><b>P.O Box:</b> {customers?.filter(item => item._id === data?.customer?._id && item.id === data?.customer?.id && item?.number === data?.customer?.number).map(item => item?.billingAddress?.fax)}</p>
                    </div>
                    </div>
                    <div></div>
                </div>

                <table className="itemsBought">
                    <thead>
                        <tr className="itemHeading">
                            <th>Elements</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Discount</th>
                            <th>VAT</th>
                            <th className='invoiceDetailAmount'>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        data?.products?.map(item => ( 
                            <tr className="item" key={item._id}>
                                <td> {products?.filter(product => product._id === item._id && product.id === item.id && product.number === item.number).map(product => product?.name)} </td>
                                <td> {Number(item?.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                <td>{(Number(item?.up)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td>{Number(item?.discount?.amount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td>{Number(item?.vat?.amount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='invoiceDetailAmount'>{((Number(item?.qty) * Number(item.up)) - Number(item.discount?.amount || 0) + Number(item?.vat?.amount || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                        ))
                    }
                        <tr class="item">
                            <td> <b>Total</b> </td>
                            <td> <b>-</b> </td>
                            <td><b>-</b></td>
                            <td><b>{Number(totalDiscounts)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            <td><b>{Number(totalVAT)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            <td className='invoiceDetailAmount'><b>{Number(netPay)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                        </tr>

                        {data?.otherCharges?.length > 0 &&
                            <tr>
                                <td></td>
                                <td> <b>Other Charges</b> </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className='invoiceDetailAmount'></td>
                            </tr>
                        }

                        {
                            data?.otherCharges?.map(charge => (
                                <tr>
                                    <td></td>
                                    <td style={{textTransform : 'capitalize'}}> {charge?.name} </td>
                                    <td></td>
                                    <td></td>
                                    <td>{Number(charge?.amount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td className='invoiceDetailAmount'></td>
                                </tr>
                            ))
                        }

                        {data?.otherCharges?.length > 0 &&
                            <tr>
                                <td></td>
                                <td> <b>Total</b> </td>
                                <td></td>
                                <td></td>
                                <td><b>{(data?.otherCharges?.map(charge => Number(charge.amount)).reduce((a, b) => a + b, 0))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                                <td className='invoiceDetailAmount'></td>
                            </tr>
                        }
                        
                    </tbody>
                </table>

                

                <div className="netPayable">
                    <div className="element">
                    <b>Net Payable</b>
                    </div>
                    <div className="value" style={{marginRight: '2rem'}}>
                    <b>{(Number(data.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                    </div>
                </div>

                <p className="signature">
                    <b>Sign.........</b><br />
                    Sales Manager
                </p>
            </div>
        </div>
    )
}

export default InvoiceTemplate
