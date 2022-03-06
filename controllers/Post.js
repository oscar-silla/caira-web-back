const dayjs = require('dayjs');
const { fieldValidator } = require( '../utils/fieldValidator' );


/**
 * Get all posts ( GET )
 * @param {*} _req 
 * @param {*} _res 
 * @returns All posts.
 */
exports.get_all_posts = async ( _req, _res ) => {

    if ( _req.auth ) {

        try {

            const { mongo } = global.database;

            const response = await mongo.collection( 'posts' ).find({}).sort({_id: -1}).toArray();

            if ( !response || response.length === 0 ) {

                return _res.send({
                    status: 404,
                    msg: 'Not found.',
                    result: []
                });

            };

            return _res.send({
                status: 200,
                msg: 'All posts.',
                result: response
            });

        } catch ( _error ) {

            console.log( "Error try/catch ( get_all_posts )", `(${typeof _error}): `, _error);

        };
        
    } else {

        return _res.send({
            status: 401,
            msg: 'Not Authorized.',
            result: null
        });

    };

};


/**
 * Create a new post ( POST )
 * @param {*} _req 
 * @param {*} _res 
 * @returns Created Post
 */
exports.create_post = async ( _req, _res ) => {

    if ( _req.auth ) {

        try {

            const { mongo, ObjectId } = global.database;

            const { userId, name, surnames, content } = _req.body;

            const validateUserId = fieldValidator( userId, 'objectId' );

            if ( 
                   !name 
                || !userId 
                || !content 
                || !surnames 
                || !validateUserId 
            ) {

                return _res.send({
                    status: 400,
                    msg: 'Wrong data.',
                    result: null
                });

            };

            const timestamp = dayjs().unix();

            const payload = {
                user: {
                    userId: ObjectId( userId ),
                    name,
                    surnames,
                },
                content,
                resume: {
                    likes: [],
                    dislikes: [],
                    comments: [],
                    views: [],
                    shares: []
                },
                createdAt: timestamp
            };

            const response = await mongo.collection( 'posts' ).insertOne( payload );
            
            if ( !response ) {

                return _res.send({
                    status: 500,
                    msg: 'Error to try create post.',
                    result: null
                });

            };

            return _res.status(201).send({
                status: 201,
                msg: 'Post created successfully.',
                result: response
            });
        
        } catch ( _error ) {
    
            console.log( "Error try/catch ( create_post )", `(${typeof _error}): `, _error);
    
        };
        
    } else {

        return _res.send({
            status: 401,
            msg: 'Not authorized.',
            result: null
        });

    };

};