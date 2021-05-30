import React, {useState, useEffect, useRef} from 'react'
import {baseURL} from './axios'
import './AddProductForm.css'

function UpdateProductForm({onClick, productName, description, handleProductSubmit, handleUpdate, sellingPrice}) {

    const wrapperRef = useRef()

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

    return (
        <div className='AddProductForm' ref={wrapperRef}>
            <h2>Add A Product</h2>
            <div className="addProductContainer">
                <div className="productName">
                    <label htmlFor="productName">Name:</label>
                    <input type="text" name="productName" id="productName" onChange={handleUpdate} value={productName}/>
                </div>

                <div className="description">
                    <label htmlFor="description">Description:</label>
                    <input type="text" name="description" id="description" onChange={handleUpdate} value={description} />
                </div>

                <div className="up">
                    <label htmlFor="up">sellingPrice:</label>
                    <input type="text" name="sellingPrice" id="up" onChange={handleUpdate} value={sellingPrice} />
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

export default UpdateProductForm
