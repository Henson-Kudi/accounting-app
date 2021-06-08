import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { baseURL } from './axios'
import Loader from './Loader'
import './ReviewsPage.css'

function RiviewsPage() {
    const [reviews, setReviews] = useState([])
    const [fetching, setFetching] = useState(false)

    const fetchReviews = async(unMounted, source)=>{
        await baseURL.get('/reviews', {
            cancelToken: source.token
        })
        .then(res => {
            setReviews(res.data)
            setFetching(false)
        })
        .catch(err => {
            if (!unMounted) {
                if (axios.isCancel(err)) {
                    console.log('Request Cancelled');
                } else {
                    console.log('Something went wrong');
                }
            }
        })
    }

    useEffect(()=>{
        let unMounted = false;
        let source = axios.CancelToken.source();
        fetchReviews(unMounted, source)
    return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])


    return (
        <div className='ReviewsPage'>
            {
                !fetching &&
                <div className="reviewsData">
                    {
                        reviews?.map(item => (
                            <div className="reviewItem">
                                <p className="name itemDetailReview">
                                    {item.name}
                                </p>
                                <p className="email itemDetailReview">
                                    {item.email}
                                </p>
                                <p className="whatsApp itemDetailReview">
                                    {item.whatsApp}
                                </p>
                                <p className="message itemDetailReview">
                                    {(item.message)?.substring(0, 200)}
                                </p>
                            </div>
                        ))
                    }
                </div>
            }
            {
                fetching &&
                <Loader/>
            }
        </div>
    )
}

export default RiviewsPage
