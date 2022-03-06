const bcrypt = require( 'bcrypt' );
const jwt    = require( 'jsonwebtoken' );
const { fieldValidator } = require('../utils/fieldValidator');

exports.login = async ( _req, _res ) => {

    try {

        // Mongo connection
        const { mongo } = global?.database;

        // Request body
        const { email, password } = _req.body;

        // request.body Validation
        if ( !email || !password ) { 
            
            return _res.send({
                status: 400,
                msg: 'Missing data.',
                result: null
            });

        };

        
        // Email validation
        if ( !fieldValidator( email, 'email' ) ) {
            return _res.send({
                status: 400,
                msg: 'Wrong email.',
                result: null
            });
        };



        // Find user by email
        const filter = { email: email };
        const userFound = await mongo.collection( 'users' ).findOne( filter );
        console.log( "userFound", `(${typeof userFound}): `, userFound);

        if ( userFound ) {

            // Compare passwords
            let passwordCrypt;
            if ( userFound ) passwordCrypt = userFound?.password;


            const validatePassword = await bcrypt.compare( password, passwordCrypt );


            // Validation user or pass        
            if ( !userFound || !validatePassword ) {

                return _res.send({
                    status: 404,
                    msg: 'Email or password is wrong.',
                    result: null
                });

            };

            const payload = {
                rol: userFound.rol,
                userId: userFound._id
            };

            const token = jwt.sign( payload, process.env.SECRET );

            return _res.status( 200 ).send({
                status: 200,
                msg: 'Logged.',
                result: {
                    ...payload,
                    token
                }
            });

        } else {

            return _res.send({
                status: 404,
                msg: 'Email or password is wrong.',
                result: null
            });

        };


    } catch ( _error ) {

        console.log( "Error try/catch ( login )", `(${typeof _error}): `, _error);
        
    };

};
