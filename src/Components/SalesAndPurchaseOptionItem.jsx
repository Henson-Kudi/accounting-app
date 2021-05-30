import React from 'react'

function SalesAndPurchaseOptionItem({fontawesome, title, onClick}) {
    return (
        <div className="SalesOptionsItem" onClick={onClick}>
                {fontawesome}
            <p>{title}</p>
            </div>
    )
}

export default SalesAndPurchaseOptionItem
