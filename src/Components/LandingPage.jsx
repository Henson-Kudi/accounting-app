import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import logo from '../images/logo1.jpg'
import dashboard from '../images/dashboard.png'
import responsiveDesign from '../images/responsive-design.png'
import './LandingPage.css'

function LandingPage() {
    const history = useHistory()
    const thisYear = new Date().getFullYear()

    const mainPageStyles = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        display: 'grid',
        alignItems: 'center',
        zIndex: '5',
        backgroundColor: 'white'
    }

    return (
        <div className='LandingPage' id='home'>
            <nav className="HomeNav">
                <div className="logoContainer">
                    <img src={logo} alt="Logo" />
                </div>

                <ul className="navListItems">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#pricingPlans">Pricing</a></li>
                    <li><a href="#accessAnyWhere">Features</a></li>
                    <li><Link to='/contact-us'>Contact Us</Link></li>
                </ul>

                <div className="loginAndRegister">
                    <span><Link to='/login'>Login</Link></span>
                    <span><Link to='/register'>Register</Link></span>
                </div>
            </nav>
            <div className='mainPageHome'>
                <div className="contentContainer">
                    <h1>@HK Solutions Ltd</h1>
                    <p className='headingCaption'>Simplified accounting solution for everyone.</p>
                    <p className='contentText'>
                        Inventory management has always been a bottleneck for most entities. Manage your inventory, get up to date customer reports, sales reports and end of year financial reports in one centralized, easyu to use accounting system.
                    </p>
                    <div className="callToAction">
                        <button className='CTAButton' onClick={()=>{history.push('/register')}}>Get Started</button>
                        <button className='CTAButton' onClick={()=>{history.push('/contact-us')}}>Contact Us</button>
                    </div>
                </div>
                <div className="imageContainer">
                    <img src={dashboard} alt="dashboard sample" />
                </div>
            </div>

            <div className="accessAnyWhereContainer" id="accessAnyWhere">
                <div className='mainPageHome accessAnywhere'>
                    <div className="imageContainer responsiveImage">
                        <img src={responsiveDesign} alt="dashboard sample" />
                    </div>
                    <div className="contentContaine">
                        <h1>Access your account information, reports and every transaction on any device, at anytime, no matter where you are.</h1>
                    </div>
                    
                </div>
            </div>

            <div className="pricingPlans" id="pricingPlans">
                <h2>Select a plan lets get started</h2>
                <div className="pricingPlansContainer">
                    <div className="basicPlan planItem">
                        <h3 className='planHeading'>Basic Plan</h3>
                        <p className='planPrice'>PRICE : <span>FREE</span></p>
                        <p>What you get:</p>
                        <ul className='planFeatures'>
                            <li>1 user (Admin)</li>
                            <li>Inventory Management</li>
                            <li>End of Year financial reports</li>
                            <li>Manage Invoices, Receipts and more</li>
                        </ul>
                        <span className="selectPlan" onClick={()=>{history.push('/register')}}>Select Plan</span>
                    </div>

                    <div className="standardPlan planItem">
                        <h3 className='planHeading'>Standard Plan</h3>
                        <p className='planPrice'>PRICE : <span>NA</span></p>
                        <p>What you get:</p>
                        <ul className='planFeatures'>
                            <li>2 users (Admin & frontend user)</li>
                            <li>Inventory Management</li>
                            <li>End of Year financial reports</li>
                            <li>Manage Invoices, Receipts and more</li>
                            <li>VAT and other taxes management</li>
                        </ul>
                        <span className="selectPlan notAvaliable" onClick={()=>{alert('Plan not available for now')}}>Select Plan</span>
                    </div>

                    <div className="premiumPlan planItem">
                        <h3 className='planHeading'>Premium Plan</h3>
                        <p className='planPrice'>PRICE : <span>NA</span></p>
                        <p>What you get:</p>
                        <ul className='planFeatures'>
                            <li>6 users (Admin, accountant module, HRM module, 3 frontend users)</li>
                            <li>Inventory Management</li>
                            <li>End of Year financial reports</li>
                            <li>Manage Invoices, Receipts and more</li>
                            <li>VAT and other taxes management</li>
                            <li>Employees management</li>
                        </ul>
                        <span className="selectPlan notAvaliable" onClick={()=>{alert('Plan not available for now')}}>Select Plan</span>
                    </div>

                    <div className="goldPlan planItem">
                        <h3 className='planHeading'>Gold Plan</h3>
                        <p className='planPrice'>PRICE : <span>NA</span></p>
                        <p>What you get:</p>
                        <ul className='planFeatures'>
                            <li>Unlimited frontend users (1 Admin module, 1 accountant module, HRM module,)</li>
                            <li>Inventory Management</li>
                            <li>End of Year financial reports</li>
                            <li>Manage Invoices, Receipts and more</li>
                            <li>VAT and other taxes management</li>
                            <li>Employees management</li>
                            <li>E-commerce Integration</li>
                        </ul>
                        <span className="selectPlan notAvaliable" onClick={()=>{alert('Plan not available for now')}}>Select Plan</span>
                    </div>
                </div>
            </div>

            <div className="footerContainer" id='footerContainer'>
                <div className="footer">
                    <div className="companyDetails footGridItem">
                        <p className='footerHeading'>Address</p>
                        <p>Al Salam Street,</p>
                        <p>Delma Park,</p>
                        <p>Al Nayhan,</p>
                        <p>Abu Dhabi</p>
                        <p>United Arab Emirates</p>
                    </div>

                    <div className="companyDetails footGridItem">
                        <p>Privacy Policy</p>
                        <p>Report an Issue</p>
                        <p>About Us</p>
                    </div>

                    <div className="socalMedia footGridItem">
                        <p className='footerHeading'>Follow Us On Social Media</p>
                        <a href='https://www.facebook.com/' target='_blank'><p className='mediaIcon'><i className="fab fa-facebook"></i><span className='fab'>Facebook</span></p></a>
                        <a href="https://twitter.com/home?lang=en" target='_blank'><p className='mediaIcon'><i className="fab fa-twitter"></i><span className='fab'>Twitter</span></p></a>
                        <a href="https://www.instagram.com/" target='_blank'><p className='mediaIcon'><i className="fab fa-instagram"></i><span className='fab'>Instagram</span></p></a>
                        <a href="" target='_blank'><p className='mediaIcon'><i className="fab fa-linkedin"></i><span className='fab'>LinkedIn</span></p></a>
                        <a href="https://www.youtube.com/" target='_blank'><p className='mediaIcon'><i className="fab fa-youtube"></i><span className='fab'>Youtube</span></p></a>
                    </div>
                </div>
                <p>All rights reserved by @HK Solutions &copy; {thisYear}</p>
            </div>


        </div>
    )
}

export default LandingPage
