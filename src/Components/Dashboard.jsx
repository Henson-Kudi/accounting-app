import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {baserURL, baseURL} from './axios'
import Loader from './Loader'
import './Dashboard.css'

function Dashboard() {
    const [fetching, setFetching] = useState(true)
    const [incomeStatement, setIncomeStatement] = useState(true)
    const [data, setData] = useState([])

    const fetchData = async(unMounted, source)=>{
                await baseURL.get('/', {
                cancelToken: source.token
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

    const sales = data?.sales?.map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const salesReturns = data.salesReturns?.map(item => item.netPayable).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const purchases = data.purchases?.map(item => item.amount).reduce((a, b) => a + b, 0) || 0
    const purchaseReturns = data.purchaseReturns?.map(item => item.netPayable).reduce((a, b) => a + b, 0) || 0

    const inventoryEnteries = (data.inventory?.filter(item => item.exitOrEntry === 'entry').map(item => item.amount).reduce((a, b) => a + b, 0)) || 0
    const inventoryExits = data.inventory?.filter(item => item.exitOrEntry === 'exit').map(item => item.amount).reduce((a, b) => a + b, 0) || 0
    const closingStock = inventoryEnteries - inventoryExits || 0
    const costOfSales = purchases - purchaseReturns - closingStock || 0
    const netSales = sales - salesReturns || 0

    const expenses = data.expenses
    const totalExp = (data.expenses?.map(exp => exp.amount).reduce((a, b) => a + b, 0)) || 0

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

    const netResult = grossProfit - totalExp - totalDep || 0
    const ebdit = grossProfit - totalExp

    const totalDebtors = data?.debtors?.map(item => item.balanceDue).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const totalCreditors = data?.suppliers?.map(item => item.balanceDue).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const cash = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'cash').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const bank = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'bank').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const mobileMoney = data?.meansOfPayment?.filter(item => item.meansOfPayment === 'mobileMoney').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const totalCapital = data?.capital?.map(item => item.totalContribution).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const totalLongtermLiab = data?.longtermLiabilities?.map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0
    const longtermLiabilities = data?.longtermLiabilities

    console.log(data);


    return (
        <div className='Dashboard'>
        {
            !fetching &&
            <>
            <div className="salesTop">
                <div className='salesOptionsLeft'>
                    <Link to='/' className='button'>Home</Link>
                </div>
                

                <div className="salesOptionsRight">
                    <button className='button' onClick={() => {
                        window.print()
                    }}>Print Page</button>
                </div>
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
                                <td className='element firstElement'>Other Income</td>
                                <td className='element'></td>
                                <td className='element'><u>0</u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Expenses</b></td>
                                <td className='element'></td>
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
                                <th className='element firstElement'><b>Earnings Before Interest And Taxes</b></th>
                                <th className='element'></th>
                                <th className='element'>{(Number(netResult).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</th>
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
                                    <tr>
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
                                <td className='element'>{closingStock.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
                                <td className='element'><u>{(Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Total Assets</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b>{(Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors) + Number(totalNBV)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Current Liabilities</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
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
                                <td className='element'><b><u>({(Number(totalCreditors).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></b></td>
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
                                        <td className='element firstElement'>{item.liabilityName}</td>
                                        <td className='element'></td>
                                        <td className='element'>{i === longtermLiabilities.length-1 ? <u>{(Number(item.amount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u> : (Number(item.amount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='element'></td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td className='element firstElement'><b>Total Longterm Liabilities</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b>(<u>{totalLongtermLiab.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u>)</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Net Assets</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b>{(((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors) + Number(totalNBV)) - Number(totalCreditors) - Number(totalLongtermLiab)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Equity</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'></td>
                            </tr>
                            {
                                data?.capital?.map((item, i) => (
                                    <tr>
                                <td className='element firstElement'>{item.name}</td>
                                    <td className='element'></td>
                                    <td className='element'>{((item.totalContribution).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td className='element'></td>
                                </tr>
                                ))
                            }
                            <tr>
                                <td className='element firstElement'>Earnings Before Interests and Taxes</td>
                                <td className='element'></td>
                                <td className='element'><u>{(Number(ebdit) - Number(totalDep)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                                <td className='element'></td>
                            </tr>
                            <tr>
                                <td className='element firstElement'><b>Total Equity</b></td>
                                <td className='element'></td>
                                <td className='element'></td>
                                <td className='element'><b>{(Number(totalCapital) + (Number(ebdit) - Number(totalDep))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
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

export default Dashboard
