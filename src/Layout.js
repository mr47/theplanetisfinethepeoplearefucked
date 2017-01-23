/**
 * Created by mr47 on 1/16/2017.
 */

import React, { Component } from 'react';
import Planet from './Planet';

class Layout extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        window.onresize = ()=>{
            this.setState({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
    }
    render(){
        return (
            <div className="container">
                <div className="planet">
                    <Planet />
                </div>
            </div>
        );
    }
}

export default Layout;

