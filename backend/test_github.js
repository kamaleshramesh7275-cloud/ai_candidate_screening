const fetch = globalThis.fetch;

async function fetchGitHubData(githubUrl) {
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)/);
    if (!match) {
      console.log('No username match in URL:', githubUrl);
      return null;
    }
    const username = match[1];
    console.log('Fetching user:', username);

    const userRes = await fetch(`https://api.github.com/users/${username}`);
    console.log('User response status:', userRes.status);
    if (!userRes.ok) {
      console.log('User response not OK:', await userRes.text());
      return null;
    }
    const userData = await userRes.json();

    console.log('Fetching repos for:', username);
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    console.log('Repos response status:', reposRes.status);
    const reposData = await reposRes.json();
    console.log('Repos count/data:', Array.isArray(reposData) ? reposData.length : reposData);

    return {
      public_repos: userData.public_repos || 0,
      reposData
    };
  } catch (error) {
    console.error('GitHub API Error:', error);
    return null;
  }
}

fetchGitHubData('https://github.com/dom').then(res => {
  console.log('Result:', res ? { public_repos: res.public_repos, reposCount: Array.isArray(res.reposData) ? res.reposData.length : 'Not an array' } : 'Null');
});
