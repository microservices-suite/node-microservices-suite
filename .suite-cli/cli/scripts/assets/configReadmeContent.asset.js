
module.exports = ({ answers }) => `
# ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)}

## Configuration Package

Welcome to the ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)} Configuration Package! This pkg, part of our monorepo, offers a centralized solution for managing configuration settings across your microservices applications. By consolidating configuration options, you ensure consistency and ease of maintenance throughout your codebase.
`;