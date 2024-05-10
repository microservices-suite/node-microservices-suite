module.exports = ({ answers }) => ({
    projectName: answers.repo_name,
    ...answers
})