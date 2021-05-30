import React, {useState, useEffect, useRef} from 'react'
import {baseURL} from './axios'
import './AddProductForm.css'

function AddProductForm({onClick}) {

    const wrapperRef = useRef()

    const [newProduct, setNewProduct] = useState({})

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

    const handleProductSubmit  = async ()=>{
        await baseURL.post('/product', newProduct)
        onClick()
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
                    <input type="text" name="sellingPrice" id="up" onChange={handleChange} value={newProduct.sellingPrice} />
                </div>

                <div className="buttons">
                    <button className="btn" onClick={onClick}>Cancel</button>
                    <button className="btn" onClick={handleProductSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddProductForm
