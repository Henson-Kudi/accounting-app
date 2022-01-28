import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import './Reports.css'

function Reports() {



    return (
        <div className='Reports Invoices'>
            <div className="salesReports reportGroup">
                <p className='reportGroupHeading'>Sales Reports</p>
                <ul className='reportLinks'>
                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/sales-by-product'>Sales by Product</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/sales-by-customer'>Sales by Customer</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/sales-returns-report'>Sales Returns</Link></li>

                </ul>
            </div>

            <div className="inventoryReports reportGroup">
                <p className='reportGroupHeading'>Inventory Reports</p>
                <ul className='reportLinks'>
                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/inventory-summary'>Inventory Summary</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/sales-by-product'>Product Sales Report</Link></li>
                    
                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/stock-summary-report'>Stock Summary Report</Link></li>

                </ul>
            </div>

            <div className="debtorsReports reportGroup">
                <p className='reportGroupHeading'>Debtors Report</p>
                <ul className='reportLinks'>
                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/customer-balances'>Customer Balances</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/unpaid-invoices'>Unpaid Invoices</Link></li>

                </ul>
            </div>

            <div className="creditorsReports reportGroup">
                <p className='reportGroupHeading'>Creditors Report</p>
                <ul className='reportLinks'>
                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/supplier-balances'>Supplier Balances</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/unpaid-supplier-invoices'>Unpaid Purchase Invoices</Link></li>

                </ul>
            </div>

            <div className="customerPayments reportGroup">
                <p className='reportGroupHeading'>Payment Reports</p>
                <ul className='reportLinks'>
                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/customer-payments'>Customer Payments</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/supplier-payments'>Supplier Payments</Link></li>

                </ul>
            </div>

            <div className="purchasesAndExpensesReports reportGroup">
                <p className='reportGroupHeading'>Purchases and Other Expenses Reports</p>
                <ul className='reportLinks'>
                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/purchases-by-product'>Purchases by product</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/purchases-by-supplier'>Purchases by supplier</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/other-expenses-summary'>Other Expenses Details</Link></li>

                </ul>
            </div>

            <div className="financialStatementReports reportGroup">
                <p className='reportGroupHeading'>End of Year Reports</p>
                <ul className='reportLinks'>
                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/income-statement'>Income Statement</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink' to='/reports/balance-sheet'>Balance Sheet</Link></li>

                    <li className='reportLinkCont'><Link className='reportLink'>Cashflow Statement</Link></li>

                </ul>
            </div>
        </div>
    )
}

export default Reports
