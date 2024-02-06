module.exports = (app) => {
  app.on("pull_request", async (context) => {
    const { title, number, user } = context.payload.pull_request;

    // Comment on the pull request to indicate it will be merged soon
    const commentBody = `Thanks for opening this pull request, @${user.login}! :tada: This looks great! It will be merged soon. :rocket:`;

    // Create a comment on the pull request
    await context.octokit.issues.createComment({
      owner: context.repo().owner,
      repo: context.repo().repo,
      issue_number: number,
      body: commentBody,
    });
  });
};
