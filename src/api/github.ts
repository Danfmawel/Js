const GITHUB_API = 'https://api.github.com';

const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
};

export const fetchReposByOrg = async (org: string) => {
    let page = 1;
    const allRepos = [];

    while (true) {
        const res = await fetch(`${GITHUB_API}/orgs/${org}/repos?per_page=100&page=${page}&sort=updated`, { headers });
        if (!res.ok) throw new Error('Failed to fetch repos');
        const repos = await res.json();
        if (repos.length === 0) break;

        allRepos.push(...repos);
        page++;
    }

    return allRepos;
};

export const fetchRepoDetails = async (owner: string, repo: string) => {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch repository details');
    return res.json();
};

export const fetchRepoCommitActivity = async (owner: string, repo: string) => {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/stats/commit_activity`, { headers });
    if (res.status === 202) return null;
    if (!res.ok) throw new Error('Failed to fetch commit activity');
    return res.json();
};


export const fetchRepoContributors = async (owner: string, repo: string) => {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contributors`, { headers });
    if (!res.ok) throw new Error('Failed to fetch contributors');
    return res.json();
};

export const fetchRepoBranches = async (owner: string, repo: string) => {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/branches`, { headers });
    if (!res.ok) throw new Error('Failed to fetch branches');
    return res.json();
};

