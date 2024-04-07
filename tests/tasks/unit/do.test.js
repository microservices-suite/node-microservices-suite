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
test('Test that do:<service_name>:<mode>:<action> exits gracefully if service does not exist', () => {
})

/**
 * 
 */
test('Test that do:<service_name>:<mode>:<action> exits gracefully if .env.<mode> file does not exist', () => {

})

/**
 * 
 */
test('Test do:<service_name>:start:<action>command', () => {

})

/**
 * 
 */
test('Test do:<service_name>:dev:<action>command runs dev environment for given service', () => {
    
})

/**
 * 
 */
test('Test do:<service_name>:start:<action>command', () => {

})

/**
 * 
 */
test('Test do:<service_name>:start:<action>command', () => {

})

/**
 * 
 */
test('Test do:<service_name>:start:<action>command', () => {

})

/**
 * 
 */
test('Test do:<service_name>:start:<action>command', () => {

})