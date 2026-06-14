export const calculateResumeScore = (resumeText: string, domain?: string): number => {
  if (!resumeText) return 0;
  
  const textLower = resumeText.toLowerCase();
  
  // Define keyword sets by domain
  const domainKeywords: Record<string, string[]> = {
    'Frontend': ['react', 'next.js', 'javascript', 'typescript', 'css', 'html', 'tailwind', 'redux', 'vue', 'angular'],
    'Backend': ['node.js', 'express', 'python', 'django', 'java', 'spring', 'sql', 'postgresql', 'mongodb', 'docker', 'api'],
    'DevOps': ['aws', 'kubernetes', 'docker', 'ci/cd', 'jenkins', 'terraform', 'linux', 'bash'],
    'ML': ['python', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'machine learning', 'deep learning'],
    'General CS': ['data structures', 'algorithms', 'git', 'agile', 'oop', 'c++']
  };

  const targetKeywords = domain && domainKeywords[domain] 
    ? domainKeywords[domain] 
    : Object.values(domainKeywords).flat();

  let matchCount = 0;
  targetKeywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      matchCount++;
    }
  });

  // Score out of 100 based on matching up to 10 keywords
  const maxKeywords = 10;
  const score = Math.min((matchCount / maxKeywords) * 100, 100);
  
  return score;
};

export const calculateGithubScore = (githubData: any): number => {
  if (!githubData) return 0;

  const { public_repos = 0, languages = {}, recentCommitsScore = 0, stars = 0 } = githubData;
  
  const unique_langs = Object.keys(languages).length;
  
  // Rule-based score: (repos * 2) + (unique_langs * 3) + (recent_commits * 2) + (stars * 1)
  let score = (public_repos * 2) + (unique_langs * 3) + (recentCommitsScore * 2) + (stars * 1);
  
  // Cap at 100
  return Math.min(score, 100);
};

export const calculateLinkedInScore = (linkedInUrl?: string, linkedInData?: any): number => {
  if (!linkedInUrl) return 0;
  if (!linkedInData) return 50; // Base score for providing URL if scraping fails

  // Rule-based score on completeness
  let score = 50; // Base score for having profile
  if (linkedInData.data) {
    if (linkedInData.data.headline) score += 25;
    if (linkedInData.data.summary) score += 25;
  }
  
  return Math.min(score, 100);
};

export const calculateOverallScore = (resumeScore: number, githubScore: number, testScore: number): number => {
  // Weighted average (Resume 25% + GitHub 25% + Test 50%)
  return (resumeScore * 0.25) + (githubScore * 0.25) + (testScore * 0.50);
};
