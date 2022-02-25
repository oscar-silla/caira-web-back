const jwt = require( 'jsonwebtoken' );

exports.useExtract = ( _req, _res, _next ) => {

    try {

        const { authorization } = _req.headers;

        if ( authorization && authorization.toLowerCase().startsWith( 'bearer' ) ) {

            if ( authorization.split( ' ' )[1] ) {

                const token = authorization.split( ' ' )[1];

                const verifyToken = jwt.verify( token, process.env.SECRET );

                if ( verifyToken && verifyToken?.userId ) {

                    _req.auth = true;

                } else {

                    return _res.status( 401 ).send({
                        status: 401,
                        msg: 'Not authorized',
                        result: null
                    });

                };

            } else {

                _res.status( 401 ).send({ 
                    status: 401,
                    msg: 'Not authorized',
                    result: null
                });

            };

        };

        _next();

    } catch ( _error ) {

        console.log( "Error try/catch ( useExtract )", `(${typeof _error}): `, _error);

    };

};