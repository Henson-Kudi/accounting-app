import React, {useContext} from 'react'
import useFetch from '../customHooks/useFetch'
import {UserContext} from './userContext'
import Loader from './Loader'

function PurchasesBySupplier() {

    const {user} = useContext(UserContext)
    const today = new Date()

    const {data : suppliers, loader} = useFetch('suppliers', [])
    const {data : invoices} = useFetch('purchaseInvoices', [])
    const {data : receipts} = useFetch('purchaseReceipts', [])

    const salesData = invoices?.filter(inv => new Date(inv?.input?.date)?.getFullYear() === today.getFullYear())?.concat(receipts?.filter(rcp => new Date(rcp.input?.date)?.getFullYear() === today.getFullYear()))

    const sups = suppliers?.map(sup => {
        const filteredCustInvoices = salesData?.filter(item => item?.supplier?._id === sup?._id && item?.supplier?.id === sup?.id && item?.supplier?.number === sup?.number)

        const totalQty = filteredCustInvoices?.map(inv => inv?.products?.map(product => product?.qty)?.reduce((acc, product) => Number(acc) + Number(product), 0)).reduce((acc, product) => Number(acc) + Number(product), 0)

        const totalAmount = filteredCustInvoices?.map(inv => inv?.products?.map(product => (Number(product?.qty) * Number(product?.up)))?.reduce((acc, product) => Number(acc) + Number(product), 0)).reduce((acc, product) => Number(acc) + Number(product), 0)

        const invCount = filteredCustInvoices?.length

        return {
            ...sup,
            totalQty,
            totalAmount,
            invCount
        }
    })


    const styles = {
        padding : '5rem',
        display : 'grid',
        justifyContent : 'center',
        alignItems : 'center',
    }


    return (
        <div className='Invoices SingleReport'>
            <div className="reportOptions">
                <i className="fas fa-print fa-2x" onClick={()=>{
                    window.print()
                }}></i>
            </div>
            <div className="reportInfos reportHeader">
                <h1>{user?.companyName}</h1>
                <p>Purchases By Supplier Report For The Year {new Date().getFullYear()}</p>
            </div>
            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Supplier #</th>
                            <th>Supplier Name</th>
                            <th>Invoice Count</th>
                            <th>Qty Bought</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sups?.map(sup =>(
                                <tr key={sup?.id} className={sup?.invCount === 0 ? "noDisplay" : 'display'}>
                                    <td>{sup?.number}</td>
                                    <td>{sup?.displayName}</td>
                                    <td>{sup?.invCount}</td>
                                    <td>{Number(sup?.totalQty)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td>{Number(sup?.totalAmount)?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    suppliers?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                }
            </div>
            {
                loader && <Loader />
            }
        </div>
    )
}

export default PurchasesBySupplier
