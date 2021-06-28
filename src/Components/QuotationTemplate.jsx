import React from 'react'
import './InvoiceTemplate.css'

function QuotationTemplate({data}) {


            
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
                    <h4>Receipt Number: {data?.quoteInput.quoteNumber}</h4>
                    <p>Date: {data.quoteInput.date}</p>
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

                <p className="signature">
                    <b>Sign.........</b><br />
                    Sales Manager
                </p>
                </div>
        </div>
    )
}

export default QuotationTemplate
