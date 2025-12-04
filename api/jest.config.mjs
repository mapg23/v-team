
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {

    collectCoverage: true,

    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    coverageReporters: [
        "lcov",
        "json-summary"
    ],


    // A map from regular expressions to paths to transformers
    transform: {
        "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
    },

    transformIgnorePatterns: [
        "/node_modules/"
    ]
};

export default config;
