import React, {useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import Loader from './Loader'
import './Shareholder.css'
import NewShareholder from './NewShareholder'
import Alert from './Alert'
function Shareholder() {
    const [fetching, setFetching] = useState(true)
    const [newShareholder, setNewShareholder] = useState(false)
    const [data, setData] = useState([])
    const {serialNumber} = useParams()
    const [alert, setAlert] =useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const fetchAssets = async(unMounted, source)=>{
            await baseURL.get(`/shareholders/${serialNumber}`, {
                cancelToken: source.token
            })
            .then(res => {
                setData(res.data)
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
        fetchAssets(unMounted, source)
    return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const fixedAssets = []
    
    data.forEach(item => {
        const elements = item.fixedAssets

        elements.forEach(item => {
            fixedAssets.push(item)
        });
    })

    return (
        <div className='Shareholder Invoices'>
            <div className="invoicesHeading">
                    <h1>Shareholder #{serialNumber}</h1>
                    <button className="invoiceButton" onClick={()=>{setNewShareholder(true)}}>New Shareholder</button>
            </div>
            {
                data.map(item => (
                    <div className="shareholderDetail profileDetails" key={item._id}>
                        <div className="personalDetail leftDetails">
                            <p><b><span>Date of Contribution:</span></b>{item.date}</p>
                            <p><b><span>Identification Number:</span></b>{item.serialNumber}</p>
                            <p><b><span>Shareholder Name:</span></b>{item.name}</p>
                            <p><b><span>Address:</span></b>{item.address}</p>
                            <p><b><span>Email:</span></b>{item.email}</p>
                            <p><b><span>Contact(tel):</span></b>{item.tel}</p>
                        </div>
                        <div className="accountInfos rightDetails">
                            <p><b><span>Total Contribution:</span></b>{(item.totalContribution).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p><b><span>Total Cash Contribution:</span></b>{(item.cash).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p><b><span>Total Bank Contribution:</span></b>{(item.bank).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p><b><span>Total Mobile Money Contribution:</span></b>{(item.mobileMoney).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                            <p><b><span>Total Fixed Asset Contribution:</span></b>{(item.fixedAssets.map(item => item.cost).reduce((a, b) => a + b, 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                    </div>
                ))
            }

            <div className="fixedAssetsDetails depSchedule">
                {
                    !fetching &&
                    <h3>Fixed asssets Details</h3>
                }
                <table>
                    {
                        !fetching &&
                        <thead>
                            <tr>
                                <th className='assetDetail'>Asset Name</th>
                                <th className='assetDetail'>Serial Number</th>
                                <th className='assetDetail'>Cost</th>
                                <th className='assetDetail'>Residual Value</th>
                                <th className='assetDetail'>Dep Rate (%)</th>
                                <th className='assetDetail'>Lifespan(Years)</th>
                            </tr>
                        </thead>
                    }
                    <tbody>
                        {
                            fixedAssets.map(asset => (
                                <tr key={asset._id}>
                                    <td className='assetDetail'><Link to={`/assets/${asset.serialNumber}`}>{asset.assetName}</Link></td>
                                    <td className='assetDetail'><Link to={`/assets/${asset.serialNumber}`}>{asset.serialNumber}</Link></td>
                                    <td className='assetDetail'>{(asset.cost)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    <td className='assetDetail'>{(asset.residualValue)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}</td>
                                    <td className='assetDetail'>{asset.depRate}</td>
                                    <td className='assetDetail'>{(100 / asset.depRate).toFixed(2)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                newShareholder &&
                <NewShareholder
                    onClick={()=>{setNewShareholder(false)}}
                    refetch={()=>{
                        setAlertMessage('Sahreholder Added Successfully')
                        setAlert(true)
                        setTimeout(() => {
                            setAlert(false)
                            setAlertMessage('')
                        }, 2000);
                    }}
                />
            }
            {
                fetching &&
                <Loader/>
            }
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default Shareholder
