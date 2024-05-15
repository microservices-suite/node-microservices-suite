const fs = require('fs');
const { retrieveWorkSpaceName } = require('./your-module-file');

// Mock the fs module to simulate file reading
jest.mock('fs');

describe('retrieveWorkSpaceName', () => {
  test('should retrieve the workspace name from package.json', () => {
    // Mock the content of package.json
    const packageJsonContent = JSON.stringify({ name: 'your-workspace-name/workspace' });
    const packageJsonPath = '/path/to/package.json';

    // Mock fs.readFileSync to return package.json content
    fs.readFileSync.mockReturnValue(packageJsonContent);

    // Call the function with mocked parameters
    const result = retrieveWorkSpaceName({ package_json_path: packageJsonPath });

    // Assert that the result matches the expected workspace name
    expect(result).toEqual({ workspace_name: 'your-workspace-name' });
  });

  test('should throw an error when parsing package.json fails', () => {
    // Mock the content of package.json with invalid JSON
    const packageJsonContent = '{ invalid_json }';
    const packageJsonPath = '/path/to/package.json';

    // Mock fs.readFileSync to return package.json content
    fs.readFileSync.mockReturnValue(packageJsonContent);

    // Assert that the function throws an error
    expect(() => {
      retrieveWorkSpaceName({ package_json_path: packageJsonPath });
    }).toThrowError('Unexpected token i in JSON at position 2');
    // Adjust the error message to match the specific error thrown when parsing fails
  });

  test('should handle missing package.json file', () => {
    // Mock fs.readFileSync to throw an error indicating that the file doesn't exist
    fs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory');
    });

    // Assert that the function throws an error
    expect(() => {
      retrieveWorkSpaceName({ package_json_path: '/nonexistent/path/to/package.json' });
    }).toThrowError('ENOENT: no such file or directory');
  });
});
