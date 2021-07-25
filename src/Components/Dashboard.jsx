import React, {useState, useEffect, useRef} from "react";
import {useHistory} from 'react-router-dom'
import axios from "axios";
import "./Dashboard.css";
import LineChart from "./LineChart";
import DoughnutChart from "./Doughnut";
import SingleBarChart from "./SingleBarChart";
import {baseURL} from "./axios"
import Loader from './Loader';

function Dashboard() {

  const history = useHistory()

  const [fetching, setFetching] = useState(true)
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

  let janSales = []; let febSales = []; let marSales = []; let aprSales = []; let maySales = []; let junSales = []; let julSales = []; let augSales = []; let sepSales = []; let octSales = []; let novSales  = [];let decSales = [];

  let janSalesReturns = []; let febSalesReturns = []; let marSalesReturns = []; let aprSalesReturns = []; let maySalesReturns = []; let junSalesReturns = []; let julSalesReturns = []; let augSalesReturns = []; let sepSalesReturns = []; let octSalesReturns = []; let novSalesReturns  = [];let decSalesReturns = [];

  let janPurchases = []; let febPurchases = []; let marPurchases = []; let aprPurchases = []; let mayPurchases = []; let junPurchases = []; let julPurchases = []; let augPurchases = []; let sepPurchases = []; let octPurchases = []; let novPurchases  = [];let decPurchases = [];

  let janPurchaseReturns = []; let febPurchaseReturns = []; let marPurchaseReturns = []; let aprPurchaseReturns = []; let mayPurchaseReturns = []; let junPurchaseReturns = []; let julPurchaseReturns = []; let augPurchaseReturns = []; let sepPurchaseReturns = []; let octPurchaseReturns = []; let novPurchaseReturns  = [];let decPurchaseReturns = [];

  let janPurchaseExp = []; let febPurchaseExp = []; let marPurchaseExp = []; let aprPurchaseExp = []; let mayPurchaseExp = []; let junPurchaseExp = []; let julPurchaseExp = []; let augPurchaseExp = []; let sepPurchaseExp = []; let octPurchaseExp = []; let novPurchaseExp  = [];let decPurchaseExp = [];

  let janEntries = []; let febEntries = []; let marEntries = []; let aprEntries = []; let mayEntries = []; let junEntries = []; let julEntries = []; let augEntries = []; let sepEntries = []; let octEntries = []; let novEntries  = [];let decEntries = [];

  let janExits = []; let febExits = []; let marExits = []; let aprExits = []; let mayExits = []; let junExits = []; let julExits = []; let augExits = []; let sepExits = []; let octExits = []; let novExits  = [];let decExits = [];

  const switcher = (key, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec, amount)=>{
    switch (key) {
      case 0:
        jan.push(amount)
        break;
      
      case 1:
        feb.push(amount)
        break;

      case 2:
        mar.push(amount)
        break;

      case 3:
        apr.push(amount)
        break;

      case 4:
        may.push(amount)
        break;

      case 5:
        jun.push(amount)
        break;

      case 6:
        jul.push(amount)
        break;

      case 7:
        aug.push(amount)
        break;

      case 8:
        sep.push(amount)
        break;

      case 9:
        oct.push(amount)
        break;

      case 10:
        nov.push(amount)
        break;

      case 11:
        dec.push(amount)
        break;
    
      default:
        return null
        break;
    }
  }

  const reducer = (amount)=>{
    return amount.reduce((a, b) => Number(a) + Number(b), 0)
  }

  data?.sales?.filter(item => item.saleType !== 'sales returns').map(item => {
    const key = new Date(item.date).getMonth()
    const amount = item.amount

    switcher(key, janSales, febSales, marSales, aprSales, maySales, junSales, julSales, augSales, sepSales, octSales, novSales, decSales, amount)
  })

  data?.sales?.filter(item => item.saleType === 'sales returns').map(item => {
    const key = new Date(item.date).getMonth()
    const amount = item.amount

    switcher(key, janSalesReturns, febSalesReturns, marSalesReturns, aprSalesReturns, maySalesReturns, junSalesReturns, julSalesReturns, augSalesReturns, sepSalesReturns, octSalesReturns, novSalesReturns, decSalesReturns, amount)
  })

  const janSale = reducer(janSales) - reducer(janSalesReturns)
  const febSale = reducer(febSales) - reducer(febSalesReturns)
  const marSale = reducer(marSales) - reducer(marSalesReturns)
  const aprSale = reducer(aprSales) - reducer(aprSalesReturns)
  const maySale = reducer(maySales) - reducer(maySalesReturns)
  const junSale = reducer(junSales) - reducer(junSalesReturns)
  const julSale = reducer(julSales) - reducer(julSalesReturns)
  const augSale = reducer(augSales) - reducer(augSalesReturns)
  const sepSale = reducer(sepSales) - reducer(sepSalesReturns)
  const octSale = reducer(octSales) - reducer(octSalesReturns)
  const novSale = reducer(novSales) - reducer(novSalesReturns)
  const decSale = reducer(decSales) - reducer(decSalesReturns)

  

  data?.purchases?.filter(item => item.purchaseType !== 'purchase returns').map(item => {
    const key = new Date(item.date).getMonth()
    const amount = item.amount
    switcher(key, janPurchases, febPurchases, marPurchases, aprPurchases, mayPurchases, junPurchases, julPurchases, augPurchases, sepPurchases, octPurchases, novPurchases, decPurchases, amount)
  })

  data?.purchases?.filter(item => item.purchaseType === 'purchase returns').map(item => {
    const key = new Date(item.date).getMonth()
    const amount = item.amount
    switcher(key, janPurchaseReturns, febPurchaseReturns, marPurchaseReturns, aprPurchaseReturns, mayPurchaseReturns, junPurchaseReturns, julPurchaseReturns, augPurchaseReturns, sepPurchaseReturns, octPurchaseReturns, novPurchaseReturns, decPurchaseReturns, amount)
  })

  const janPurchase = reducer(janPurchases) - reducer(janPurchaseReturns)
  const febPurchase = reducer(febPurchases) - reducer(febPurchaseReturns)
  const marPurchase = reducer(marPurchases) - reducer(marPurchaseReturns)
  const aprPurchase = reducer(aprPurchases) - reducer(aprPurchaseReturns)
  const mayPurchase = reducer(mayPurchases) - reducer(mayPurchaseReturns)
  const junPurchase = reducer(junPurchases) - reducer(junPurchaseReturns)
  const julPurchase = reducer(julPurchases) - reducer(julPurchaseReturns)
  const augPurchase = reducer(augPurchases) - reducer(augPurchaseReturns)
  const sepPurchase = reducer(sepPurchases) - reducer(sepPurchaseReturns)
  const octPurchase = reducer(octPurchases) - reducer(octPurchaseReturns)
  const novPurchase = reducer(novPurchases) - reducer(novPurchaseReturns)
  const decPurchase = reducer(decPurchases) - reducer(decPurchaseReturns)

  data?.purchaseExpenses?.map(item => {
    const key = new Date(item.date).getMonth()
    const amount = item.value
    switcher(key, janPurchaseExp, febPurchaseExp, marPurchaseExp, aprPurchaseExp, mayPurchaseExp, junPurchaseExp, julPurchaseExp, augPurchaseExp, sepPurchaseExp, octPurchaseExp, novPurchaseExp, decPurchaseExp, amount)
  })

  const janPurchaseExpVal = reducer(janPurchaseExp)
  const febPurchaseExpVal = reducer(febPurchaseExp)
  const marPurchaseExpVal = reducer(marPurchaseExp) 
  const aprPurchaseExpVal = reducer(aprPurchaseExp)
  const mayPurchaseExpVal = reducer(mayPurchaseExp) 
  const junPurchaseExpVal = reducer(junPurchaseExp) 
  const julPurchaseExpVal = reducer(julPurchaseExp)
  const augPurchaseExpVal = reducer(augPurchaseExp) 
  const sepPurchaseExpVal = reducer(sepPurchaseExp) 
  const octPurchaseExpVal = reducer(octPurchaseExp) 
  const novPurchaseExpVal = reducer(novPurchaseExp)
  const decPurchaseExpVal = reducer(decPurchaseExp)

  data?.inventory?.filter(item => item.exitOrEntry === 'entry').map(item => {
    const key = new Date(item.date).getMonth()
    const amount = item.amount
    switcher(key, janEntries, febEntries, marEntries, aprEntries, mayEntries, junEntries, julEntries, augEntries, sepEntries, octEntries, novEntries, decEntries, amount)
  })

  const janEntry = reducer(janEntries)
  const febEntry = reducer(febEntries)
  const marEntry = reducer(marEntries) 
  const aprEntry = reducer(aprEntries)
  const mayEntry = reducer(mayEntries) 
  const junEntry = reducer(junEntries) 
  const julEntry = reducer(julEntries)
  const augEntry = reducer(augEntries) 
  const sepEntry = reducer(sepEntries) 
  const octEntry = reducer(octEntries) 
  const novEntry = reducer(novEntries)
  const decEntry = reducer(decEntries)

  data?.inventory?.filter(item => item.exitOrEntry === 'exit').map(item => {
    const key = new Date(item.date).getMonth()
    const amount = item.amount
    switcher(key, janExits, febExits, marExits, aprExits, mayExits, junExits, julExits, augExits, sepExits, octExits, novExits, decExits, amount)
  })

  const janExit = reducer(janExits)
  const febExit = reducer(febExits)
  const marExit = reducer(marExits) 
  const aprExit = reducer(aprExits)
  const mayExit = reducer(mayExits) 
  const junExit = reducer(junExits) 
  const julExit = reducer(julExits)
  const augExit = reducer(augExits) 
  const sepExit = reducer(sepExits) 
  const octExit = reducer(octExits) 
  const novExit = reducer(novExits)
  const decExit = reducer(decExits)

  const janStock = janEntry - janExit
  const febStock = febEntry - febExit
  const marStock = marEntry - marExit 
  const aprStock = aprEntry - aprExit
  const mayStock = mayEntry - mayExit 
  const junStock = junEntry - junExit 
  const julStock = julEntry - julExit
  const augStock = augEntry - augExit 
  const sepStock = sepEntry - sepExit 
  const octStock = octEntry - octExit 
  const novStock = novEntry - novExit
  const decStock = decEntry - decExit

  const janCOGS = janPurchase + janPurchaseExpVal - janStock
  const febCOGS = febPurchase + febPurchaseExpVal - febStock
  const marCOGS = marPurchase + marPurchaseExpVal - marStock 
  const aprCOGS = aprPurchase + aprPurchaseExpVal - aprStock
  const mayCOGS = mayPurchase + mayPurchaseExpVal - mayStock 
  const junCOGS = junPurchase + junPurchaseExpVal - junStock 
  const julCOGS = julPurchase + julPurchaseExpVal - julStock
  const augCOGS = augPurchase + augPurchaseExpVal - augStock 
  const sepCOGS = sepPurchase + sepPurchaseExpVal - sepStock 
  const octCOGS = octPurchase + octPurchaseExpVal - octStock 
  const novCOGS = novPurchase + novPurchaseExpVal - novStock
  const decCOGS = decPurchase + decPurchaseExpVal - decStock

  const janGP = janSale - janCOGS
  const febGP = febSale - febCOGS
  const marGP = marSale - marCOGS 
  const aprGP = aprSale - aprCOGS
  const mayGP = maySale - mayCOGS 
  const junGP = junSale - junCOGS 
  const julGP = julSale - julCOGS
  const augGP = augSale - augCOGS 
  const sepGP = sepSale - sepCOGS 
  const octGP = octSale - octCOGS 
  const novGP = novSale - novCOGS
  const decGP = decSale - decCOGS

    const sales = data.sales?.filter(item => item.saleType !== 'sales returns').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const creditSales = data.sales?.filter(item => item.saleType === 'credit').map(item => item.amount).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const salesReturns = data.sales?.filter(item => item.saleType === 'sales returns').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0).toFixed(2) || 0

    const purchases = data.purchases?.filter(item => item.purchaseType !== 'purchase returns').map(item => item.amount).reduce((a, b) => a + b, 0) || 0

    const purchaseReturns = data.purchases?.filter(item => item.purchaseType === 'purchase returns').map(item => item.amount).reduce((a, b) => a + b, 0) || 0

    const creditPurchases = data.purchases?.filter(item => item.purchaseType === 'credit').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0) || 0

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

    const totalAdminExp = expenses?.filter(item => item.category === 'administration').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const totalDistExp = expenses?.filter(item => item.category === 'distribution').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const totalOtherExp = expenses?.filter(item => item.category === 'other').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0) || 0

    const today = new Date()
    const thisYear = today.getFullYear()
    const thisDay = today.getDate()
    const thisMonth = today.getMonth()
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

    const grossProfitMargin = ((Number(grossProfit)/Number(sales))* 100).toFixed(2) || 0

    const netProfitMargin = ((Number(netResult)/Number(sales))* 100).toFixed(2) || 0

    const totalDebtors = data?.debtors?.map(item => item.balanceDue).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const debtorsDays = ((((totalDebtors/creditSales) * 360)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0

    const totalCreditors = data?.suppliers?.map(item => item.balanceDue).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const creditorsDays = ((((totalCreditors/creditPurchases) * 360)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0

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

    const paidInvoices = data?.salesInvoices?.filter(item => Number(item.netPayable) === Number(item.totalPaid))

    const unpaidInvoices = data?.salesInvoices?.filter(item => Number(item.netPayable) > Number(item.totalPaid))

    const unpaidPurchaseInvoices = data?.purchaseInvoices?.filter(item => Number(item.netPayable) > Number(item.totalPaid))

    let overDueInvoices = []
    let dueThisMonthInvoices = []
    let notDueInvoices = []
    let purchaseInvoicesDueThisMonth = []

    unpaidInvoices?.forEach(invoice => {
      const dueDate = new Date(invoice.dueDate)
      const dueMonth = dueDate.getMonth()
      const dueYear = dueDate.getFullYear()
      const dueDay = dueDate.getDate()
      if (dueYear === thisYear) {
        if (dueMonth < thisMonth) {
          overDueInvoices.push(invoice)
        }
        if (dueMonth === thisMonth) {
          if (dueDay < thisDay) {
            overDueInvoices.push(invoice)
          }
          if (dueDay >= thisDay) {
            dueThisMonthInvoices.push(invoice)
          }
        }
        if (dueMonth > thisMonth) {
          notDueInvoices.push(invoice)
        }
      }
    })

    unpaidPurchaseInvoices?.forEach(item => {
      const dueDate = new Date(item.dueDate)
      const dueMonth = dueDate.getMonth()
      const dueYear = dueDate.getFullYear()
      if (dueYear === thisYear) {
        if (dueMonth === thisMonth) {
          purchaseInvoicesDueThisMonth.push(item)
        }
      }
    })

    const totalOverDueInvoices = overDueInvoices?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0)

    const totalDueThisMonthInvoices = dueThisMonthInvoices?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0)

    const totalNotDueInvoices = notDueInvoices?.map(item => item.balanceDue).reduce((a, b) => Number(a) + Number(b), 0)

    
  return (
    <div className="Dashboard Invoices">
      <div className="treasuryBalances">
        <div className="companyName gridItem">
          <h2>XYZ Ltd to the world...</h2>
        </div>
        <div className="itemBalance gridItem">
          <p className="itemCaption">Cash Balance</p>
          <p className="itemValue">{(Number(cash)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </div>
        <div className="itemBalance gridItem">
          <p className="itemCaption">Bank Balance</p>
          <p className="itemValue">{(Number(bank)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </div>
        <div className="itemBalance gridItem">
          <p className="itemCaption">Mobile Money Balance</p>
          <p className="itemValue">{(Number(mobileMoney)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </div>
      </div>

      <div className="profitAndLossSection">
        <div className="profitAndLossGraph">
          <LineChart
            labels={[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sept",
              "Oct",
              "Nov",
              "Dec",
            ]}
            data1={[janSale, febSale, marSale, aprSale, maySale, junSale, julSale, augSale, sepSale, octSale, novSale, decSale]}
            tooltip1="Sales"
            data2={[janCOGS, febCOGS, marCOGS, aprCOGS, mayCOGS, junCOGS, julCOGS, augCOGS, sepCOGS, octCOGS, novCOGS, decCOGS]}
            tooltip2="COGS"
            data3={[
              janGP, febGP, marGP, aprGP, mayGP, junGP, julGP, augGP, sepGP, octGP, novGP, decGP,
            ]}
            tooltip3="Gross Profit"
          />
        </div>
        <div className="profitAndLossSummary">
          <div className="treasuryBalances">
            <div className="companyName gridItem">
              <p className="itemCaption">Net Profit</p>
              <p className="itemValue">{(Number(netResult)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
            <div className="itemBalance gridItem">
              <p className="itemCaption">Net Profit Margin</p>
              <p className="itemValue">{netProfitMargin}%</p>
            </div>
            <div className="itemBalance gridItem">
              <p className="itemCaption">Gross Profit</p>
              <p className="itemValue">{(Number(grossProfit)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            </div>
            <div className="itemBalance gridItem">
              <p className="itemCaption">Gross Profit Margin</p>
              <p className="itemValue">{grossProfitMargin}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="reportsSection">
        <div className="incomeStatementSection">
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
                <td>{Number(sales)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
              </tr>
              <tr>
                <td>Cost of Sales</td>
                <td></td>
                <td><u>({(Number(costOfSales)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></td>
              </tr>
              <tr>
                <td><b>Gross Profit</b></td>
                <td></td>
                <td><b>{(Number(grossProfit)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
              </tr>
              <tr>
                <td>Other Income</td>
                <td></td>
                <td>{(Number(totalOtherIncome)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
              </tr>
              <tr>
                <td><b><u>Expenses</u></b></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Admin</td>
                <td>{(Number(totalAdminExp)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td></td>
              </tr>
              <tr>
                <td>Distribution</td>
                <td>{(Number(totalDistExp)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td></td>
              </tr>
              <tr>
                <td>Other Exp</td>
                <td>{(Number(totalOtherExp)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td></td>
              </tr>
              <tr>
                <td>Depreciation</td>
                <td><u>{(Number(totalDep)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                <td><u>({((Number(totalDep) + Number(totalExp))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></td>
              </tr>
              <tr>
                <td><b><u>EBIT</u></b></td>
                <td></td>
                <td><b><u>{(Number(netResult)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></b></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="invoicesAndExpensesByNatureSection">
          <DoughnutChart
            labels={['OverDue', 'Not Due', 'Due this Month']}
            data={[totalOverDueInvoices, totalNotDueInvoices, totalDueThisMonthInvoices]}
          />
          <SingleBarChart
            data={[Number(totalDistExp), Number(totalAdminExp), Number(totalOtherExp)]}
            labels={['Distribution', 'AdminiStrative', 'Others']}
            tooltip='Expenses by type'
            backgroundColors={['#9AD636', '#D63689', '#088A07',]}
          />
        </div>

        <div className="balanceSheetSummarySection">
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
              <tr>
                <td>Net Fixed Assets</td>
                <td></td>
                <td>{(Number(totalNBV)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
              </tr>
              <tr>
                <td>Total Current Assets</td>
                <td></td>
                <td><u>{((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
              </tr>
              <tr>
                <td><b>Total Assets</b></td>
                <td></td>
                <td><b>{((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors) + Number(totalNBV)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b></td>
              </tr>
              <tr>
                <td>Total Current Liabilities</td>
                <td>{((Number(totalCreditors) + Number(netVat)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td></td>
              </tr>
              <tr>
                <td>Total Longterm Liabilities</td>
                <td><u>{totalLongtermLiab.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                <td><u>({((Number(totalLongtermLiab) + Number(totalCreditors) + Number(netVat)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</u></td>
              </tr>
              <tr>
                <td><b>Net Assets</b></td>
                <td></td>
                <td><b><u>{(((Number(mobileMoney) + Number(cash) + Number(bank) + Number(closingStock) + Number(totalDebtors) + Number(totalNBV)) - Number(totalCreditors) - Number(netVat) - Number(totalLongtermLiab)).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></b></td>
              </tr>
              <tr>
                <td><b><u>Financed By:</u></b></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Capital</td>
                <td>{(Number(totalCapital)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                <td></td>
              </tr>
              <tr>
                <td>EBIT</td>
                <td><u>{((Number(ebdit) - Number(totalDep))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></td>
                <td></td>
              </tr>
              <tr>
                <td><b><u>Net Capital</u></b></td>
                <td><b><u>{((Number(totalCapital) + (Number(ebdit) - Number(totalDep)))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></b></td>
                <td><b><u>{((Number(totalCapital) + (Number(ebdit) - Number(totalDep)))?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</u></b></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="invoicesDueThisMonth">
            <p><b>Customer Invoices Due this Month</b></p>
            {
              dueThisMonthInvoices?.map(item => (
                <div className='dueInvoice' onClick={()=>{
                  history.push(`/invoices/${item._id}`)
                }}>
                  <p>Invoice #{item.invoiceInput.invoiceNumber}</p>
                  <p>{(Number(item.balanceDue?.toFixed(2))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </div>
              ))
            }
        </div>
        <div className="supplierInvoicesDueThisMonth">
            <p><b>Supplier Invoices Due this Month</b></p>
          {
            purchaseInvoicesDueThisMonth?.map(item => (
                <div className='dueInvoice' onClick={()=>{
                  history.push(`/purchase-invoices/${item._id}`)
                }}>
                  <p>{item.invoiceInput.invoiceNumber}</p>
                  <p>{(Number(item.balanceDue?.toFixed(2))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
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
