'use strict'

const path = require('path')

exports.getBuildDirectory  = function () {
    let value = ''

    switch(process.env.NODE_ENV){
        case 'development':
            value = 'dist-dev';
        break;
        case 'test':
            value = 'dist-test';
        break;
        case 'production':
            value = 'dist-product';
        break;
    }

    return value;
}

