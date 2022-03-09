

exports.post_image = async ( _req, _res ) => {

    try {

        console.log( "_req.file", `(${typeof _req.files}): `, _req.files);

        return _res.send({
            msg: 'Ok'
        })

    } catch ( _error ) {

        console.log( "Error try/catch ( post_image )", `(${typeof _error}): `, _error);

    };

};