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

exports.updateRepository = async (githubToken, ownerName, repoName, title, description) => {
    const data = {
        name: title,
        description
    }

    const respose = await (axios.patch(`https://api.github.com/repos/${ownerName}/${repoName}`, data, {
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