import React, {useState, useEffect, useRef, useContext} from 'react'
import {baseURL} from './axios'
import './AddProductForm.css'
import Alert from './Alert'
import {UserContext} from './userContext'

function AddProductForm({onClick, refetch}) {
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const wrapperRef = useRef()

    const [newProduct, setNewProduct] = useState({
        productName :'',
        description :'',
        sellingPrice : '',
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setNewProduct(prevValue =>{
            return {
                ...prevValue,
                [name] : value,
            }
        })
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            onClick()
        }
    }

    const productData = {
        userID : user.userID,
        productName : newProduct.productName,
        description : newProduct.description,
        sellingPrice : newProduct.sellingPrice === '' ? 0 : newProduct.sellingPrice,
    }

    const handleProductSubmit  = async ()=>{
        const {productName} = newProduct
        if (productName === '') {
            setAlertMessage('Please add a product name')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        } else {
            await baseURL.post('/product', productData, {
                headers : {
                    'auth-token' : user?.token
                }
            })
            onClick()
            refetch()
        }
    }

    return (
        <div className='AddProductForm' ref={wrapperRef}>
            <h2>Add A Product</h2>
            <div className="addProductContainer">
                <div className="productName">
                    <label htmlFor="productName">Name:</label>
                    <input type="text" name="productName" id="productName" onChange={handleChange} value={newProduct.productName}/>
                </div>

                <div className="description">
                    <label htmlFor="description">Description:</label>
                    <input type="text" name="description" id="description" onChange={handleChange} value={newProduct.description} />
                </div>

                <div className="up">
                    <label htmlFor="up">Selling Price:</label>
                    <input type="number" name="sellingPrice" id="up" onChange={handleChange} value={newProduct.sellingPrice} />
                </div>

                <div className="buttons">
                    <button className="btn" onClick={onClick}>Cancel</button>
                    <button className="btn" onClick={handleProductSubmit}>
                        Submit
                    </button>
                </div>
            </div>
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default AddProductForm
