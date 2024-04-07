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
test('Test duplicate_key error', () => {

})

/**
 * 
 */
test('Test user is created in db', () => {
    
})

/**
 * 
 */
test('Test user updated on patch request', () => {

})

/**
 * 
 */
test('Test user is deleted', () => {

})