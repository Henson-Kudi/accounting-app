import React, {useState, useEffect, useRef, useContext} from "react";
import {useHistory} from 'react-router-dom'
import axios from "axios";
import "./Dashboard.css";
import LineChart from "./LineChart";
import DoughnutChart from "./Doughnut";
import SingleBarChart from "./SingleBarChart";
import {baseURL} from "./axios"
import Loader from './Loader';
import { UserContext } from "./userContext";
import useFetch from "../customHooks/useFetch";

function Dashboard() {
  const {user} = useContext(UserContext)

  const history = useHistory()

  const today = new Date()

  const [fetching, setFetching] = useState(true)
    // const {data, setData} = useFetch('', {})

    const [data, setData] = useState([])

    const fetchData = async(unMounted, source)=>{
                await baseURL.get('/', {
                cancelToken: source.token,
                headers:{
                  'auth-token': user?.token
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
                        history.push('/login')
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

    const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",]

    const getMonthlyElements = (data, data2) =>{

      return months.map((month, monthIndex) => {

        const filtered = data?.filter(item => (new Date(item?.input?.date).getFullYear() === today.getFullYear() && new Date(item?.input?.date).getMonth() === monthIndex))

        const filtered2 = data2?.filter(item => (new Date(item?.input?.date).getFullYear() === today.getFullYear() && new Date(item?.input?.date).getMonth() === monthIndex))

        const netFiltered1 = filtered?.map(item => Number(item?.grossAmount))?.reduce((acc, item) => Number(acc) + Number(item), 0)

        const netFiltered2 = filtered2?.map(item => Number(item?.grossAmount))?.reduce((acc, item) => Number(acc) + Number(item), 0)

        return netFiltered1 - netFiltered2
      })
    }


    const concancatInvoicesAndReceipts = (data, data2) =>{
      return data?.filter(item => new Date(item?.input?.date).getFullYear() === today.getFullYear())?.concat(data2?.filter(receipt => new Date(receipt?.input?.date).getFullYear() === today.getFullYear()))
    }

    const salesData = concancatInvoicesAndReceipts(data?.salesInvoices, data?.salesReceipts)

    const monthlySales = getMonthlyElements(data?.salesInvoices, data?.salesReturns)
    

    const monthlyCOGS = months.map((month, monthIndex) => {
      const monthlyCOGS = data?.salesInvoices?.filter(item => (new Date(item?.input?.date).getFullYear() === today.getFullYear() && new Date(item?.input?.date).getMonth() === monthIndex)).map(item => Number(item.cogs)).reduce((a, b) => a + b, 0)

      const monthlyReturns = data?.salesReturns?.filter(item => (new Date(item?.input?.date).getFullYear() === today.getFullYear() && new Date(item?.input?.date).getMonth() === monthIndex)).map(item => Number(item.cogs)).reduce((a, b) => a + b, 0)

      return (monthlyCOGS - monthlyReturns)
    })

    const monthlyGP = months.map((mth, ind) => (monthlySales[ind] - monthlyCOGS[ind]))

    const getTotals = (data) =>{
      return data?.filter(item => new Date(item?.input?.date).getFullYear() === today.getFullYear())?.map(item => item.grossAmount)?.reduce((a, b) => a + b, 0)
    }

    const salesReturns = getTotals(data?.salesReturns)

    const sales = (salesData?.map(item => item.grossAmount).reduce((a, b) => a + b, 0)) - salesReturns

    const creditSales = getTotals(data?.salesInvoices)

    const purchaseReturns = getTotals(data?.purchaseReturns)

    const creditPurchases = getTotals(data?.purchaseInvoices)

    const closingStock = data.inventories?.map(item => item?.stockSummary?.closingStock?.amount).reduce((a, b) => a + b, 0)

    const costOfSales = ((salesData?.map(item => item?.cogs).reduce((a, b) => Number(a) + Number(b), 0)) - data?.salesReturns?.map(ret => ret?.cogs).reduce((a, b) => Number(a) + Number(b), 0)) - (purchaseReturns)

    const totalDiscountsAllowed = data.discounts?.filter(item => item.discountType === 'allowed' && new Date(item?.date).getFullYear() === today.getFullYear()).map(item => item?.amount).reduce((acc, item) => acc + item, 0)

    const totalDiscountsReceived = data.discounts?.filter(item => item.discountType === 'received' && new Date(item?.date).getFullYear() === today.getFullYear()).map(item => item?.amount).reduce((acc, item) => acc + item, 0)

    // after creating schema for other charges, make sure to update formula for other charges and other income

    const totalOtherIncome = (data?.otherIncomes?.filter(income => income.incomeType === 'other income' && new Date(income.date).getFullYear() === today.getFullYear())?.map(item => item.amount).reduce((a, b) => a + b, 0) || 0) + totalDiscountsReceived

    const totalOtherCharges = data?.otherIncomes?.filter(income => income.incomeType === 'other expense' && new Date(income.date).getFullYear() === today.getFullYear())?.map(item => item.amount).reduce((a, b) => a + b, 0) || 0

    const totalExp = (data.expenses?.filter(exp => new Date(exp.date).getFullYear() === today.getFullYear())?.map(exp => (Number(exp?.amount?.cash ?? 0) + Number(exp?.amount?.bank ?? 0) + Number(exp?.amount?.mobileMoney ?? 0))).reduce((a, b) => a + b, 0)) + totalDiscountsAllowed + totalOtherCharges || 0

    const grossProfit = (salesData?.map(data => Number(data?.grossProfit || 0)).reduce((a, b ) => a + b, 0)) - (data?.salesReturns?.map(item => Number(item?.grossProfit || 0))?.reduce((a, b) => a + b, 0)) || 0

    const netResult = grossProfit + totalOtherIncome - totalExp

    const totalNBV = 0

    const totalDep = 0

    const ebdit = grossProfit + totalOtherIncome - totalExp

    const grossProfitMargin = ((Number(grossProfit || 0)/Number(sales || 0))* 100).toFixed(2)

    const netProfitMargin = ((Number(netResult || 0)/Number(sales || 0))* 100).toFixed(2)

    // calculate debtors/creditors balances and debtors/creditors days

    const totalDebtors = data?.customers?.map(item => item?.totalDebt)?.reduce((a, b) => a + b, 0)

    const debtorsDays = ((((Number(totalDebtors || 0)/Number(creditSales || 0)) * 360)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    const totalCreditors = data?.suppliers?.map(item => item?.totalDebt)?.reduce((a, b) => a + b, 0)

    const creditorsDays = ((((Number(totalCreditors || 0)/Number(creditPurchases || 0)) * 360)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    // calculate the balance of treasury accounts (cash, bank and mobile money)

    const calculateTreasuryBalance = (data)=>{
      const totalIn = data?.filter(item => item?.inOrOut === 'in')?.map(item => Number(item.amount))?.reduce((a, b) => a + b, 0)

      const totalOut = data?.filter(item => item?.inOrOut === 'out')?.map(item => Number(item.amount))?.reduce((a, b) => a + b, 0)

      return (totalIn - totalOut)
    }

    const cash = calculateTreasuryBalance(data?.cash)
    const bank = calculateTreasuryBalance(data?.bank)
    const mobileMoney = calculateTreasuryBalance(data?.momo)

    const totalCapital = data?.capital?.map(item => item.totalContribution).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const totalLongtermLiab = 0

    const vatInvoiced = data.vat?.filter(item => item.vatType === 'invoiced').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0)

    const vatRecoverable = data.vat?.filter(item => item.vatType === 'recoverable').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0)

    const netVat = Number(vatInvoiced) - Number(vatRecoverable)


    const overDueInvoices = data?.salesInvoices?.filter(inv => (inv.balanceDue > 0 && new Date(inv?.input?.dueDate).getFullYear() <= today.getFullYear() && new Date(inv.input.dueDate).getTime() < today.getTime()))

    const dueThisMonthInvoices = data?.salesInvoices?.filter(inv => (new Date(inv.input.dueDate).getFullYear() === today.getFullYear()) && (new Date(inv?.input.dueDate).getMonth() === today.getMonth()))

    const subsequentMonthsDue = data?.salesInvoices?.filter(inv => (inv.balanceDue > 0) && (new Date(inv.input.dueDate).getFullYear() >= today.getFullYear()) && (new Date(inv.input.dueDate).getMonth() > today.getMonth()) && (new Date(inv.input.dueDate).getTime() > today.getTime()))

    const purchaseInvoicesDueThisMonth = data?.purchaseInvoices?.filter(inv => (new Date(inv.input.dueDate).getFullYear() === today.getFullYear()) && (new Date(inv?.input.dueDate).getMonth() === today.getMonth()))

    const totalOverDueInvoices = overDueInvoices?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0)

    const totalDueThisMonthInvoices = dueThisMonthInvoices?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0)

    const totalNotDueInvoices = subsequentMonthsDue?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0)

    
  return (
    <div className="Dashboard Invoices">
      <div className="treasuryBalances">
        <div className="companyName gridItem">
          <h2>{user.companyName?.slice(0, 20)}...</h2>
        </div>
        <div className="itemBalance gridItem">
          <p className="itemCaption">Cash Balance</p>
          <p className="itemValue">{!isNaN(cash) ? Number(cash).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</p>
        </div>
        <div className="itemBalance gridItem">
          <p className="itemCaption">Bank Balance</p>
          <p className="itemValue">{!isNaN(bank) ? Number(bank).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</p>
        </div>
        <div className="itemBalance gridItem">
          <p className="itemCaption">Mobile Money Balance</p>
          <p className="itemValue">{!isNaN(mobileMoney) ? Number(mobileMoney).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</p>
        </div>
      </div>

      <div className="profitAndLossSection">
        <div className="profitAndLossGraph">
          <LineChart
            labels={months}
            data1={monthlySales}
            tooltip1="Monthly Sales"
            data2={monthlyCOGS}
            tooltip2="Monthly COGS"
            data3={monthlyGP}
            tooltip3="Monthly GP"
          />
        </div>
        <div className="profitAndLossSummary">
          <div className="treasuryBalances">
            <div className="gridItem">
              <p className="itemCaption">Net Profit</p>
              <p className="itemValue">{!isNaN(Number(netResult)) ? (Number(netResult)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</p>
            </div>
            <div className="gridItem">
              <p className="itemCaption">Net Profit Margin</p>
              <p className="itemValue">{netProfitMargin}%</p>
            </div>
            <div className="itemBalance gridItem">
              <p className="itemCaption">Gross Profit</p>
              <p className="itemValue">{!isNaN(Number(grossProfit)) ? (Number(grossProfit)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</p>
            </div>
            <div className="itemBalance gridItem">
              <p className="itemCaption">Gross Profit Margin</p>
              <p className="itemValue">{grossProfitMargin}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="reportsSection">
        <div className="incomeStatementSection" style={{backgroundColor: 'white', marginTop: '1rem'}}>
          <h3>Summarised Income Statement</h3>
          <table className='summaryReport'>
            <thead>
              <tr>
                <th>Elements</th>
                <th>Calc</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sales</td>
                <td></td>
                <td>{!isNaN(Number(sales)) ? (Number(sales)?.toFixed(2))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</td>
              </tr>
              <tr>
                <td>Cost of Sales</td>
                <td></td>
                <td><u>({!isNaN(Number(costOfSales)) ? (Number(costOfSales)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0})</u></td>
              </tr>
              <tr>
                <td><b>Gross Profit</b></td>
                <td></td>
                <td><b>{!isNaN(Number(grossProfit)) ? (Number(grossProfit)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</b></td>
              </tr>
              <tr>
                <td>Other Income</td>
                <td></td>
                <td>{!isNaN(Number(totalOtherIncome)) ? (Number(totalOtherIncome)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</td>
              </tr>
              <tr>
                <td><b><u>Expenses</u></b></td>
                <td></td>
                <td><u>({!isNaN((Number(totalDep) + Number(totalExp))) ? ((Number(totalDep) + Number(totalExp))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0})</u></td>
              </tr>
              <tr>
                <td><b><u>EBIT</u></b></td>
                <td></td>
                <td><b><u>{!isNaN(Number(netResult)) ? (Number(netResult)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</u></b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="invoicesAndExpensesByNatureSection" style={{backgroundColor: 'white', marginTop: '1rem'}}>
          <h3>Invoices</h3>
          <DoughnutChart
            labels={['OverDue', 'Due in Sub. Mths', 'Due this Month']}
            data={[totalOverDueInvoices, totalNotDueInvoices, totalDueThisMonthInvoices]}
          />
          {/* <SingleBarChart
            data={[Number(totalDistExp), Number(totalAdminExp), Number(totalOtherExp)]}
            labels={['Distribution', 'AdminiStrative', 'Others']}
            tooltip='Expenses by type'
            backgroundColors={['#9AD636', '#D63689', '#088A07',]}
          /> */}
        </div>

        <div className="balanceSheetSummarySection" style={{backgroundColor: 'white', marginTop: '1rem'}}>
          <h3>Summarised Balance Sheet</h3>
          <table className='summaryReport'>
            <thead>
              <tr>
                <th>Elements</th>
                <th>Calc</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td>Net Fixed Assets</td>
                <td></td>
                <td>{(Number(totalNBV)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
              </tr>
              <tr>
                <td>Total Current Assets</td>
                <td></td>
                <td><u>{((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
              </tr> */}
              <tr>
                <td><b>Total Assets</b></td>
                <td></td>
                <td><b>{!isNaN((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors))) ? ((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</b></td>
              </tr>
              <tr>
                <td>Total Liabilities</td>
                <td></td>
                <td>{!isNaN((Number(totalCreditors) + Number(netVat) + Number(totalLongtermLiab))) ? ((Number(totalCreditors) + Number(netVat) + Number(totalLongtermLiab))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</td>
              </tr>
              {/* <tr>
                <td>Total Longterm Liabilities</td>
                <td><u>{totalLongtermLiab.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                <td><u>({((Number(totalLongtermLiab) + Number(totalCreditors) + Number(netVat)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></td>
              </tr> */}
              <tr>
                <td><b>Net Assets</b></td>
                <td></td>
                <td><b><u>{!isNaN(((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors) + Number(totalNBV)) - Number(totalCreditors) - Number(netVat) - Number(totalLongtermLiab))) ? (((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors) + Number(totalNBV)) - Number(totalCreditors) - Number(netVat) - Number(totalLongtermLiab)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</u></b></td>
              </tr>
              <tr>
                <td><b><u>Financed By:</u></b></td>
                <td></td>
                <td></td>
              </tr>
              {/* <tr>
                <td>Capital</td>
                <td>{(Number(totalCapital)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td></td>
              </tr> */}
              <tr>
                <td>EBIT</td>
                <td><u>{!isNaN((Number(ebdit) - Number(totalDep))) ? ((Number(ebdit) - Number(totalDep))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</u></td>
                <td></td>
              </tr>
              <tr>
                <td><b><u>Net Capital</u></b></td>
                <td><b><u>{!isNaN((Number(totalCapital) + (Number(ebdit) - Number(totalDep)))) ? ((Number(totalCapital) + (Number(ebdit) - Number(totalDep)))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</u></b></td>
                <td><b><u>{!isNaN((Number(totalCapital) + (Number(ebdit) - Number(totalDep)))) ? ((Number(totalCapital) + (Number(ebdit) - Number(totalDep)))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}</u></b></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="invoicesDueThisMonth">
            <p style={{backgroundColor: 'white'}}><b>Customer Invoices Due this Month</b></p>
            {
              dueThisMonthInvoices?.map(item => (
                <div className='dueInvoice' onClick={()=>{
                  history.push(`/invoices/${item._id}`)
                }}>
                  <p>Invoice #{item?.input?.number}</p>
                  <p>{(Number(item?.balanceDue?.toFixed(2))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </div>
              ))
            }
        </div>
        <div className="supplierInvoicesDueThisMonth" >
            <p style={{backgroundColor: 'white'}}><b>Supplier Invoices Due this Month</b></p>
          {
            purchaseInvoicesDueThisMonth?.map(item => (
                <div className='dueInvoice' onClick={()=>{
                  history.push(`/purchase-invoices/${item._id}`)
                }}>
                  <p>Invoice #{item?.input?.number}</p>
                  <p>{(Number(item?.balanceDue?.toFixed(2))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </div>
              ))
          }
        </div>
        <div className="netDebtorsAndCreditors">
          <div className="treasuryBalances">
            <div className="companyName gridItem">
              <p className="itemCaption">Total Debtors</p>
              <p className="itemValue">{(Number(totalDebtors)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
            <div className="itemBalance gridItem">
              <p className="itemCaption">Debtors Collection Period</p>
              <p className="itemValue">{debtorsDays} days</p>
            </div>
            <div className="itemBalance gridItem">
              <p className="itemCaption">Total Creditors</p>
              <p className="itemValue">{(Number(totalCreditors)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
            <div className="itemBalance gridItem">
              <p className="itemCaption">Creditors Payment Period</p>
              <p className="itemValue">{creditorsDays} days</p>
            </div>
          </div>
        </div>
      </div>



      {
        fetching && <Loader />
      }
    </div>
  );
}

export default Dashboard;
