import chalk from "chalk";


export const logger = {
    info: (...args: string[] | unknown[]) => {
        console.log(chalk.cyan(...args))
    },

    error: (...args: string[] | unknown[]) => { 
        console.log(chalk.red(...args))
    },

    warning: (...args: string[] | unknown[]) => {
        console.log(chalk.yellow(...args))
    },

    success: (...args: string[] | unknown[]) => {
        console.log(chalk.green(...args))
    }
};