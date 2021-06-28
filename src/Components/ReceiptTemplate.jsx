import React from 'react'
import './InvoiceTemplate.css'

function ReceiptTemplate({data}) {
    const totalOtherAdditions = data.otherAdditions?.filter(item => ( item.name !== '' )).map(item => item.amount).reduce((a, b) => ( Number(a) + Number(b) ), 0)

    const totalDiscounts = (Number(data.discountsAndVat?.rebateValue) + Number(data.discountsAndVat?.tradeDiscountValue) + Number(data.discountsAndVat?.cashDiscountValue)).toFixed(2)


            
    return (
        <div className='ReceiptTemplate' id='ReceiptTemplate'>
            <div className="invoiceContainer" id='invoiceContainer'>
                <div className="invoiceTop">
                    <div className="logoSection">
                    <div className="logo"></div>
                    <div className="companyDetails">
                        <h4>@HK Solutions Ltd</h4>
                        <p>al salam street Abu Dhabi, UAE</p>
                        <p>amahkudi@gmail.com</p>
                    </div>
                    </div>

                    <div className="invoiceDetailsSection">
                    <h4>Receipt Number: {data?.receiptInput.receiptNumber}</h4>
                    <p>Date: {data.receiptInput.date}</p>
                    </div>
                </div>

                <div className="customerDetails">
                    <div>
                    <div className="heading">
                        <h3>Bill To:</h3>
                    </div>
                    <div className="addressInfos">
                        <p><b>Customer Name:</b> {data.customerDetails?.name}</p>
                        <p><b>Email:</b> {data.customerDetails?.email}</p>
                        <p><b>Country:</b> {data.customerDetails.billingAddress?.country}</p>
                        <p><b>City:</b> {data.customerDetails.billingAddress?.city}</p>
                        <p><b>P.O Box:</b> {data.customerDetails.contact?.fax}</p>
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
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        data.data?.filter(item => (
                            item.productName !== '' && item.qty !== '' && item.up !== ''
                        )).map(item => ( 
                            <tr className="item">
                                <td> {item.productName} </td>
                                <td> {Number(item.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </td>
                                <td>{(Number(item.up).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td>{((item.qty * item.up).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>

                <div className="discountsAndAdditions">
                    <div></div>
                    <div></div>
                    <div className="element">
                    <b>Gross Amount</b>
                    </div>
                    <div className="value">
                    <b>{(Number(data.grossAmount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                    </div>

                    <div></div>
                    <div></div>
                    <div className="element">
                    Total Discounts
                    </div>
                    <div className="value">
                    ({totalDiscounts.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
                    </div>

                    <div></div>
                    <div></div>
                    <div className="element">
                    <b> Financial Net</b>
                    </div>
                    <div className="value">
                    <b>{((Number(data.grossAmount) - totalDiscounts).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                    </div>

                    <div></div>
                    <div></div>
                    <div className="element">
                    VAT ({data.additionsAndSubtractions.valueAddedTax}%)
                    </div>
                    <div className="value">
                    {(Number(data.discountsAndVat.valueAddedTax).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>

                    <div></div>
                    <div></div>
                    <div className="element">Other Additions
                    </div>
                    <div className="value">{
                        totalOtherAdditions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }</div>
                        
                </div>

                <div className="netPayable">
                    <div className="element">
                    <b>Net Payable</b>
                    </div>
                    <div className="value" style={{marginRight: '2rem'}}>
                    <b>{(Number(data.netPayable).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
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

export default ReceiptTemplate
