const os = require('os')

beforeEach(() => {
    const upload_service_env_files = []
    const user_service_env_files = ['.env'];
    const auth_service_env_files = ['.env', '.env.staging'];
    const cart_service_env_files = ['.env', '.env.dev', '.env.staging'];
});

afterEach(() => {
    clearCityDatabase();
});


/**
 * 
 */
test('Test that vanilla:<service_name>:<mode> exits gracefully if service does not exist', () => {
})

/**
 * 
 */
test('Test that vanilla:<service_name>:<mode> exits gracefully if .env.<mode> file does not exist', () => {

})

/**
 * 
 */
test('Test vanilla:<service_name>:start command', () => {

})

/**
 * 
 */
test('Test vanilla:<service_name>:dev command runs dev environment for given service', () => {
    
})

/**
 * 
 */
test('Test vanilla:<service_name>:start command', () => {

})

/**
 * 
 */
test('Test vanilla:<service_name>:start command', () => {

})

/**
 * 
 */
test('Test vanilla:<service_name>:start command', () => {

})

/**
 * 
 */
test('Test vanilla:<service_name>:start command', () => {

})