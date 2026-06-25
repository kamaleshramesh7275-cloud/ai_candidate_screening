export const fetchGitHubData = async (githubUrl: string) => {
  try {
    // Extract username from URL (e.g. https://github.com/username)
    const match = githubUrl.match(/github\.com\/([^\/]+)/);
    if (!match) return null;
    
    const username = match[1];

    // Note: Public repos only, no auth required as per constraints, though rate limits apply
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) return null;
    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const reposData = await reposRes.json();

    let stars = 0;
    const languages: Record<string, number> = {};
    let recentCommitsScore = 0;

    // Build a monthly activity map for the last 12 months
    const monthlyActivity: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyActivity[key] = 0;
    }

    if (Array.isArray(reposData)) {
      reposData.forEach(repo => {
        stars += repo.stargazers_count || 0;
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
        
        const lastPush = new Date(repo.pushed_at);

        // Simple heuristic for recent commits: if pushed within last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (lastPush > thirtyDaysAgo) {
          recentCommitsScore += 1;
        }

        // Track monthly push activity
        const monthKey = `${lastPush.getFullYear()}-${String(lastPush.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyActivity[monthKey] !== undefined) {
          monthlyActivity[monthKey]++;
        }
      });
    }

    return {
      public_repos: userData.public_repos || 0,
      stars,
      languages,
      recentCommitsScore,
      monthlyActivity
    };
  } catch (error) {
    console.error('GitHub API Error:', error);
    return null;
  }
};
