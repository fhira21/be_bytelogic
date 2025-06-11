const axios = require("axios");

exports.createRepository = async (githubToken, title, description) => {
    const data = {
        name: title,
        description: description,
        private: false,
        is_template: false
    };

    const respose = await (axios.post('https://api.github.com/user/repos', data, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${githubToken}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }))

    return respose.data
}

exports.getCommits = async (githubToken, ownerName, repoName) => {
    const respose = await (axios.get(`https://api.github.com/repos/${ownerName}/${repoName}/commits`, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${githubToken}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }))

    return respose.data
}

// ✅ Tambahan untuk mendapatkan issues dari repo
exports.getRepoIssues = async (githubToken, ownerName, repoName) => {
    try {
        const response = await axios.get(
            `https://api.github.com/repos/${ownerName}/${repoName}/issues?state=all&per_page=100`,
            {
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': `Bearer ${githubToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(`❌ Gagal mengambil issues dari repo ${repoName}:`, error.response?.data || error.message);
        return [];
    }
};

exports.getProjectProgressFromIssues = async (githubToken, ownerName, repoName) => {
    const issues = await exports.getRepoIssues(githubToken, ownerName, repoName);
    const realIssues = issues.filter(issue => !issue.pull_request);
    const totalIssues = realIssues.length;
    const closedIssues = realIssues.filter(issue => issue.state === "closed").length;

    const progress = totalIssues > 0 ? (closedIssues / totalIssues) * 100 : 0;

    return {
        totalIssues,
        closedIssues,
        progress: Math.round(progress * 10) / 10
    };
};