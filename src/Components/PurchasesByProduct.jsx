import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import useFetch from '../customHooks/useFetch'
import {UserContext} from './userContext'
import Loader from './Loader'

function PurchasesByProduct() {
    const history = useHistory()

    const {user} = useContext(UserContext)

    const {data:products, loader} = useFetch('products', [])

    const pushRout = (route) => ()=>{
        history.push(`/inventories/${route}`)
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
                <p>Purchases By Product Report For The Year {new Date().getFullYear()}</p>
            </div>
            <div className="allDebtorsContainer">
                <table className="allDebtorsTable">
                    <thead>
                        <tr>
                            <th>Product #</th>
                            <th>Product Name</th>
                            <th>Units</th>
                            <th>Qty Bought</th>
                            <th>Available Stock</th>
                            <th>Av. Stock Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products?.map(product =>(
                                <tr onClick={pushRout(product._id)} key={product.id}>
                                    <td>{product?.number}</td>
                                    <td>{product?.name}</td>
                                    <td>{product?.units}</td>
                                    <td>{product?.stockSummary?.totalOrdered}</td>
                                    <td>{product?.stockSummary?.closingStock?.qty}</td>
                                    <td>{(Number(product?.stockSummary?.closingStock?.amount) / Number(product?.stockSummary?.closingStock?.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
                loader && <Loader />
            }
        </div>
    )
}

export default PurchasesByProduct
