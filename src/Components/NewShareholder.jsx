import React, {useState, useEffect, useRef} from 'react'
import { baseURL } from './axios'
import {shareHolderFixedAssetTemplate} from './data'
import './NewShareholder.css'

function NewShareholder({onClick}) {
    const wrapperRef = useRef()
    const [height, setHeight] = useState(8);
    const realVal = height > 22 ? "100%" : `${height}rem`;
    const [data, setData] = useState(shareHolderFixedAssetTemplate)
    const [shareholderInput, setShareholderInput] = useState({
        date: new Date().toDateString(),
        name: '',
        email : '',
        address : '',
        tel : '',
        serialNumber : (shareholder)=>{
            const date = new Date().valueOf();
            const shareholderInitials = shareholder.match(/\b(\w)/g).join('').toUpperCase()

            return shareholderInitials.concat(date.toString())
        },
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

    const elements = data.filter(ele => ele.assetName !== '' && ele.cost !== '' && ele.depRate !== '')

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
            date: shareholderInput.date,
            name: shareholderInput.name,
            email : shareholderInput.email,
            address : shareholderInput.address,
            tel : shareholderInput.tel,
            serialNumber : shareholderInput.name === '' ? '' : shareholderInput.serialNumber(shareholderInput.name),
            cash: shareholderInput.cash === '' ? 0 : Number(shareholderInput.cash),
            bank: shareholderInput.bank === '' ? 0 : Number(shareholderInput.bank),
            mobileMoney: shareholderInput.mobileMoney === '' ? 0 : Number(shareholderInput.mobileMoney),
            totalContribution: totalContribution,
            fixedAssets: elements
        }

        const handleSubmit = async()=>{
            if (shareholderInput.name === '') {
                alert('Please add shareholderName')
            }else{
                if (shareholderInput.cash === '' && shareholderInput.bank === '' && shareholderInput.mobileMoney === '' && elements === [] ) {
                    alert('please input at least one contribution means')
                }
                baseURL.post('/shareholders', submitData)
                .then(res =>{
                    onClick()
                })
            }
        }




    return (
        <div className="NewShareholder" ref={wrapperRef}>
            <h3>New Shareholder</h3>
            <div className="detail">
                <div className="date">
                    <label htmlFor="date">Date</label>
                    <input type="text" name='date' value={shareholderInput.date} readOnly={true} />
                </div>
                <div className="name">
                    <label htmlFor="name">Shareholder Name</label>
                    <input type="text" name='name' value={shareholderInput.name} onChange={handleChange} />
                </div>
                <div className="serialNumber">
                    <label htmlFor="serialNumber">Serial Number</label>
                    <input type="text" name='serialNumber' value={shareholderInput.name === '' ? '' : shareholderInput.serialNumber(shareholderInput.name)} readOnly={true} />
                </div>
            </div>
            <div className="detail">
                <div className="email">
                    <label htmlFor="email">E-mail</label>
                    <input type="text" name='email' value={shareholderInput.email} onChange={handleChange} />
                </div>
                <div className="address">
                    <label htmlFor="Address">Address</label>
                    <input type="text" name='address' value={shareholderInput.address} onChange={handleChange} />
                </div>
                <div className="tel">
                    <label htmlFor="tel">Telephone</label>
                    <input type="text" name='tel' value={shareholderInput.tel} onChange={handleChange} />
                </div>
            </div>

            <div className="contribution">
                <h3>Contribution by:</h3>
                <div className="cashContributions">
                    <div className="mobileMoney">
                        <label htmlFor="mobileMoney">Mobile Money</label>
                        <input type="text" name='mobileMoney' value={shareholderInput.mobileMoney} onChange={handleChange} />
                    </div>
                    <div className="cash">
                        <label htmlFor="cash">Cash</label>
                        <input type="text" name='cash' value={shareholderInput.cash} onChange={handleChange} />
                    </div>
                    <div className="bank">
                        <label htmlFor="bank">Bank</label>
                        <input type="text" name='bank' value={shareholderInput.bank} onChange={handleChange} />
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
                                        <input type="text" name="cost" value={holder.cost} onChange={updateFieldChanged('cost', index)}/>
                                    </td>
                                    <td>
                                        <input name="residualValue" value={holder.residualValue} onChange={updateFieldChanged("residualValue", index)}>
                                        </input>
                                    </td>

                                    <td>
                                        <input name="depRate" value={holder.depRate} onChange={updateFieldChanged("depRate", index)}>
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
                                alert('Cannot add more rows.')
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
        </div>
    )
}

export default NewShareholder
