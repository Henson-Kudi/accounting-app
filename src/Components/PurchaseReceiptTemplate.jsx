import React, { useContext } from 'react'
import useFetch from '../customHooks/useFetch'
import './InvoiceTemplate.css'
import {UserContext} from '../customHooks/userContext'

function PurchaseReceiptTemplate({data, suppliers}) {
    const {user} = useContext(UserContext)
    const {data:products} = useFetch('products', [])
    
    const totalDiscounts = data?.products?.map(item => Number(item?.discount?.amount) || 0).reduce((a, b) => a + b, 0)

    const totalVAT = data?.products?.map(item => Number(item?.vat?.amount) || 0).reduce((a, b) => a + b, 0)

    const netPay = data?.products?.map(item => Number(item?.netValueTI)).reduce((a, b) => a + b, 0)


            
    return (
        <div className='ReceiptTemplate' id='ReceiptTemplate'>
            <div className="invoiceContainer" id='invoiceContainer'>
                <div className="invoiceTop">
                    <div className="logoSection">
                    <div className="logo" style={{backgroundImage: `url(${user?.logoURL})`}}></div>
                    <div className="companyDetails">
                        <h4>@HK Solutions Ltd</h4>
                        <p>al salam street Abu Dhabi, UAE</p>
                        <p>amahkudi@gmail.com</p>
                    </div>
                    </div>

                    <div className="invoiceDetailsSection">
                    <h4>Receipt Number: {data?.input?.number}</h4>
                    <p>Date: {new Date(data.input?.date).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="customerDetails">
                    <div>
                    <div className="heading">
                        <h3>Bill From:</h3>
                    </div>
                    {
                        suppliers?.filter(sup => sup._id === data?.supplier?._id && sup.id === data?.supplier?.id && sup.number === data?.supplier?.number).map(sup => (
                            <div className="addressInfos">
                                <p><b>Supplier Name:</b> {sup.displayName}</p>
                                <p><b>Email:</b> {sup?.email}</p>
                                <p><b>Country:</b> {sup?.billingAddress?.country}</p>
                                <p><b>City:</b> {sup?.billingAddress?.city}</p>
                                <p><b>Fax:</b> {sup?.billingAddress?.fax}</p>
                            </div>
                        ))
                    }
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
                                <td className='invoiceDetailAmount'></td>
                                <td><b>{(data?.otherCharges?.map(charge => Number(charge.amount)).reduce((a, b) => a + b, 0))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                        }

                        <tr>
                            <td><b>Net</b> </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className='invoiceDetailAmount'></td>
                            <td><b>{(Number(data.netPayable)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                        </tr>

                        <tr>
                            <td> </td>
                            <td><b>Payments</b></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className='invoiceDetailAmount'></td>
                        </tr>

                        <tr>
                            <td> </td>
                            <td>Cash</td>
                            <td></td>
                            <td></td>
                            <td>{Number(data?.input?.payments?.cash) > 0 ? (data?.input?.payments?.cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) : '-'}</td>
                            <td className='invoiceDetailAmount'></td>
                        </tr>

                        <tr>
                            <td> </td>
                            <td>Bank</td>
                            <td></td>
                            <td></td>
                            <td>{Number(data?.input?.payments?.bank) > 0 ? (data?.input?.payments?.bank)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-'}</td>
                            <td className='invoiceDetailAmount'></td>
                        </tr>

                        <tr>
                            <td> </td>
                            <td>Mobile Money</td>
                            <td></td>
                            <td></td>
                            <td>{Number(data?.input?.payments?.mobileMoney) > 0 ? (data?.input?.payments?.mobileMoney)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-'}</td>
                            <td className='invoiceDetailAmount'></td>
                        </tr>

                        <tr>
                            <td> </td>
                            <td><b>Total</b></td>
                            <td></td>
                            <td></td>
                            <td><b><u>{(Number(data?.input?.payments?.cash || 0) + Number(data?.input?.payments?.bank || 0) + Number(data?.input?.payments?.mobileMoney || 0))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</u></b></td>
                            <td className='invoiceDetailAmount'><b><u>({(Number(data?.input?.payments?.cash || 0) + Number(data?.input?.payments?.bank || 0) + Number(data?.input?.payments?.mobileMoney || 0))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></b></td>
                        </tr>

                        <tr>
                            <td><b>Net Payable</b> </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className='invoiceDetailAmount'></td>
                            <td><b>{
                                Number(data.netPayable) - Number(data?.input?.payments?.cash || 0) - Number(data?.input?.payments?.bank || 0) - Number(data?.input?.payments?.mobileMoney || 0)
                            }</b></td>
                        </tr>
                        
                    </tbody>
                </table>

                <p className="signature">
                    <b>Sign.........</b><br />
                    Sales Manager
                </p>
                </div>
        </div>
    )
}

export default PurchaseReceiptTemplate
