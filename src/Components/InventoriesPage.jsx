import React, {useEffect, useState, useRef, useContext}  from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import './InventoriesPage.css'
import Loader from './Loader'
import useFetch from '../customHooks/useFetch'

function InventoriesPage() {

    const {data:products, loader} = useFetch('products', [])

    const history = useHistory()

    // CODE BELOW SHOULD BE COPIED TO INVENTORY PAGE IN ORDER TO SHOW FREQUENTLY BOUGHT ITEMS
    // const exits = []

    // const entries = []

    // var frequentlySold = exits;
    // var s = frequentlySold.reduce(function(m,v){
    // m[v] = (m[v]||0)+1; return m;
    // }, {}); // builds {2: 4, 4: 2, 6: 3} 
    // var mostSold = [];
    // for (let k in s) mostSold.push({k:k,n:s[k]});
    // // now we have [{"k":"2","n":4},{"k":"4","n":2},{"k":"6","n":3}] 
    // mostSold.sort(function(a,b){ return b.n-a.n });
    // const mostSoldElements = mostSold.map(function(a) { return a.k }).slice(0,5);

    // var frequentlyBought = entries;
    // var s = frequentlyBought.reduce(function(m,v){
    // m[v] = (m[v]||0)+1; return m;
    // }, {}); // builds {2: 4, 4: 2, 6: 3} 
    // var mostBought = [];
    // for (let k in s) mostBought.push({k:k,n:s[k]});
    // // now we have [{"k":"2","n":4},{"k":"4","n":2},{"k":"6","n":3}] 
    // mostBought.sort(function(a,b){ return b.n-a.n });
    // const mostBoughtElements = mostBought.map(function(a) { return a.k }).slice(0,5);

    return (
        <div className="Invoices">
            <div className="invoicesHeading invoicesHeadingCont">
                <h1>Inventories</h1>
                <button className="invoiceButton" onClick={()=>{history.push('/products/new-product')}}>New Product</button>
            </div>
            <div className="products allDebtorsContainer">
                <table className='allDebtorsTable'>
                    <thead>
                        <tr>
                            <th>Product Number</th>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Units</th>
                            <th>
                                <div>Opening Stock</div>
                                <div className='inventoryStockDes'>
                                    <p>Qty</p>
                                    <p>Amount</p>
                                </div>
                            </th>
                            <th>
                                <div>Closing Stock</div>
                                <div className='inventoryStockDes'>
                                    <p>Qty</p>
                                    <p>Amount</p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products?.map(pdt => (
                                <tr className='inventoryList invoiceDetail' onClick={()=>{history.push(`/inventories/${pdt._id}`)}}>

                                    <td className='inventoryItem'>Pdt #{pdt?.number}
                                    </td>

                                    <td className='inventoryItem'>{pdt?.name?.substring(0, 20)}
                                    </td>

                                    <td className='inventoryItem'>{pdt?.description?.substring(0, 20)}</td>

                                    <td className='inventoryItem'>{pdt?.units}</td>

                                    <td className='inventoryItem'>
                                            <div className='inventoryStockDes'>
                                                <p style={{textAlign: 'center'}}>{pdt?.stockSummary?.openingStock?.qty}</p>
                                                <p style={{textAlign: 'center'}}>{pdt?.stockSummary?.openingStock?.amount}</p>
                                            </div>
                                    </td>

                                    <td className='inventoryItem'>
                                            <div className='inventoryStockDes'>
                                                <p style={{textAlign: 'center'}}>{pdt?.stockSummary?.closingStock?.qty}</p>
                                                <p style={{textAlign: 'center'}}>{pdt?.stockSummary?.closingStock?.amount}</p>
                                            </div>
                                    </td>

                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                loader &&<Loader/>
            }
        </div>
    )
}

export default InventoriesPage
