const { exec } = require('child_process');
const path = require('path');
const util = require('util');


async function readFileByCommand(filePath) {
    const escapedFilePath = `"${filePath}"`; // Enclose file path in double quotes
    const command = `type ${escapedFilePath}`;

    try {
        const { stdout, stderr } = await exec(command);
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout;
    } catch (error) {
        console.error(`Error executing command: ${error.message}`);
        throw error;
    }
}

function isFilePathAllowed(filePath, allowedDirectory) {
    return new Promise((resolve, reject) => {
        // Check if the resolved file path starts with the resolved allowed directory
        const isAllowed = filePath.startsWith(allowedDirectory);

        // Resolve the Promise with the result
        resolve(isAllowed);
    });
}

// Example usage:

module.exports = readFileByCommand;
module.exports = isFilePathAllowed;
