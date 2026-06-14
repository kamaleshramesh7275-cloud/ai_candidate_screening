export const verifySkills = (resumeText: string, githubLanguages: string[]) => {
  const textLower = resumeText.toLowerCase();
  
  const matched: string[] = [];
  const missing: string[] = [];

  githubLanguages.forEach(lang => {
    // Simple word boundary regex to check if language is in resume
    const regex = new RegExp(`\\b${lang.toLowerCase()}\\b`, 'i');
    if (regex.test(textLower)) {
      matched.push(lang);
    } else {
      missing.push(lang);
    }
  });

  return {
    matched,
    missing,
    matchPercentage: githubLanguages.length > 0 ? (matched.length / githubLanguages.length) * 100 : 0
  };
};
