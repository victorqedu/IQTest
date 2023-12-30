import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <body>
        <div className="contact-container">
            <div className="contact-info">
                <h2 className="contact-h2">Informații de contact</h2>
                <p className="contact-p">Ne puteți contacta prin telefon sau email </p>
                <div className="contact-details">
                    <div className="contact-detail">
                        <span className="contact-icon">&#x260E;</span>
                        <span className="contact-info">Phone: (+04) 0740.863629</span>
                    </div>
                    <div className="contact-detail">
                        <span className="contact-icon">&#9993;</span>
                        <span className="contact-info">Email: victor@caido.ro</span>
                    </div>
                </div>
            </div>
        </div>
        </body>
    );
};
export default Contact;
