// jshint node:true

var Promise = require('../../../ext/promise');  // jshint ignore:line
var getEnvVar = require('../../../ext/get-env-var');  // jshint ignore:line
var GitHubApi = require('github');
var github = new GitHubApi({ version: '3.0.0' });

/**!
 *
 * @param options passed to the Github API compareCommits function
 * @returns {Promise} returns a promise which resolves to an array of parsed commits
 */
function githubCompareCommits(options, parseOptions) {
  var githubToken = getEnvVar('GITHUB_TOKEN', null);

  if (githubToken) {
    github.authenticate({
      type: 'oauth',
      token: githubToken
    });
  }

  var compareCommits = Promise.denodeify(github.repos.compareCommits);
  var massageGithubCommits = require('./massage-commits');

  return compareCommits(options)
    .then(function(commits) {
      return massageGithubCommits(commits, parseOptions);
    });
}

module.exports = githubCompareCommits;
