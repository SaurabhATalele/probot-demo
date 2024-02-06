const openaiService = require("../services/openaiService");

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

      if (latestComment && latestComment.body === "/execute") {
        const aiOutput = await openaiService(latestComment.diff_hunk);
        const updatedCommentBody = `${latestComment.body}\n\n ${aiOutput}`;

        // Edit the last comment with the execute/explain updated body
        await context.octokit.pulls.updateReviewComment({
          owner: context.repo().owner,
          repo: context.repo().repo,
          comment_id: latestComment.id,
          body: updatedCommentBody,
        });

        // console.log(
        //   `Replied to the last comment on PR #${prNumber}: ${updatedCommentBody}`
        // );
      } else {
        console.log(`No action comments on PR #${prNumber}`);
      }
    }
  });
};
