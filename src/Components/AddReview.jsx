import React, {useEffect, useState,useRef} from 'react'
import {baseURL} from './axios'
import './AddReview.css'
import Alert from './Alert'

function AddReview({onClick}) {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [review, setReview] = useState({})
    const handleChange = (e) =>{
        const {name, value} = e.target
        setReview(prevValue => (
            {
                ...prevValue,
                [name] : value
            }
        ))

    }

    const reviewData = {
        name: review.name,
        email: review.email,
        whatsApp: review.whatsApp,
        message: review.message
    }


    const submitReview = async()=>{
        const {name, message} = reviewData
        if (name !== undefined) {
            if(message === undefined){
                setAlertMessage('Please add at least your name and message')
                setAlert(true)
                setTimeout(()=>{
                    setAlert(false)
                }, 3000)
            }else{
                await baseURL.post('/reviews', reviewData)
                .then(res => {
                    onClick();
                })
            }
            
        } else {
            setAlertMessage('Please fill in name and message')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        }
    }

    const wrapperRef = useRef(null)

    useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside);

            return ()=>{
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }, [])

    function handleClickOutside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            onClick();
        }
    }


    return (
        <div className='AddReview' ref={wrapperRef}>
            <div className="reviewDetails">
                <div className="formControl">
                    <label htmlFor="name">Name: </label>
                    <input type="text" name="name" value={review.name} onChange={handleChange} placeholder="Please lemme know your name"/>
                </div>

                <div className="formControl">
                    <label htmlFor="email">Email: </label>
                    <input type="text" name="email" value={review.email} onChange={handleChange} placeholder="Let me reach out to you"/>
                </div>

                <div className="formControl">
                    <label htmlFor="whatsApp">WhatsApp: </label>
                    <input type="text" name="whatsApp" value={review.whatsApp} onChange={handleChange} placeholder="We can always stay connected if you dont mind"/>
                </div>

                <div className="formControl">
                    <label htmlFor="message"></label>
                    <textarea type="text" name="message" value={review.message} onChange={handleChange} placeholder="Your review is very important to me. Please recommend something" rows="4" cols="60"/>
                </div>
            </div>
            <div className="submitReviews">
                <button className="btn" onClick={onClick}>
                    Cancel
                </button>
                <button className="btn" onClick={submitReview}>
                    Submit
                </button>
            </div>
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default AddReview
