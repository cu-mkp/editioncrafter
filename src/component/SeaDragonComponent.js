import React, { Component } from 'react';

export class SeaDragonComponent extends Component { 
    shouldComponentUpdate() {
        return false
    }

    render() {
        const { initViewer } = this.props
        return <div className={`osd-viewer`} ref={(el)=> { initViewer(el) }}></div>
    }
}