import React, {useState, useEffect, useRef, useContext} from 'react'
import Alert from './Alert'
import { baseURL } from './axios'
import './NewShareholder.css'
import {UserContext} from '../customHooks/userContext'

function IncreaseCapital({onClick, refetch, requiredData}) {
    const {user} = useContext(UserContext)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const wrapperRef = useRef()
    const [height, setHeight] = useState(8);
    const realVal = height > 22 ? "100%" : `${height}rem`;
    const [data, setData] = useState([{}])
    const [shareholderInput, setShareholderInput] = useState({
        date: new Date().toDateString(),
        cash: '',
        bank: '',
        mobileMoney:''
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setShareholderInput(prevValue =>(
            {
                ...prevValue,
                [name] : value
            }
        ))
    }

    const updateFieldChanged = (name, index) => (event) => {
        let newArr = data.map((item, i) => {
        if (index === i) {
            return { ...item, [name]: event.target.value };
        } else {
            return item;
        }
        });
        setData(newArr);
    };

    const serialNumber  = (asset)=>{
        const date = new Date().valueOf();
        const assetInitials = asset.match(/\b(\w)/g).join('').toUpperCase()

        return assetInitials.concat(date.toString())
    }

    const elements = data.filter(ele => ele.assetName !== '' && ele.cost !== '' && ele.depRate !== '').map(item => ({
        ...item,
        serialNumber: serialNumber(item.assetName)
    }))


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
        const item = elements?.map(element => Number(element.cost )).reduce((a, b) => a + b, 0)
        const totalContribution = item + (shareholderInput.cash === '' ? 0 : Number(shareholderInput.cash)) + (shareholderInput.bank === '' ? 0 : Number(shareholderInput.bank)) + (shareholderInput.mobileMoney === '' ? 0 : Number(shareholderInput.mobileMoney))

        const submitData = {
            userID : user.userID,
            date: shareholderInput.date,
            name: requiredData?.name,
            email : requiredData?.email,
            address : requiredData?.address,
            tel : requiredData?.tel,
            serialNumber : requiredData?.serialNumber,
            cash: shareholderInput.cash === '' ? 0 : Number(shareholderInput.cash),
            bank: shareholderInput.bank === '' ? 0 : Number(shareholderInput.bank),
            mobileMoney: shareholderInput.mobileMoney === '' ? 0 : Number(shareholderInput.mobileMoney),
            totalContribution: totalContribution,
            fixedAssets: elements,
        }

        const handleSubmit = async()=>{
            if (shareholderInput.name === '') {
                setAlertMessage("Please add shareholder's name")
                setAlert(true)
                setTimeout(()=>{
                    setAlert(false)
                }, 3000)
            }else{
                if (shareholderInput.cash === '' && shareholderInput.bank === '' && shareholderInput.mobileMoney === '' && elements.length === 0 ) {
                    setAlertMessage('please input at least one contribution means')
                    setAlert(true)
                    setTimeout(()=>{
                        setAlert(false)
                    }, 3000)
                }else{
                    await baseURL.post('/shareholders/updateCapital', submitData, {
                        headers: {
                            'auth-token' : user?.token
                        }
                    })
                    .then(res =>{
                        onClick()
                        refetch()
                    })
                }
            }
        }




    return (
        <div className="NewShareholder" ref={wrapperRef}>
            <h3>Capital Increase</h3>
            <div className="detail">
                <div className="date">
                    <label htmlFor="date">Date</label>
                    <input type="text" name='date' value={shareholderInput.date} readOnly={true} />
                </div>
            </div>

            <div className="contribution">
                <h3>Contribution by:</h3>
                <div className="cashContributions">
                    <div className="mobileMoney">
                        <label htmlFor="mobileMoney">Mobile Money</label>
                        <input type="number" name='mobileMoney' value={shareholderInput.mobileMoney} onChange={handleChange} />
                    </div>
                    <div className="cash">
                        <label htmlFor="cash">Cash</label>
                        <input type="number" name='cash' value={shareholderInput.cash} onChange={handleChange} />
                    </div>
                    <div className="bank">
                        <label htmlFor="bank">Bank</label>
                        <input type="number" name='bank' value={shareholderInput.bank} onChange={handleChange} />
                    </div>
                </div>
                <h3>Fixed Asset Contributions</h3>
                <div className="fixedAssetContributions" style={{
                            height: `${realVal}`,
                            overflow: "hidden"
                            }}>
                    <table>
                    <thead>
                        <tr className='invoiceListHead'>
                            <th>Asset Name</th>
                            <th>Cost</th>
                            <th>Residual Value</th>
                            <th>Dep Rate (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((holder,index) =>(
                                <tr className='invoiceLisBody' key={index}>
                                    <td>
                                        <input type="text" name='assetName' value={holder.assetName} onChange={updateFieldChanged("assetName", index)} />
                                    </td>
                                    <td>
                                        <input type="number" name="cost" value={holder.cost} onChange={updateFieldChanged('cost', index)}/>
                                    </td>
                                    <td>
                                        <input 
                                        type='number' name="residualValue" value={holder.residualValue} onChange={updateFieldChanged("residualValue", index)}>
                                        </input>
                                    </td>

                                    <td>
                                        <input type='number' name="depRate" value={holder.depRate} onChange={updateFieldChanged("depRate", index)}>
                                        </input>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                </div>
            </div>
            <div className="expButtons">
                    <button
                            onClick={() => {
                            setHeight((prev) => {
                                return prev + 4;
                            });
                            if(realVal ==='100%'){
                                setAlert(true)
                                setAlertMessage('Cannot add more rows.')
                                setTimeout(()=>{
                                    setAlert(false)
                                    setAlertMessage('')
                                }, 3000)
                            }
                            }}
                            type="button" className='addRows btn'>
                            Add Rows
                        </button>
                        <div className="saveOptions">
                            <button
                                onClick={onClick}
                                type="button" className='addRows btn'>
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                type="button" className='addRows btn'>
                                Save
                            </button>
                        </div>
                </div>
                <Alert
                    message={alertMessage}
                    cancelAlert={()=>{setAlert(false)}}
                    alert={alert}
                />
        </div>
    )
}

export default IncreaseCapital
