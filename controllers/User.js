const bcrypt = require( 'bcrypt' );
const dayjs = require('dayjs');
const { fieldValidator } = require('../utils/fieldValidator');

/**
 * Get all users
 * @param { object } _req 
 * @param { object } _res 
 */
exports.get_users = async ( _req, _res ) => {

    if ( _req.auth ) {

        try {
    
            const { mongo } = global?.database;
    
            const response = await mongo.collection( 'users' ).find( {} ).toArray();
            
            if ( !response || response.length === 0 ) {
    
                return _res.send({
                    status: 404,
                    msg: 'Not found.',
                    result: null
                });
    
            };
    
            return _res.status( 200 ).send({
                status: 200,
                msg: 'All users',
                result: response
            });
    
        } catch ( _error ) {
    
            console.log( "Error try/catch ( get_users )", `(${typeof _error}): `, _error);
    
        };

    } else {

        _res.status( 401 ).send({ 
            status: 401,
            msg: 'Not authorized',
            result: null
        });


    };

};



exports.get_user_by_user_id = async ( _req, _res ) => {

    if ( _req.auth ) {

        try {

            const { mongo, ObjectId } = global.database;

            const { userId } = _req.params;

            if ( !fieldValidator( userId, 'objectId' ) ) {

                return _res.send({
                    status: 400,
                    msg: 'Wrong objectId.',
                    result: null
                });

            };

            const filter = { _id: ObjectId( userId ) };

            const response = await mongo.collection( 'users' ).findOne( filter );

            if ( !response || Object.keys( response ).length === 0 ) {

                return _res.send({
                    status: 404,
                    msg: 'User not found.',
                    result: null
                });

            };


            switch ( response?.rol ) {

                case 1: response.rol = 'Project Admin';
                break;

                case 2: response.rol = 'University';
                break;

                case 3: response.rol = 'Partner';
                break;

                case 4: response.rol = 'Student';
                break;

            };

            return _res.status( 200 ).send({
                status: 200,
                msg: 'User found.',
                result: response
            });

        } catch ( _error ) {

            console.log( "Error try/catch ( get_user_by_user_id )", `(${typeof _error}): `, _error);

        };

    } else {

        return _res.send({
            status: 401,
            msg: 'Not autorized.',
            result: null
        });

    };

};


/**
 * Post user / Register
 * @param { object } _req 
 * @param { object } _res 
 */
exports.post_user = async ( _req, _res ) => {

    try {

        const { mongo } = global.database;

        const { 
            name, 
            surnames, 
            email, 
            password, 
            rpassword,
            age,
            phone,
            followers,
            following,
            avatar,
            rol,
            skills
        } = _req.body;


        /* VALIDATIONS 
        ***********************/

        // Check all fields of the request body
        let validations = [];
        if ( !name || !email || !password || !rpassword ) {

            if ( !name )      validations.push( "name" );
            if ( !email )     validations.push( "email" );
            if ( !password )  validations.push( "password" );
            if ( !rpassword ) validations.push( "rpassword" );

        };
        
        // Check all the params are disctint to null
        if ( validations.length > 0 ) {

            return _res.send({
                status: 400,
                msg: 'Missing data.',
                result: validations
            });

        };


        // Check name
        if ( !fieldValidator( name, 'name' ) ) {
            
            return _res.send({
                status: 422, // "Unprocesable entity" ( ej: "name" == 12345 -> error )
                msg: 'Wrong name.',
                result: null
            });

        };


        // Check email
        if ( !fieldValidator( email, 'email' ) ) {
            
            return _res.send({
                status: 400,
                msg: 'Wrong email.',
                result: null
            });

        };


        // Check the passwords
        if ( password !== rpassword ) {

            return _res.send({
                status: 403,
                msg: 'Passwords do not match.',
                result: null
            });

        };


        // CRYPT the password
        const passwordHash = await bcrypt.hash( password, 10 );

        
        // PAYLOAD
        const payload = {
            name,
            surnames: surnames ? surnames : null,
            email,
            password: passwordHash,
            age: age ? age : null,
            phone: phone ? phone : null,
            followers: followers ? followers : null,
            following: following ? following : null,
            avatar: avatar ? avatar : null,
            skills: skills ? skills : null,
            rol: rol ? rol : 4,
            created_at: dayjs().unix()
        };

        const response = await mongo.collection( 'users').insertOne( payload );
        

        if ( !response ) {

            return _res.status( 500 ).send({
                status: 500,
                msg: 'Error to create user.',
                result: null
            });

        };


        return _res.status( 201 ).send({
            status: 201,
            msg: 'User created.',
            result: response
        });


    } catch ( _error ) {

        console.log( "Error try/catch ( post_user )", `(${typeof _error}): `, _error);

    };

};