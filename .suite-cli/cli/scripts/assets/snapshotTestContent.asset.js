module.exports = () => `
import React from 'react';
import renderer from 'react-test-renderer';
import MyComponent from './MyComponent';

describe('Snapshot Tests', () => {
    test('MyComponent snapshot', () => {
        const component = renderer.create(<MyComponent />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    // Add more snapshot tests as needed
});
`;