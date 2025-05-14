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

// exports.updateRepository = async (githubToken, ownerName, currentRepoName, newRepoName, description) => {
//   const data = {
//     name: title,
//     description
//   };

//   const response = await axios.patch(
//     `https://api.github.com/repos/${ownerName}/${currentRepoName}`,
//     data,
//     {
//       headers: {
//         'Accept': 'application/vnd.github+json',
//         'Authorization': `Bearer ${githubToken}`,
//         'X-GitHub-Api-Version': '2022-11-28'
//       }
//     }
//   );

//   return response.data;
// };


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