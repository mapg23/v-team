export default {
    transform: {
        "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "/node_modules/"
    ],

    // Coverage
    coverageDirectory: "coverage",
    collectCoverage: true
};
