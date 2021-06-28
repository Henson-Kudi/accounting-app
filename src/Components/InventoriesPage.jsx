import React, {useEffect, useState, useRef}  from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import axios from 'axios'
import { baseURL } from './axios'
import './InventoriesPage.css'
import Loader from './Loader'
import AddProductForm from './AddProductForm'
import Invoice from './Invoice'
import Receipt from './Receipt'
import PurchaseInvoice from './PurchaseInvoice'
import UpdateProductForm from './UpdateProduct'
import DeleteBox from './DeleteBox'
import queryString from 'query-string'
import InventoryPage from './InventoryPage'
import Alert from './Alert'

function InventoriesPage() {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage]= useState('')

    const [fetching, setfetching] = useState(true)
    const [newProduct, setNewProduct] = useState(false)
    const [updateProduct, setUpdateProduct] = useState(false)
    const [transactionOptions, setTransactionOptions] = useState(false)
    const [invoice, setInvoice] = useState(false)
    const [receipt, setReceipt] = useState(false)
    const [purchaseInvoice, setPurchaseInvoice] = useState(false)
    const [deleteBox, setDeleteBox] = useState(false)

    const [products, setProducts] = useState([])
    const [entriesAndExits, setEntriesAndExits] = useState([])
    const [updateProductData, setUpdateProductData] = useState({
        productName: '',
        description: ''
    })

    const wrapperRef = useRef(null)
    const {search} = useLocation()
    const query = queryString.parse(search)
    console.log(query);
    const history = useHistory()
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e) {
        const { current: wrap } = wrapperRef;
        if (wrap && !wrap.contains(e.target)) {
            setTransactionOptions(false);
        }
    }

    useEffect(async() => {
        let unMounted = false;
        let source = axios.CancelToken.source();
        const request1 = baseURL.get('/products')
        const request2 = baseURL.get('/entriesAndExits')
        await axios.all([request1, request2], {
            cancelToken: source.token
        })
        .then(res => {
            const [result1, result2] = res
            setProducts(result1.data)
            setEntriesAndExits(result2.data)
            setfetching(false)
        })
        .catch(err =>{
            if (!unMounted) {
                if (axios.isCancel(err)) {
                console.log('Request Cancelled');
            }else{
                console.log('Something went wrong');
            }
            }
        })

        return ()=>{
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    // CODE BELOW SHOULD BE COPIED TO INVENTORY PAGE IN ORDER TO SHOW FREQUENTLY BOUGHT ITEMS
    const exits = entriesAndExits.filter(a => a.exitOrEntry === 'exit').map(a => a.productName)

    const entries = entriesAndExits.filter(a => a.exitOrEntry === 'entry').map(a => a.productName)

    var frequentlySold = exits;
    var s = frequentlySold.reduce(function(m,v){
    m[v] = (m[v]||0)+1; return m;
    }, {}); // builds {2: 4, 4: 2, 6: 3} 
    var mostSold = [];
    for (let k in s) mostSold.push({k:k,n:s[k]});
    // now we have [{"k":"2","n":4},{"k":"4","n":2},{"k":"6","n":3}] 
    mostSold.sort(function(a,b){ return b.n-a.n });
    const mostSoldElements = mostSold.map(function(a) { return a.k }).slice(0,5);

    var frequentlyBought = entries;
    var s = frequentlyBought.reduce(function(m,v){
    m[v] = (m[v]||0)+1; return m;
    }, {}); // builds {2: 4, 4: 2, 6: 3} 
    var mostBought = [];
    for (let k in s) mostBought.push({k:k,n:s[k]});
    // now we have [{"k":"2","n":4},{"k":"4","n":2},{"k":"6","n":3}] 
    mostBought.sort(function(a,b){ return b.n-a.n });
    const mostBoughtElements = mostBought.map(function(a) { return a.k }).slice(0,5);

    const showUpdateProduct = (item)=>{
        setUpdateProductData(item)
        setUpdateProduct(true)
    }

    const showDeleteBox = (item)=>{
        setUpdateProductData(item)
        setDeleteBox(true)
    }

    const handleDeleteItem = async()=>{
        await baseURL.put('/deleteProduct', updateProductData)
        .then(res => {
            setProducts(res.data)
            setAlertMessage('Product Deleted Successfully')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
                setAlertMessage('')
            }, 2000)
        })
    }
                        

    const handleProductUpdate = (e) => {
        const {name, value} = e.target
        setUpdateProductData(prevValue =>{
            return {
                ...prevValue,
                [name] : value,
            }
        })
    }

    const handleProductSubmit  = async ()=>{
        await baseURL.put('/product', updateProductData)
        .then(res => setProducts(res.data))
        setUpdateProduct(false)
        setAlertMessage('Product Updated Successfully')
        setAlert(true)
        setTimeout(()=>{
            setAlert(false)
            setAlertMessage('')
        }, 2000)
    }



    return (
        <div className='InventoryPage'>
            {
            search === '' ? 
            <div>
                <div className="Invoices">
                <div className="invoicesHeading">
                    <h1>Inventories</h1>
                    <button className="invoiceButton" onClick={()=>{setNewProduct(true)}}>New Product</button>
                </div>
                <div className="products allDebtorsContainer">
                    <table className='allDebtorsTable'>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products?.map(pdt => (
                                    <tr className='inventoryList invoiceDetail'>
                                        <td className='inventoryItem' onClick={()=>{history.push(`/inventories?id=${pdt._id}&name=${pdt.productName}`)}}>{pdt.productName}
                                        </td>

                                        <td className='inventoryItem' onClick={()=>{history.push(`/inventories?id=${pdt._id}&name=${pdt.productName}`)}}>{pdt.description}</td>

                                        <td className='inventoryItem upDateOptions'>
                                            <i className="fas fa-pen" onClick={()=>{
                                                showUpdateProduct(pdt)
                                            }}></i>
                                            <i className="fas fa-trash" onClick={()=>{
                                                showDeleteBox(pdt)
                                            }}></i>
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            


            {
                fetching &&
                <Loader/>
            }
            {
                newProduct &&
                <AddProductForm
                    onClick={()=>{setNewProduct(false)}}
                    refetch={()=>{
                        setAlertMessage('Product Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000)
                    }}
                />
            }
            {
                invoice &&
                <Invoice
                    onClick={() => {setInvoice(false)}}
                    refetch={()=>{
                        setAlertMessage('Sales Incoice Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000)
                    }}
                />
            }
            {
                receipt &&
                <Receipt
                    onClick={() => {setReceipt(false)}}
                    refetch={()=>{
                        setAlertMessage('Sales Receipt Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000)
                    }}
                />
            }
            {
                purchaseInvoice &&
                <PurchaseInvoice
                onClick={() => {setPurchaseInvoice(false)}}
                refetch={()=>{
                        setAlertMessage('Purchase Invoice Added Successfully')
                        setAlert(true)
                        setTimeout(()=>{
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000)
                    }}
                />
            }

            {
                updateProduct &&
                <UpdateProductForm
                    onClick={()=>{setUpdateProduct(false)}}
                    productName={updateProductData.productName}
                    description={updateProductData.description}
                    sellingPrice={updateProductData.sellingPrice}
                    handleProductSubmit={handleProductSubmit}
                    handleUpdate={handleProductUpdate}
                />
            }

            {
                deleteBox &&
                <DeleteBox
                    onClick={()=>{setDeleteBox(false)}}
                    handleDelete={()=>{
                        handleDeleteItem()
                    }}
                />
            } 
            </div>: 
            <InventoryPage
                productId={query.id}
                productName={query.name}
            />
            }
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default InventoriesPage
