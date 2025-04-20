const geminiService = require("../services/geminiService");
const openaiService = require("../services/openaiService");

const updateReviewComment = async (context, comment_id, body) => {
  // Edit the last comment with the execute/explain updated body
  await context.octokit.pulls.updateReviewComment({
    owner: context.repo().owner,
    repo: context.repo().repo,
    comment_id,
    body,
  });
};
module.exports = (app) => {
  app.on("pull_request_review", async (context) => {
    const { payload } = context;

    // Check if the review is on a pull request
    if (payload.pull_request) {
      const prNumber = payload.pull_request.number;

      // Fetch the comments made during the review, sorted by creation time in descending order
      const reviewComments = await context.octokit.pulls.listReviewComments({
        owner: context.repo().owner,
        repo: context.repo().repo,
        pull_number: prNumber,
        sort: "created",
        direction: "desc",
      });

      // Get the latest comment
      const latestComment = reviewComments.data[0];

      if (latestComment) {
        const aiOutput = await geminiService(
          latestComment.diff_hunk,
          latestComment.body.split("/")[1]
        );
        if (aiOutput === "Invalid operation") {
          console.log("Invalid operation");
          return;
        }
        updateReviewComment(context, latestComment.id, aiOutput);
      } else {
        console.log(`No action comments on PR #${prNumber}`);
      }
    }
  });
};
