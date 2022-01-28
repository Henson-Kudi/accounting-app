import React, { useContext } from 'react'
import useFetch from '../customHooks/useFetch'
import {UserContext} from './userContext'
import Loader from './Loader'

function StockSummaryReport() {
    const {user} = useContext(UserContext)

    const {data : products, loader} = useFetch('products', [])


    return (
        <div className='Invoices SingleReport'>
            <div className="reportOptions">
                <i className="fas fa-print fa-2x" onClick={()=>{
                    window.print()
                }}></i>
            </div>
            <div className="reportInfos reportHeader">
                <h1>{user?.companyName}</h1>
                <p>Stock Summary Report For The Year {new Date().getFullYear()}</p>
            </div>
            
            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Product #</th>
                            <th>Product Name</th>
                            <th>Units</th>
                            <th>Opening Stock</th>
                            <th>Total Sold</th>
                            <th>Total Bought</th>
                            <th>Closing Stock</th>
                            <th>Closing Stock Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products?.map(product => (
                                <tr key={product.id}>
                                    <td>{product?.number}</td>
                                    <td>{product?.name}</td>
                                    <td>{product?.units}</td>
                                    <td>{`${product?.stockSummary?.openingStock?.qty}${product?.units}`}</td>
                                    <td>{`${product?.stockSummary?.totalSold}${product?.units}`}</td>
                                    <td>{`${product?.stockSummary?.totalOrdered}${product?.units}`}</td>
                                    <td>{`${product?.stockSummary?.closingStock?.qty}${product?.units}`}</td>
                                    <td>{Number(product?.stockSummary?.closingStock?.amount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    products?.length === 0 && <div className="noData" style={{padding : '1rem'}}>No data to display</div>
                }
            </div>
            {
                loader && <Loader/>
            }
        </div>
    )
}

export default StockSummaryReport
