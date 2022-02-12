import React, { useContext, useState } from 'react'
import useFetch from '../customHooks/useFetch'
import Loader from './Loader'
import {UserContext} from '../customHooks/userContext'
import print from 'print-js'
import {baseURL} from './axios'
import Alert from './Alert'

function IncomeStatement() {
    const today = new Date()
    const {user} = useContext(UserContext)

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const {data, loader, setLoader} = useFetch('', {})

    const concancatInvoicesAndReceipts = (data, data2) =>{
        return data?.filter(item => new Date(item?.input?.date).getFullYear() === today.getFullYear())?.concat(data2?.filter(receipt => new Date(receipt?.input?.date).getFullYear() === today.getFullYear()))
    }

    const getTotals = (data) =>{
        return data?.filter(item => new Date(item?.input?.date).getFullYear() === today.getFullYear())?.map(item => item.grossAmount)?.reduce((a, b) => a + b, 0)
    }

    const salesData = concancatInvoicesAndReceipts(data?.salesInvoices, data?.salesReceipts)

    const creditSales = getTotals(data?.salesInvoices)
    const cashSales = getTotals(data?.salesReceipts)

    const salesReturns = getTotals(data?.salesReturns)

    
    const creditPurchases = getTotals(data?.purchaseInvoices)
    const cashPurchases = getTotals(data?.purchaseReceipts)
    const purchaseReturns = getTotals(data?.purchaseReturns)

    

    const openingStock = data.inventories?.map(item => item?.stockSummary?.openingStock?.amount).reduce((a, b) => a + b, 0)

    const closingStock = data.inventories?.map(item => item?.stockSummary?.closingStock?.amount).reduce((a, b) => a + b, 0)

    const costOfSales = ((salesData?.map(item => item?.cogs).reduce((a, b) => Number(a) + Number(b), 0)) - data?.salesReturns?.map(ret => ret?.cogs).reduce((a, b) => Number(a) + Number(b), 0)) - (purchaseReturns)

    const grossProfit = (salesData?.map(data => Number(data?.grossProfit || 0)).reduce((a, b ) => a + b, 0)) - (data?.salesReturns?.map(item => Number(item?.grossProfit || 0))?.reduce((a, b) => a + b, 0)) || 0

    const totalDiscountsReceived = data.discounts?.filter(item => item.discountType === 'received' && new Date(item?.date).getFullYear() === today.getFullYear()).map(item => item?.amount).reduce((acc, item) => acc + item, 0)

    const otherIncome =  data?.otherIncomes?.filter(income => income.incomeType === 'other income' && new Date(income.date).getFullYear() === today.getFullYear())?.map(item => item.amount).reduce((a, b) => a + b, 0) || 0

    const totalOtherIncome = totalDiscountsReceived + otherIncome


    const totalOtherCharges = data?.otherIncomes?.filter(income => income.incomeType === 'other expense' && new Date(income.date).getFullYear() === today.getFullYear())?.map(item => item.amount).reduce((a, b) => a + b, 0) || 0

    const totalDiscountsAllowed = data.discounts?.filter(item => item.discountType === 'allowed' && new Date(item?.date).getFullYear() === today.getFullYear()).map(item => item?.amount).reduce((acc, item) => acc + item, 0)

    const totalExp = (data.expenses?.filter(exp => new Date(exp.date).getFullYear() === today.getFullYear())?.map(exp => (Number(exp?.amount?.cash ?? 0) + Number(exp?.amount?.bank ?? 0) + Number(exp?.amount?.mobileMoney ?? 0))).reduce((a, b) => a + b, 0)) + totalDiscountsAllowed + totalOtherCharges || 0

    const netResult = grossProfit + totalOtherIncome - totalExp

    const printData = {
        image : user?.logoURL,
        companyName : user?.companyName,
        year : today?.getFullYear(),
        creditSales,
        cashSales,
        salesReturns,
        netSales : Number(creditSales) + Number(cashSales) - Number(salesReturns),
        openingStock,
        creditPurchases,
        cashPurchases,
        purchaseReturns,
        closingStock,
        costOfSales,
        grossProfit,
        discountsReceived : totalDiscountsReceived,
        otherIncome,
        totalOtherIncome,
        discountsAllowed : totalDiscountsAllowed,
        otherCharges : totalOtherCharges,
        expenses : data?.expenses?.map(exp => ({...exp, total : (Number(exp?.amount?.cash ?? 0) + Number(exp?.amount?.bank ?? 0) + Number(exp?.amount?.mobileMoney ?? 0))})),
        totalExp,
        netResult,
    }

    const handlePrint = async() => {
        try {
            setLoader(true)
            const {data} = await baseURL.post('/reports/incomeStatement', printData, {
                responseType: 'blob',
                headers : {
                    'auth-token' : user?.token
                }
            })

            const pdfBlob = new Blob([data], {type:'application/pdf'})

            const pdfUrl = URL.createObjectURL(pdfBlob)

            print({
                printable : pdfUrl,
                type: 'pdf',
                documentTitle: '@HK Solutions',
            })
        } catch (error) {
            console.log(error);

            setAlertMessage(error.message)
            setAlert(true)
            setTimeout(function () {
                setAlert(false)
                setAlertMessage('')
            }, 2000)
        }finally{
            setLoader(false)
        }
    }


    return (
        <div className='Invoices SingleReport'>
            <div className="reportOptions">
                <i className="fas fa-print fa-2x" onClick={handlePrint}></i>
            </div>
            <div className="reportInfos reportHeader">
                <div className="companyLogo" style={{
                    backgroundImage : `url(${user?.logoURL})`
                }}></div>
                <div>
                    <h1>{user?.companyName}</h1>
                    <p>Income Statement For The Year {new Date().getFullYear()}</p>
                </div>
            </div>

            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th className="incomstatementElem incomeStatementTableItem">Elements</th>
                            <th className="incomeStatementTableItem">Amount</th>
                            <th className="incomeStatementTableItem">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Credit Sales</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem">{Number(creditSales)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Treasury Sales (Cash, Bank & Mobile Money)</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem">{Number(cashSales)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Less Sales Returns</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem">({Number(salesReturns)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})</td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem firstColumn">Net Sales</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem boldItem">{(Number(cashSales) + Number(creditSales) - Number(salesReturns))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem underlineItem">Less Cost of Sales</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem boldItem"></td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Opening Stock</td>
                            <td className="incomeStatementTableItem">
                                {Number(openingStock)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Credit Purchases</td>
                            <td className="incomeStatementTableItem">
                                {Number(creditPurchases)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Treasury Purchases (Cash, Bank & Mobile Money)</td>
                            <td className="incomeStatementTableItem">
                                {Number(cashPurchases)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Less Purchase Returns</td>
                            <td className="incomeStatementTableItem">
                                ({Number(purchaseReturns)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
                            </td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Less Closing Stock</td>
                            <td className="incomeStatementTableItem underlineItem">
                                ({Number(closingStock)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
                            </td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem miniBoldItem firstColumn">Cost of Sales</td>
                            <td className="incomeStatementTableItem miniBoldItem underlineItem">
                                {Number(costOfSales)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td className="incomeStatementTableItem miniBoldItem underlineItem">
                                ({Number(costOfSales)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
                            </td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem firstColumn">Gross Profit</td>
                            <td className="incomeStatementTableItem boldItem"></td>
                            <td className="incomeStatementTableItem boldItem">
                                {Number(grossProfit)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                        </tr>

                        {
                            totalOtherIncome > 0 && <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem underlineItem">OtherIncome</td>
                            <td className="incomeStatementTableItem boldItem"></td>
                            <td className="incomeStatementTableItem boldItem"></td>
                        </tr>
                        }
                        {
                            totalDiscountsReceived > 0 && <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Discounts Received</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem">
                                {Number(totalDiscountsReceived)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                        </tr>
                        }
                        {
                            otherIncome > 0 && <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Operating Income Transfered</td>
                            <td className="incomeStatementTableItem underlineItem">
                                {Number(otherIncome)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td className="incomeStatementTableItem">
                                {Number(totalOtherIncome)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                        </tr>
                        }

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem underlineItem">Less Expenses</td>
                            <td className="incomeStatementTableItem boldItem"></td>
                            <td className="incomeStatementTableItem boldItem"></td>
                        </tr>
                        {
                            totalDiscountsAllowed > 0 && <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Discounts Allowed</td>
                            <td className="incomeStatementTableItem">
                                {Number(totalDiscountsAllowed)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        }
                        {
                            totalOtherCharges > 0 && <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Operating Expenses Transfered</td>
                            <td className="incomeStatementTableItem">
                                {Number(totalOtherCharges)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        }
                        {
                            data?.expenses?.map(exp => (
                                <tr>
                                    <td className="incomstatementElem incomeStatementTableItem firstColumn">{exp?.expName}</td>
                                    <td className="incomeStatementTableItem">
                                        {(Number(exp?.amount?.cash ?? 0) + Number(exp?.amount?.bank ?? 0) + Number(exp?.amount?.mobileMoney ?? 0))?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </td>
                                    <td className="incomeStatementTableItem"></td>
                                </tr>
                            ))
                        }
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem miniBoldItem firstColumn">Total Expenses</td>
                            <td className="incomeStatementTableItem miniBoldItem underlineItem">
                                {Number(totalExp)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td className="incomeStatementTableItem miniBoldItem underlineItem">
                                ({Number(totalExp)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")})
                            </td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem firstColumn">Net Result</td>
                            <td className="incomeStatementTableItem boldItem underlineItem"></td>
                            <td className="incomeStatementTableItem boldItem underlineItem">
                                {Number(netResult)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Alert
                alert={alert}
                message={alertMessage}
            />

            {
                loader && <Loader />
            }
        </div>
    )
}

export default IncomeStatement
