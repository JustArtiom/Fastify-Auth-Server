export default {
    // These are just as an example
    saltRounds: 10,
    access_expires_in: "15s",
    hashPasswordKey:
        "3235299d0f43a38089bf18077c7cd15806c8cead00963999cc391fe283a2e97b9a9e4db36145f9cd638ab03bfec15fd2d1db7dcc572d72c22ba1b03203217b18",
    accessTokenSecret:
        "a7c686272c2ad5638f60703fbc4c0329c562a30c59d77646e314c4b39249f92ddf2032bba932097fd9459a534f0ddd217bcdadb8b01e52e66f75fc3944748ca5",
    refreshTokenSecret:
        "32e12af48c316913bd2174d8177431700152745c38eab393cf84e3d62e017f76603ae8b016aca26af90cbeeb1e3976430a47177a5381fc3d33b609ede6f8549b",

    postgresql: {
        host: "localhost",
        port: 5432,
        user: "root",
        password: "root",
        database: "db1",
    },
    fastify: {
        host: "0.0.0.0",
        port: 3000,
    },
};
