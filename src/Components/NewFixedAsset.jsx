import React, {useState, useRef, useEffect} from 'react'
import Alert from './Alert';
import {baseURL} from './axios'
import './NewFixedAsset.css'

function NewFixedAsset({onClick}) {
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const today = new Date().toDateString()

    const [asset, setAsset] = useState({
        date : today,
        purchaseDate : '',
        ref : '',
        serialNumber : (asset)=>{
            const date = new Date().valueOf();
            const assetInitials = asset.match(/\b(\w)/g).join('').toUpperCase()

            return assetInitials.concat(date.toString())
        },
        assetName : '',
        depRate : '',
        supplier : '',
        residualValue: '',
        cash : '',
        mobileMoney : '',
        bank : '',
        credit : '',
        vat: '',
        netPayable: (cash, credit, mobileMoney, bank, vat)=>{
            const totalTE = Number(cash) + Number(credit) + Number(mobileMoney) + Number(bank)
            const vatAmount = totalTE * Number(vat)/100
            return  totalTE + vatAmount
        }
    })
    

    const handleChange = (e) => {
        const {name, value} = e.target

        setAsset(asset => {
            return {
                ...asset,
                [name] : value
            }
        })
    }

    
    

    const submitData = {
        date : asset.date,
        purchaseDate : asset.purchaseDate === '' ? asset.date : asset.purchaseDate,
        ref : asset.ref,
        serialNumber : asset.assetName === '' ? '' : asset.serialNumber(asset.assetName),
        assetName : asset.assetName,
        depRate : asset.depRate,
        supplier : asset.supplier,
        residualValue : asset.residualValue === '' ? 0 : Number(asset.residualValue),
        cash : asset.cash === '' ? 0 : Number(asset.cash),
        mobileMoney : asset.mobileMoney === '' ? 0 : Number(asset.mobileMoney),
        bank : asset.bank === '' ? 0 : Number(asset.bank),
        credit : asset.credit === '' ? 0 : Number(asset.credit),
        vat : asset.vat === '' ? 0 : Number(asset.vat),
        netPayable : asset.netPayable(asset.cash, asset.credit, asset.mobileMoney, asset.bank, asset.vat)
    }

    const handleSubmit = async () => {
        if (asset.assetName === '' || asset.depRate === '' || asset.supplier === '') {
            setAlertMessage('Please fill out fields marked with *')
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 3000)
        }else{
            if (asset.cash === '' && asset.bank === '' && asset.mobileMoney === '' && asset.credit === '') {
                setAlertMessage('Please fill in at least one payment mehod (cash, bank, mobile money, or credit)')
                setAlert(true)
                setTimeout(()=>{
                    setAlert(false)
                }, 3000)
            }else{
                await baseURL.post('/fixedAssets', submitData)
                .then( res=> {
                    onClick()
                })
            }
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
            onClick()
        }
    }



    return (
        <div className='NewFixedAsset' ref={wrapperRef}>
            <div className="close">
                <i className="fas fa-times fa-lg" onClick={onClick}></i>
            </div>
            <div className="assetFormContainer">
                <div className="date">
                    <label htmlFor="date">Date:</label>
                    <input type="text" name="date" id="date" readOnly={true} value={asset.date}/>
                </div>

                <div className="purchaseDate">
                    <label htmlFor="purchaseDate">Purchase Date:</label>
                    <input type="date" name="purchaseDate" id="purchaseDate" onChange={handleChange} value={asset.purchaseDate}/>
                </div>

                <div className="ref">
                    <label htmlFor="ref">Reference:</label>
                    <input type="text" name="ref" id="ref" onChange={handleChange} value={asset.ref}/>
                </div>

                <div className="serialNumber">
                    <label htmlFor="serialNumber">Serial Number:</label>
                    <input type="text" name="serialNumber" id="serialNumber" readOnly={true} value={asset.assetName === '' ? '' : asset.serialNumber(asset.assetName)}/>
                </div>

                <div className="assetName">
                    <label htmlFor="assetName">Name of Asset*:</label>
                    <input type="text" name="assetName" id="assetName" onChange={handleChange} value={asset.assetName}/>
                </div>

                <div className="depRate">
                    <label htmlFor="depRate">Depreciation Rate*:</label>
                    <input type="number" name="depRate" id="depRate" onChange={handleChange} value={asset.depRate}/>
                </div>

                <div className="supplier">
                    <label htmlFor="supplier">Supplier*:</label>
                    <input type="text" name="supplier" id="supplier" onChange={handleChange} value={asset.supplier}/>
                </div>
                <div className="residualValue">
                    <label htmlFor="residualValue">Residual Value:</label>
                    <input type="number" name="residualValue" id="residualValue" onChange={handleChange} value={asset.residualValue}/>
                </div>
            </div>
            <div className="payment">
                <h3>Payment</h3>
                <div className="paymentMethods">
                    <div className="cash">
                        <label htmlFor="cash">Cash:</label>
                        <input type="number" name="cash" id="cash" onChange={handleChange} value={asset.cash}/>
                    </div>

                    <div className="mobileMoney">
                        <label htmlFor="mobileMoney">Mobile Money:</label>
                        <input type="number" name="mobileMoney" id="mobileMoney" onChange={handleChange} value={asset.mobileMoney}/>
                    </div>

                    <div className="bank">
                        <label htmlFor="bank">Bank:</label>
                        <input type="number" name="bank" id="bank" onChange={handleChange} value={asset.bank}/>
                    </div>

                    <div className="credit">
                        <label htmlFor="credit">Credit:</label>
                        <input type="number" name="credit" id="credit" onChange={handleChange} value={asset.credit}/>
                    </div>

                    <div className="vat">
                        <label htmlFor="vat">VAT(%):</label>
                        <input type="number" name="vat" id="vat" onChange={handleChange} value={asset.vat}/>
                    </div>

                    <div className="credit">
                        <label htmlFor="netPayable">Net Payable:</label>
                        <input type="number" name="netPayable" id="netPayable" readOnly={true} value={asset.netPayable(asset.cash, asset.credit, asset.mobileMoney, asset.bank, asset.vat)}/>
                    </div>
                </div>
            </div>
            <div className="assetSubmitButtons">
                <button className="btn" onClick={onClick}>Cancel</button>
                <button className="btn" onClick={handleSubmit}>Save</button>
            </div>
            <Alert
                alert={alert}
                message={alertMessage}
            />
        </div>
    )
}

export default NewFixedAsset
