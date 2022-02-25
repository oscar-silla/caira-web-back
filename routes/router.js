const { login } = require("../controllers/Login");
const { post_user, get_users, get_user_by_user_id } = require("../controllers/User");
const { useExtract } = require("../middlewares/useExtract");

exports.Router = ( _api ) => {

    /* User */
    _api.get( '/users', useExtract, get_users );
    _api.get( '/user/:userId', useExtract, get_user_by_user_id );
    _api.post( '/user', post_user );

    /* Login */
    _api.post( '/login', login );

    
};