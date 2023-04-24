import React, { Component } from 'react';
class commonData extends Component {
    config = {
        headers:{
            "Accept": "*/*",
            "Content-Type":"application/json",
        },
        auth: {
            username: 'victor',
            password: 'test'
        }
    };
}

export default commonData;