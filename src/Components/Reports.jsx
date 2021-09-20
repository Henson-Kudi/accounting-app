import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {baseURL} from './axios'
import Loader from './Loader'
import './Reports.css'
import {UserContext} from './userContext'

function Reports() {
    const [fetching, setFetching] = useState(true)
    const [incomeStatement, setIncomeStatement] = useState(true)
    const [data, setData] = useState([])
    const {user} = useContext(UserContext)

    const fetchData = async(unMounted, source)=>{
                await baseURL.get('/', {
                cancelToken: source.token,
                headers:{
                    'auth-token': user?.token,
                }
            })
            .then(res => {
                setData(res.data)
                setFetching(false)
            })
            .catch(err => {
                if (!unMounted) {
                    if (axios.isCancel(err)) {
                        console.log('Request Cancelled');
                    } else {
                        console.log('Something went wrong');
                    }
                }
            })
        }

    useEffect(()=>{
        let unMounted = false;
        let source = axios.CancelToken.source();
        fetchData(unMounted, source)
    return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const sales = data.sales?.filter(item => item.saleType !== 'sales returns').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const salesReturns = data.sales?.filter(item => item.saleType === 'sales returns').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0).toFixed(2) || 0
    const purchases = data.purchases?.filter(item => item.purchaseType !== 'purchase returns').map(item => item.amount).reduce((a, b) => a + b, 0) || 0
    const purchaseReturns = data.purchases?.filter(item => item.purchaseType === 'purchase returns').map(item => item.netPayable).reduce((a, b) => a + b, 0) || 0
    const purchaseExpenses = data.purchaseExpenses?.map(item => item.value).reduce((a, b) => a + b, 0) || 0

    const inventoryEnteries = (data.inventory?.filter(item => item.exitOrEntry === 'entry').map(item => item.amount).reduce((a, b) => a + b, 0)) || 0
    const inventoryExits = data.inventory?.filter(item => item.exitOrEntry === 'exit').map(item => item.amount).reduce((a, b) => a + b, 0) || 0
    const closingStock = inventoryEnteries - inventoryExits || 0
    const costOfSales = purchases + purchaseExpenses - purchaseReturns - closingStock || 0
    const netSales = sales - salesReturns || 0

    const discountsReceived = data.discounts?.filter(item => item.typeOfDiscount === 'received')
    let rebatesReceived = []
    let cashDiscountsReceived = []
    let tradeDiscountsReceived = []

    discountsReceived?.forEach(element => {
        if (element.tradeDiscount !== 0 || element.tradeDiscount !== '0.00') {
            tradeDiscountsReceived.push(element.tradeDiscount)
        }

        if (element.cashDiscount !== 0 || element.cashDiscount !== '0.00') {
            cashDiscountsReceived.push(element.cashDiscount)
        }

        if (element.rebate !== 0 || element.rebate !== '0.00') {
            rebatesReceived.push(element.rebate)
        }
    })

    const totalDiscountsAllowed = data.discounts?.filter(item => item.typeOfDiscount === 'allowed').map(item => (item.rebate + item.cashDiscount + item.tradeDiscount)).reduce((acc, item) => acc + item, 0)


    const totalOtherIncome = data.otherIncome?.map(item => item.value).reduce((a, b) => a + b, 0) || 0

    const totalDiscountsReceived = discountsReceived?.map(item => Number(item.rebate) + Number(item.cashDiscount) + Number(item.tradeDiscount)).reduce((a, b) => a + b, 0) || 0



    const expenses = data.expenses
    const totalExp = (data.expenses?.map(exp => exp.amount).reduce((a, b) => a + b, 0)) + totalDiscountsAllowed || 0

    const today = new Date()
    const thisYear = today.getFullYear()
    const fixedAssetsDep = data.fixedAssets

    let depInfos = []
    fixedAssetsDep?.forEach(asset => {
        const element = asset.depInfos

        element.forEach(item => {
            item.assetName = asset.asset.assetName
            item.cost = asset.asset.cost
            if (item.year === thisYear) {
                depInfos.push(item)
            }
        })
    })

    

    const totalFixedAssetCost = (depInfos.map(item => item.cost).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2) || 0
    const totalNBV = (depInfos.map(item => item.nbv).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2) || 0

    const totalDep = (depInfos.map(item => item.endOfYearDep).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2) || 0
    const grossProfit = netSales - costOfSales || 0

    const netResult = grossProfit + totalOtherIncome + totalDiscountsReceived - totalExp - totalDep || 0
    const ebdit = grossProfit + totalOtherIncome + totalDiscountsReceived - totalExp
    const interestPaid = data?.longtermLiabilities?.map(item => item.totalInterestpaid).reduce((a, b) => Number(a) + Number(b), 0).toFixed(2) || 0

    const totalAmortizationPaid = data?.longtermLiabilities?.map(item => item.totalAmortizationPaid).reduce((a, b) => Number(a) + Number(b), 0).toFixed(2) || 0

    const totalDebtors = data?.debtors?.map(item => item.balanceDue).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const totalCreditors = data?.suppliers?.map(item => item.balanceDue).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const cashIn = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'cash').filter(item => item.inOrOut === 'in').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const cashOut = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'cash').filter(item => item.inOrOut === 'out').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const cash = Number(cashIn) - Number(cashOut)

    const bankIn = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'bank').filter(item => item.inOrOut === 'in').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const bankOut = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'bank').filter(item => item.inOrOut === 'out').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const bank = Number(bankIn) - Number(bankOut)

    const mobileMoneyIn = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'mobileMoney').filter(item => item.inOrOut === 'in').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const mobileMoneyOut = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'mobileMoney').filter(item => item.inOrOut === 'out').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const mobileMoney = Number(mobileMoneyIn) - Number(mobileMoneyOut)

    const totalCapital = data?.capital?.map(item => item.totalContribution).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const totalLongtermLiab = data?.longtermLiabilities?.map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const longtermLiabilities = data?.longtermLiabilities

    const vatInvoiced = data.vat?.filter(item => item.vatType === 'invoiced').map(item => item.value).reduce((a, b) => Number(a) + Number(b), 0)

    const vatRecoverable = data.vat?.filter(item => item.vatType === 'recoverable').map(item => item.value).reduce((a, b) => Number(a) + Number(b), 0)

    const netVat = Number(vatInvoiced) - Number(vatRecoverable)


    return (
        <div className='Reports'>
        {
            !fetching &&
            <>
            <div className="salesTop">
                {/* <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                </div> */}
                

                {/* <div className="salesOptionsRight">
                    <button className='button' onClick={() => {
                        window.print()
                    }}>Print Page</button>
                </div> */}
            </div>
            <div className="selectView">
                <button className="btn" onClick={()=>{setIncomeStatement(!incomeStatement)}}>{incomeStatement ? 'View Balance Sheet' : 'View Income Statement'}</button>
                <div></div>
            </div>

            {
                incomeStatement &&
                <div className="incomeStatement">
                    <h2>Income Statement (Reflecting end of financial year {thisYear})</h2>

                    <table>
                        <thead>
                            <tr>
                                <th className='element firstElement'>Elements</th>
                                <th className='element'>Calculations</th>
                                <th className='element'>Amounts</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='element firstElement'>Sales</td>
                                <td className='element'></td>
                                <td className='element'>{sales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Sales Returns</td>
                                <td className='element'></td>
                                <td className='element'><u>({salesReturns.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Net Sales</b></td>
                                <td className='element'></td>
                                <td className='element'><b>{netSales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Cost Of Sales</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Opening Stock</td>
                                <td className='element'>{0}</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Purchases</td>
                                <td className='element'>{purchases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Purchase Expenses</td>
                                <td className='element'>{purchaseExpenses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Purchase Returns</td>
                                <td className='element'>({purchaseReturns.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Closing Stock</td>
                                <td className='element'><u>({(Number(closingStock).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Cost of Sales</b></td>
                                <td className='element'></td>
                                <td className='element'><u>({(Number(costOfSales).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Gross Profit</b></td>
                                <td className='element'></td>
                                <td className='element'><b>{(Number(grossProfit).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Other Income</b></td>
                                <td className='element'></td>
                                <td className='element'><u></u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Rebates Received</td>
                                <td className='element'>{(rebatesReceived?.reduce((a, b) => a + b, 0).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'><u></u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Trade Discounts Received</td>
                                <td className='element'>{(tradeDiscountsReceived?.reduce((a, b) => a + b, 0).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'><u></u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Cash Discounts Received</td>
                                <td className='element'>{(cashDiscountsReceived?.reduce((a, b) => a + b, 0).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'><u></u></td>
                            </tr>
                            {
                                data.otherIncome?.map((item, i)=> (
                                    <tr key={item._id}>
                                        <td className='element firstElement'>{item.name}</td>
                                        <td className='element'>{data.otherIncome.length - 1 === i ? <u>{((Number(item.value)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u> : ((Number(item.value)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }</td>
                                        <td className='element'><u></u></td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td className='element firstElement'><b>Total Other Income</b></td>
                                <td className='element'><u>{((Number(totalOtherIncome) + Number(totalDiscountsReceived)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                                <td className='element'><u>{((Number(totalOtherIncome) + Number(totalDiscountsReceived)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b></b></td>
                                <td className='element'></td>
                                <td className='element'>{((Number(totalOtherIncome) + Number(totalDiscountsReceived) + Number(grossProfit)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Expenses</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Discounts Allowed</td>
                                <td className='element'>{(Number(totalDiscountsAllowed).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'></td>
                            </tr>
                            {
                                expenses?.map((expense, index) => (
                                    <tr key={expense._id}>
                                        <td className='element firstElement'>{expense.expName}</td>
                                        <td className='element'>{index === expenses.length-1 ? <u>{expense.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u> : expense.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='element'></td>
                                    </tr>
                                ))
                            }
                            
                            <tr>
                                <td className='element firstElement'><b>Total Expenses</b></td>
                                <td className='element'></td>
                                <td className='element'>(<u>{(Number(totalExp).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u>)</td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Earnings Before Depreciation, Interest And Taxes</b></td>
                                <td className='element'></td>
                                <td className='element'>{(Number(ebdit).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Depreciation</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                            </tr>
                            
                            {
                                depInfos?.map((item, i) => (
                                    <tr key={item._id}>
                                        <td className='element firstElement'>{item.assetName}</td>
                                        <td className='element'>{i === depInfos.length-1 ? <u>{(item.accDep.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u> : (item.accDep.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='element'></td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td className='element firstElement'>Total Depreciation</td>
                                <td className='element'></td>
                                <td className='element'>(<u>{(Number(totalDep).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u>)</td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Earnings Before Interest And Taxes</b></td>
                                <td className='element'></td>
                                <td className='element'>{(Number(netResult).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Total Interest</td>
                                <td className='element'>
                                    <u>
                                        {(Number(interestPaid)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </u>
                                </td>
                                <td className='element'>({(Number(interestPaid)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Earnings Before Taxes</b></td>
                                <td className='element'></td>
                                <td className='element'><b>
                                    {((Number(netResult) - Number(interestPaid)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </b></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }

            {
                !incomeStatement &&
                <div className="balanceSheet incomeStatement">
                    <h2>Balance Sheet as at Dec. {thisYear}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th className='element firstElement'>Elements</th>
                                <th className='element'></th>
                                <th className='element'>Calculations</th>
                                <th className='element'>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='element firstElement'><b>Fixed Assets</b></td>
                                <td className='element'><b>Cost</b></td>
                                <td className='element'><b>Acc Dep</b></td>
                                <td className='element'><b>Net Book Value</b></td>
                            </tr>
                            {
                                depInfos.map((item, index) => (
                                    <tr key
                                    ={item._id}>
                                        <td className='element firstElement'>{item.assetName}</td>
                                        <td className='element'>{index === depInfos.length-1 ? <u>{(item.cost.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u> : (item.cost.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='element'>{index === depInfos.length-1 ? <u>{(item.accDep.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u> : (item.accDep.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='element'>{index === depInfos.length-1 ? <u>{(item.nbv.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u> : (item.nbv.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td className='element firstElement'><b>Total Fixed Assets</b></td>
                                <td className='element'><b><u>{(Number(totalFixedAssetCost).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></b></td>
                                <td className='element'><b><u>{(Number(totalDep).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></b></td>
                                <td className='element'><b>{(Number(totalNBV).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Current Assets</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Debtors</td>
                                <td className='element'></td>
                                <td className='element'>{totalDebtors.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Closing Inventory</td>
                                <td className='element'></td>
                                <td className='element'>{(Number(closingStock).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Cash</td>
                                <td className='element'></td>
                                <td className='element'>{cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>bank</td>
                                <td className='element'></td>
                                <td className='element'>{bank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Mobile Money</td>
                                <td className='element'></td>
                                <td className='element'>{mobileMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Total Current Assets</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><u>{((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Total Assets</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b>{((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors) + Number(totalNBV)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Current Liabilities</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>VAT to be paid</td>
                                <td className='element'></td>
                                <td className='element'><u>{(Number(netVat).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'>Creditors</td>
                                <td className='element'></td>
                                <td className='element'><u>{(Number(totalCreditors).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Total Current Liabilities</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b><u>({((Number(totalCreditors) + Number(netVat)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Longterm Liabilities</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'></td>
                            </tr>
                            {
                                longtermLiabilities?.map((item, i) => (
                                    <tr key={item._id}>
                                        <td className='element firstElement'>{`${item.liabilityName}, ${item.name}`}</td>
                                        <td className='element'></td>
                                        <td className='element'>{i === longtermLiabilities.length-1 ? <u>{((Number(item.amount) - Number(item.totalAmortizationPaid)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u> : ((Number(item.amount) - Number(item.totalAmortizationPaid)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='element'></td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td className='element firstElement'><b>Total Longterm Liabilities</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b>(<u>{(totalLongtermLiab - totalAmortizationPaid).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u>)</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Net Assets</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b>{(((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors) + Number(totalNBV)) - Number(totalCreditors) - Number(netVat) - Number(totalLongtermLiab) - Number(totalAmortizationPaid)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Equity</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'></td>
                            </tr>
                            {
                                data?.capital?.map((item, i) => (
                                <tr key={item._id}>
                                    <td className='element firstElement'>{item.name}</td>
                                    <td className='element'></td>
                                    <td className='element'>{((item.totalContribution).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td className='element'></td>
                                </tr>
                                ))
                            }
                            <tr>
                                <td className='element firstElement'>Earnings Before Taxes</td>
                                <td className='element'></td>
                                <td className='element'><u>{((Number(ebdit) - Number(totalDep) - Number(interestPaid)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Total Equity</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b>{((Number(totalCapital) + (Number(ebdit) - Number(totalDep))).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }
            </>
        }

            {
                fetching &&
                <Loader/>
            }
        </div>
    )
}

export default Reports
