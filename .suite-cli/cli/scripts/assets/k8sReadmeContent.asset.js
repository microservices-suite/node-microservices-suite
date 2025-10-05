module.exports = ({ answers }) => `
# ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)}
## kubernetes orchestration package

All services workflow orchestration live here. Write scalable workflows and orchestrate using the \`declarative\` approach. To use \`imperative\` approach you can issue direct \`kubectl\` commands to your \`pod clusters\` e.g during development. 
`;