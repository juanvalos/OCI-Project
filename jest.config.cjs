module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  // Soporte para JSX y ESModules con Babel -- esto se lo pedí a chat porque problemas con mi laptop :(
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },

  // Ignorar imports de CSS, SCSS, etc.
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  moduleFileExtensions: ["js", "jsx"]
};
