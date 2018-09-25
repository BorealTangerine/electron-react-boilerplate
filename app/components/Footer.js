import React from 'react';
import moment from 'moment';

const Footer = () => (
    <div className='footer'>
        <div className='ui padded grid'>
            <div className='black left aligned six wide column'>
            Copyright © {moment().year()} RPCuk Ltd.
            </div>
            <div className='black center aligned four wide column'>
            Contact Details: support@rpc.uk.com
            </div>
            <div className='black right aligned six wide column '>
            RPC UK Limited, 1 The Courtyard, Hawksworth Estate, Thorpe Lane, Guiseley, Leeds, UK, LS20 8LG
            </div>
        </div>
    </div>);


export default Footer;
