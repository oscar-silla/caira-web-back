/**
 * Validates the value with a regex expression depending the field's type.
 * @param {*} _value 
 * @param {*} _type 
 * @returns { boolean } true / false
 */
exports.fieldValidator = ( _value, _type ) => {

    try {

        let validated = false;

        // Comprobe to name exists
        if ( !_value || !_type ) return false;

        switch ( _type ) {

            case 'name':
                
                // Name validation with regex
                if ( _value.match( /^[a-z ,.'-]+$/i ) ) {
        
                    validated = true;
                };

            case 'email':

                // Name validation with regex
                if ( _value.match( /^\S+@\S+\.\S+$/ ) ) {
        
                    validated = true;
                };

            case 'objectId':

                if ( _value.match( /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i ) ) {

                    validated = true;
                };

            default:;
            break;

        };
        console.log( "validated", `(${typeof validated}): `, validated);

        return validated;

    } catch ( _error ) {

        console.log( "Error try/catch ( emailValidation )", `(${typeof _error}): `, _error);

    };

};