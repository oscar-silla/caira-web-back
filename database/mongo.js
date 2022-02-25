const { MongoClient, ObjectId } = require( 'mongodb' );

(async () => {

    try {

        // Guardo la url de mongo
        const URL = process.env.MONGO_URL;

        // Configuro las opciones de conexión del cliente
        const OPTIONS = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        // Creo el cliente
        const CLIENT = new MongoClient( URL, OPTIONS );

        // Genero la conexión a partir del cliente
        const CONNECTION = await CLIENT.connect();

        // Establezco la conexión con la bbdd
        const DATABASE = CONNECTION.db('caira');

        if ( DATABASE ) {

            console.log( "MongoDB is connected! ✅" );

            global.database = {
                mongo: DATABASE,
                ObjectId: ObjectId
            };

        };

    } catch ( error ) {

        console.log( error );
        
    };

})();