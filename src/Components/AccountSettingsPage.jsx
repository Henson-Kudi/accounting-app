import React from 'react';
import {useHistory} from 'react-router-dom'

function AccountSettingsPage() {
    const history = useHistory()
  return <div className='Invoices'>
      <p>
          Sorry, this page is under maintenance. Thank you for trusting.
      </p>
      <button className="goBack" style={{
          backgroundColor : 'var(--main-bgc)',
          borderRadius: '0.5rem',
          border : 'none',
          color : '#ffffff',
          padding : '1rem',
          marginTop : '1rem',
      }} onClick={history.goBack}>Go Back</button>
  </div>;
}

export default AccountSettingsPage;
