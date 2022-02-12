import React, { useContext, useRef, useState } from 'react';
import uuid from 'react-uuid'
import useFetch from '../customHooks/useFetch';
import { UserContext } from "../customHooks/userContext";
import Loader from './Loader';
import Alert from './Alert'
import DeleteBox from './DeleteBox'
import useHandleChange from '../customHooks/useHandleChange'
import './OwnersEquity.css'
import { baseURL } from './axios';
import { set } from 'react-hook-form';



function OwnersEquity() {

  const wrapperRef = useRef()

  const {user} = useContext(UserContext)
  const {data: {capital, capTrans}, loader, setLoader, refetchData} = useFetch('capital', {})

  const {change : newCap, handleChange, setChange : setNewCap} = useHandleChange({
    id : uuid()
  })

  const [newCapStyle, setNewCapStyle] = useState({
    width: '0px',
    height: '0px',
    visibility: 'hidden',
  })

  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [deleteItem, setDeleteItem] = useState(false)

  const getTotal = (type) =>{
    return capTrans?.filter(cap => cap?.type === type).map(cap => (Number(cap?.amount?.cash) + Number(cap?.amount?.bank) + Number(cap?.amount?.momo))).reduce((acc, cap) => Number(acc) + Number(cap), 0)
  }

  const capAdditions = getTotal('addition') || 0
  const capDeductions = getTotal('withdrawal') || 0

  const withDrawCapital = ()=>{
    setNewCap(prev => ({
      ...prev,
      type : 'withdrawal',
      postType : 'submit'
    }))
    setNewCapStyle({
      width: 'max-content',
      height: 'max-content',
      visibility: 'visible',
    })
  }

  const addCapital = ()=>{
    setNewCap(prev => ({
      ...prev,
      type : 'addition',
      postType : 'submit'
    }))
    setNewCapStyle({
      width: 'max-content',
      height: 'max-content',
      visibility: 'visible',
    })
  }

  const cancelNewCap = ()=>{
    setNewCap({
      id : uuid(),
    })
    setNewCapStyle({
      width: '0px',
      height: '0px',
      visibility: 'hidden',
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      setLoader(true);
      const {data} = await baseURL.post('/capital', {
        ...newCap,
        date : new Date()
      }, {
        headers : {
          'auth-token' : user?.token,
        }
      })
      setAlertMessage(data.message)
      setAlert(true)
      setTimeout(() => {
        setAlertMessage('')
        setAlert(false)
      }, 2000);
    } catch (err) {
      setAlertMessage(err.message)
      setAlert(true)
      setTimeout(() => {
        setAlertMessage('')
        setAlert(false)
      }, 2000);
    }finally{
      refetchData()
      setLoader(false)
        setNewCap({
        id : uuid(),
      })
      e.target.reset()
      setNewCapStyle({
        width: '0px',
        height: '0px',
        visibility: 'hidden',
      })
    }
  }

  const handleUpdate = async (e)=>{
    e.preventDefault()
    try {
      setLoader(true)
      const {data} = await baseURL.put(`/capital/${newCap._id}`, newCap, {
        headers : {
          'auth-token' : user?.token
        }
      })
      setAlertMessage(data.message)
      setAlert(true)
      setTimeout(() => {
        setAlertMessage('')
        setAlert(false)
      }, 2000);
    } catch (err) {
      setAlertMessage(err.message)
      setAlert(true)
      setTimeout(() => {
        setAlertMessage('')
        setAlert(false)
      }, 2000);
    }finally{
      refetchData()
      setLoader(false)
        setNewCap({
        id : uuid(),
      })
      e.target.reset()
      setNewCapStyle({
        width: '0px',
        height: '0px',
        visibility: 'hidden',
      })
    }
  }

  const handlePost = (e)=>{
    switch (newCap.postType) {
      case 'update':
        handleUpdate(e)
        break;

      case 'submit':
        handleSubmit(e)
    
      default:
        break;
    }
  }
  
  const showUpdateForm = (data) => {
    setNewCap({
      ...data,
      cash : data.amount.cash,
      bank : data.amount.bank,
      momo : data.amount.momo,
      postType : 'update'
    })

    setNewCapStyle({
      width: 'max-content',
      height: 'max-content',
      visibility: 'visible',
    })
  }
  const showDeleteForm = (data) => {
    setDeleteItem(true)
    setNewCap({
      ...data,
      cash : data.amount.cash,
      bank : data.amount.bank,
      momo : data.amount.momo
    })
  }

  const handleDelete = async ()=>{
    try {
      setLoader(true)
      const {data} = await baseURL.delete(`/capital/${newCap._id}`, {
        headers : {
          'auth-token' : user?.token
        }
      })
      setAlertMessage(data.message)
      setAlert(true)
      setTimeout(() => {
        setAlertMessage('')
        setAlert(false)
      }, 2000);
    } catch (err) {
      setAlertMessage(err.message)
      setAlert(true)
      setTimeout(() => {
        setAlertMessage('')
        setAlert(false)
      }, 2000);
    }finally{
      refetchData()
      setLoader(false)
        setNewCap({
        id : uuid(),
      })
      setDeleteItem(false)
    }
  }

  // in the backend, create 2 schemas. One for capital account in order to show opening and closing balances of capital and another schema to show movements in capital. For each transactionposted (withdrawal or addition), we have to make sure to update capital account closing balances by its value.

  return (
    <div className='Invoices SingleReport'>
      <div className="reportInfos reportHeader">
        <div className="companyLogo" style={{
            backgroundImage : `url(${user?.logoURL})`
        }}></div>
        <div>
            <h1>{user?.companyName}</h1>
            <h2>Capital and Owners' Equity</h2>
        </div>
      </div>

      <div className="capitalSummaryCont">
        <div className="capitalSummary">
          <p className="capitalChanges openingCapital">
            <span className='title'>Opening Capital : </span>
            <span>{capital?.map(cap => (Number(cap?.openingBalance?.cash || 0) + Number(cap?.openingBalance?.bank || 0) + Number(cap?.openingBalance?.momo || 0)))?.reduce((acc, cap) => acc + cap, 0)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </p>

          <p className="capitalChanges">
            <span className='title'>Total Capital Additions : </span>
            <span>{Number(capAdditions)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </p>

          <p className="capitalChanges">
            <span className='title'>Total Capital Deductions : </span>
            <span>{Number(capDeductions)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </p>

          <p className="capitalChanges">
            <span className='title'> Net Capital In Account : </span>
            <span>{(Number(capital?.map(cap => (Number(cap?.closingBalance?.cash || 0) + Number(cap?.closingBalance?.bank || 0) + Number(cap?.closingBalance?.momo || 0)))?.reduce((acc, cap) => acc + cap, 0)) + (capAdditions - capDeductions))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </p>
        </div>

        <div className="newCapTransaction">
          <button className='capButton' onClick={withDrawCapital}>Withdraw Capital</button>
          <button className='capButton' onClick={addCapital}>Add Capital</button>
        </div>
      </div>

      <div className="allDebtorsContainer">
        <table className="allDebtorsTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Withdrawals</th>
              <th>Additions</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {
              capTrans?.map((cap, i) => {
                const openingBalance = capital?.map(item => (Number(item?.openingBalance?.cash) + Number(item?.openingBalance?.bank) + Number(item?.openingBalance?.momo)))?.reduce((acc, item) => acc + item, 0)

                  const elements = capTrans?.sort((a, b) => new Date(a?.createdAt) - new Date(b?.createdAt))?.slice(0, i+1)

                  const additions = elements?.filter(item => item?.type === 'addition').map(item => (Number(item?.amount?.cash) + Number(item?.amount?.bank) + Number(item?.amount?.momo))).reduce((a, b) => Number(a) + Number(b), 0)

                  const deductions = elements?.filter(item => item?.type === 'withdrawal').map(item => (Number(item?.amount?.cash) + Number(item?.amount?.bank) + Number(item?.amount?.momo))).reduce((a, b) => Number(a) + Number(b), 0)

                  const balance = openingBalance + additions - deductions

                return (<tr className='capOptionsCont'>
                  <td>{new Date(cap?.date).toLocaleDateString()}</td>
                  {/* <td className='capDescription'>{cap?.source}</td> */}
                  {/* <td>{cap?.type}</td> */}
                  <td className='capDescription'>{cap?.description}</td>
                  {/* <td>{cap.reason}</td> */}

                  <td>{cap?.type === 'withdrawal' ? (Number(cap?.amount?.cash || 0) + Number(cap?.amount?.bank || 0) + Number(cap?.amount?.momo || 0))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-'}</td>

                  <td>{cap?.type === 'addition' ? (Number(cap?.amount?.cash || 0) + Number(cap?.amount?.bank || 0) + Number(cap?.amount?.momo || 0))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-'}</td>

                  <td>{Number(balance)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>

                  <td className="capOptions">
                    <i className="fas fa-pen" onClick={()=>{showUpdateForm(cap)}}></i>
                    <i className="fas fa-trash" onClick={()=>{showDeleteForm(cap)}}></i>
                  </td>
                </tr>
              )})
            }
          </tbody>
        </table>
        {
          !capTrans?.length > 0 && <p>No data to display</p>
        }
      </div>
      {
        loader && <Loader/>
      }

      <div className="moreCapitalCont" ref={wrapperRef} style={newCapStyle}>
        <h2 className='capTitle'>{newCap?.type === 'withdrawal' ? 'Withdraw Capital' : 'Add Capital'}</h2>
        <form className="moreCapFormCont" onSubmit={handlePost}>
          <div className="capFormControl">
            <label htmlFor="description">Description</label>
            <input type="text" value={newCap.description} id="description" name="description" onChange={handleChange} className="capDesCription capOption" autoComplete='off' />
          </div>
          <p>Add Payments</p>
          <div className="capFormControl">
            <label htmlFor="cash">Cash Value</label>
            <input type="text" value={newCap.cash} id="cash" name="cash" onChange={(e)=>{
              if(isNaN(e.target.value)){
                window.alert('Invalid value entered')
                return e.target.value = ''
              }
              handleChange(e)
            }} className="capcash capOption" autoComplete='off' />
          </div>

          <div className="capFormControl">
            <label htmlFor="bank">Bank Value</label>
            <input type="text" value={newCap.bank} id="bank" name="bank" onChange={(e)=>{
              if(isNaN(e.target.value)){
                window.alert('Invalid value entered')
                return e.target.value = ''
              }
              handleChange(e)
            }} className="capbank capOption" autoComplete='off' />
          </div>

          <div className="capFormControl">
            <label htmlFor="momo">Mobile Money</label>
            <input type="text" value={newCap.momo} id="momo" name="momo" onChange={(e)=>{
              if(isNaN(e.target.value)){
                window.alert('Invalid value entered')
                return e.target.value = ''
              }
              handleChange(e)
            }} className="capmomo capOption" autoComplete='off' />
          </div>

          <div className="submitCap">
            <button className="capCancel capBtn" type='button' onClick={cancelNewCap}>Cancel</button><button className="capSubmit capBtn" type='submit'>Submit</button>
          </div>
        </form>
      </div>
      <Alert
        alert={alert}
        message = {alertMessage}
      />
      {
        deleteItem && <DeleteBox
          onClick={()=>{setDeleteItem(false)}}
          handleDelete={handleDelete}
        />
      }
    </div>
  );
}

export default OwnersEquity;
