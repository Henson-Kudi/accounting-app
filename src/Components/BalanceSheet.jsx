import React, { useContext, useState } from 'react';
import useFetch from '../customHooks/useFetch'
import Loader from './Loader'
import { UserContext } from './userContext'
import print from 'print-js'
import {baseURL} from './axios'
import Alert from './Alert'


function BalanceSheet() {

    const today = new Date()
    const {user} = useContext(UserContext)
    const {companyName} = user

    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const {data, loader, setLoader} = useFetch('', {})

    const closingStock = data.inventories?.map(item => item?.stockSummary?.closingStock?.amount).reduce((a, b) => a + b, 0)

    const totalDebtors = data?.customers?.map(item => item?.totalDebt)?.reduce((a, b) => a + b, 0)

    const concancatInvoicesAndReceipts = (data, data2) =>{
        return data?.filter(item => new Date(item?.input?.date).getFullYear() === today.getFullYear())?.concat(data2?.filter(receipt => new Date(receipt?.input?.date).getFullYear() === today.getFullYear()))
    }

    const salesData = concancatInvoicesAndReceipts(data?.salesInvoices, data?.salesReceipts)

    // calculate the balance of treasury accounts (cash, bank and mobile money)

    const calculateTreasuryBalance = (data)=>{
        const totalIn = data?.filter(item => item?.inOrOut === 'in')?.map(item => Number(item.amount))?.reduce((a, b) => a + b, 0)

        const totalOut = data?.filter(item => item?.inOrOut === 'out')?.map(item => Number(item.amount))?.reduce((a, b) => a + b, 0)

        return (totalIn - totalOut)
    }

    const cash = calculateTreasuryBalance(data?.cash)
    const bank = calculateTreasuryBalance(data?.bank)
    const momo = calculateTreasuryBalance(data?.momo)

    const totalCurrentAssets = cash + bank + momo + totalDebtors + closingStock

    const totalCreditors = data?.suppliers?.map(item => item?.totalDebt)?.reduce((a, b) => a + b, 0)

    const vatInvoiced = data.vat?.filter(item => item.vatType === 'invoiced').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0)

    const vatRecoverable = data.vat?.filter(item => item.vatType === 'recoverable').map(item => item.amount).reduce((a, b) => Number(a) + Number(b), 0)

    const netVat = Number(vatInvoiced) - Number(vatRecoverable)

    const totalCurrentLiabilities = totalCreditors + netVat

    const workingCapital = totalCurrentAssets - totalCurrentLiabilities

    const capital = data?.capital?.map(item => item.totalContribution).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const capitalIncreases = data?.capitalIncreases?.map(item => Number(item.amount)).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const capitalDrawings = data?.capitalDrawings?.map(item => Number(item.amount)).reduce((a, b) => a + b, 0).toFixed(2) || 0

    const totalDiscountsAllowed = data.discounts?.filter(item => item.discountType === 'allowed' && new Date(item?.date).getFullYear() === today.getFullYear()).map(item => item?.amount).reduce((acc, item) => acc + item, 0)

    const totalDiscountsReceived = data.discounts?.filter(item => item.discountType === 'received' && new Date(item?.date).getFullYear() === today.getFullYear()).map(item => item?.amount).reduce((acc, item) => acc + item, 0)

    // after creating schema for other charges, make sure to update formula for other charges and other income

    const totalOtherIncome = (data?.otherIncomes?.filter(income => income.incomeType === 'other income' && new Date(income.date).getFullYear() === today.getFullYear())?.map(item => item.amount).reduce((a, b) => a + b, 0) || 0) + totalDiscountsReceived

    const totalOtherCharges = data?.otherIncomes?.filter(income => income.incomeType === 'other expense' && new Date(income.date).getFullYear() === today.getFullYear())?.map(item => item.amount).reduce((a, b) => a + b, 0) || 0

    const totalExp = (data.expenses?.filter(exp => new Date(exp.date).getFullYear() === today.getFullYear())?.map(exp => (Number(exp?.amount?.cash ?? 0) + Number(exp?.amount?.bank ?? 0) + Number(exp?.amount?.mobileMoney ?? 0))).reduce((a, b) => a + b, 0)) + totalDiscountsAllowed + totalOtherCharges || 0

    const grossProfit = (salesData?.map(data => Number(data?.grossProfit || 0)).reduce((a, b ) => a + b, 0)) - (data?.salesReturns?.map(item => Number(item?.grossProfit || 0))?.reduce((a, b) => a + b, 0)) || 0

    const netResult = grossProfit + totalOtherIncome - totalExp

    const netCapital  = capital + capitalIncreases + capitalDrawings + netResult

    const printData = {
        date : today.getFullYear(),
        companyName,
        closingStock,
        totalDebtors,
        cash,
        bank,
        momo,
        totalCurrentAssets,
        totalCreditors,
        netVat,
        totalCurrentLiabilities,
        workingCapital,
        capital,
        capitalIncreases,
        capitalDrawings,
        netResult,
        netCapital,
    }

    const handlePrint = async() => {
        try {
            setLoader(true)
            const {data} = await baseURL.post('/reports/balanceSheet', printData, {
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
                <h1>{companyName}</h1>
                <p>Balance Sheet For The Year {new Date().getFullYear()}</p>
            </div>

            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th className="incomstatementElem incomeStatementTableItem">Elements</th>
                            <th className="incomeStatementTableItem">Amount</th>
                            <th className="incomeStatementTableItem">Amount</th>
                            <th className="incomeStatementTableItem">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem underlineItem">ASSETS</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn miniBoldItem underlineItem">Fixed Assets</td>
                            <td className="incomeStatementTableItem">Nil</td>
                            <td className="incomeStatementTableItem">Nil</td>
                            <td className="incomeStatementTableItem">Nil</td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn miniBoldItem underlineItem">Current Assets</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Inventory</td>
                            <td className="incomeStatementTableItem">{Number(closingStock)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Debtors</td>
                            <td className="incomeStatementTableItem">{Number(totalDebtors)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Bank</td>
                            <td className="incomeStatementTableItem">{Number(bank)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Mobile Money</td>
                            <td className="incomeStatementTableItem">{Number(momo)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Cash</td>
                            <td className="incomeStatementTableItem underlineItem">{Number(cash)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn miniBoldItem">Total Current Assets</td>
                            <td className="incomeStatementTableItem miniBoldItem underlineItem">{Number(totalCurrentAssets)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem miniBoldItem">{Number(totalCurrentAssets)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem underlineItem">LIABILITIES</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn miniBoldItem underlineItem">Current Liabilities</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Creditors</td>
                            <td className="incomeStatementTableItem">{Number(totalCreditors)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">VAT to be paid</td>
                            <td className="incomeStatementTableItem underlineItem">{Number(netVat)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn miniBoldItem">Total Current Liabilities</td>
                            <td className="incomeStatementTableItem miniBoldItem underlineItem">{Number(totalCurrentLiabilities)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem miniBoldItem underlineItem">{Number(totalCurrentLiabilities)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn boldItem">Working Capital</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem boldItem underlineItem">{Number(workingCapital)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem boldItem">{Number(workingCapital)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn miniBoldItem underlineItem">Longterm Liabilities</td>
                            <td className="incomeStatementTableItem">Nil</td>
                            <td className="incomeStatementTableItem">Nil</td>
                            <td className="incomeStatementTableItem underlineItem">Nil</td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn boldItem">Net Assets</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem boldItem underlineItem"></td>
                            <td className="incomeStatementTableItem boldItem underlineItem">{Number(workingCapital)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem boldItem underlineItem">FINANCED BY:</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>

                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Capital</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem">{Number(capital)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Capital Increases</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem">{Number(capitalIncreases)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 0}</td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Capital withdrawals</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem">({Number(capitalDrawings)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 0})</td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn">Net Result</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem underlineItem">{Number(netResult)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem"></td>
                        </tr>
                        <tr>
                            <td className="incomstatementElem incomeStatementTableItem firstColumn boldItem">Net Capital</td>
                            <td className="incomeStatementTableItem"></td>
                            <td className="incomeStatementTableItem boldItem underlineItem">{Number(netCapital)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            <td className="incomeStatementTableItem boldItem underlineItem">{Number(netCapital)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
    );
}

export default BalanceSheet;
