import React, {useRef, useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import {baseURL} from './axios'
import './FixedAsset.css'
import NewFixedAsset from './NewFixedAsset'
import Loader from './Loader'
import Alert from './Alert'
import {UserContext} from '../customHooks/userContext'

function FixedAsset() {
    const [alert, setAlert] =useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [newAsset, setNewAsset] = useState(false)
    const [fetching, setFetching] = useState(true)
    const {serialNumber} = useParams()
    const [assetInfos, setAssetInfos] = useState([])
    const {user} = useContext(UserContext)

    useEffect(()=>{
        let unMounted = false;
        let source = axios.CancelToken.source();
        fetchAssets(unMounted, source)
    return () => {
            unMounted = true;
            source.cancel('Cancelling request')
        }
    }, [])

    const fetchAssets = async(unMounted, source)=>{
        await baseURL.get(`/fixedAssets/${serialNumber}`, {
            cancelToken: source.token,
            headers:{
                'auth-token': user?.token
            }
        })
        .then(res => {
            setAssetInfos(res.data)
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

    const today = new Date()
    const thisYear = today.getFullYear()

    let depInfos = []
    assetInfos.forEach(asset => {
        const element = asset.depInfos

        element.forEach(item => {
            depInfos.push(item)
        })
    })



    return (
        <div className='FixedAsset Invoices'>
            <div className="invoicesHeading">
                <h1>Asset #{serialNumber}</h1>
                <button className="invoiceButton" onClick={()=>{setNewAsset(true)}}>New Asset</button>
            </div>
                {
                    assetInfos.map(asset => (
                        <div className="assetInfos">
                            <div className="leftCorner">
                                <p><b>Purchase Date:</b> <span>{asset.asset.purchaseDate}</span></p>
                                <p><b>Asset Name:</b> <span>{asset.asset.assetName}</span></p>
                                <p><b>Ref Number:</b> <span>{asset.asset.ref}</span></p>
                                <p><b>Serial Number:</b> <span>{asset.asset.serialNumber}</span></p>
                            </div>

                            <div className="rightCorner">
                                <p><b>Dep Rate:</b> <span>{(asset.asset.depRate).toFixed(2)}%</span></p>
                                <p><b>Life Span:</b> <span>{((100/(asset.asset.depRate)).toFixed(1)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} year(s)</span></p>
                                <p><b>Original Value:</b> <span>{(Number(asset.asset.cost)?.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                <p><b>Residual Value:</b> <span>{(Number(asset.asset.residualValue).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                            </div>
                        </div>
                    ))
                }

                <div className="depSchedule">
                    <h3>Depreciation Schedule</h3>
                    <table>
                        <thead>
                            <tr>
                                <th className='assetDetail'>Years</th>
                                <th className='assetDetail'>Dep Of Year</th>
                                <th className='assetDetail'>Acc Dep <small>(Prev Year)</small></th>
                                <th className='assetDetail'>Acc Dep <small>(Current Year)</small></th>
                                <th className='assetDetail'>Book Value <small>(Current Year)</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                depInfos.map(item => (
                                    <tr className={item.year === thisYear ? 'assetDetailParentSelected' : 'assetDetailParent'}>
                                        <td className='assetDetail'>{item.year}</td>
                                        <td className='assetDetail'>{(item.endOfYearDep.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='assetDetail'>{(item.previousAccDep.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='assetDetail'>{(item.accDep.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                        <td className='assetDetail'>{(item.nbv.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>



            {
                newAsset &&
                <NewFixedAsset
                    onClick={()=>{setNewAsset(false)}}
                    refetch={()=>{
                        setAlertMessage('Fixed Asset Added Successfully')
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
                cancelAlert={()=>{setAlert(false)}}
                message={alertMessage}
            />
        </div>
    )
}

export default FixedAsset
