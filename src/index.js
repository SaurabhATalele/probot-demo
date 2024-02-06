// src/index.js
const issues = require("./handlers/issues");
const pullRequest = require("./handlers/pullRequest");
const pullRequestReview = require("./handlers/pullRequestReview");

const probotApp = (app) => {
  // Register event handlers
  issues(app);
  pullRequest(app);
  pullRequestReview(app);
};

// Set up the Probot app
module.exports = probotApp;
