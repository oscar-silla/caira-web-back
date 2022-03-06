require( 'dotenv' ).config();
require( './database/mongo' );
const express = require( 'express' );
const cors    = require( 'cors' );
const { Router } = require('./routes/router');
const bodyParser = require('body-parser');

const api = express();

/* Middlewares */
api.use(bodyParser.json({
    limit: '50mb'
}));


api.use( express.json() );
api.use( cors() );


/* Router */
Router( api );


/* Connect to PORT */
const PORT = process.env.PORT;
api.listen( PORT, () => console.log( `Server is listening on port ${ PORT }`) );