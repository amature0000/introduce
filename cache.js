const CACHE_KEY = "amature0000_repos"
const EXPIRATION = 24 * 60 * 60 * 1000;

function getCachedRepos() {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    const { timestamp, data } = JSON.parse(cachedData);
    const now = new Date().getTime();

    if (now - timestamp < EXPIRATION) {
        return data;
    }

    localStorage.removeItem(CACHE_KEY);
    return null;
}

function setCacheRepos(data) {
    const cacheObject = {
        timestamp: new Date().getTime(),
        data: data
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
}

// 초기실행
async function init() {
    const container = document.getElementById("repos");
    const loader = document.getElementById("load");
    const cached_all = getCachedRepos();
    if(cached_all) {
        console.log("use cache data:");
        console.log(cached_all);
        container.innerHTML = "";
        loader.innerHTML = "";
        for (const repo of cached_all) await renderRepo(container, repo);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    init();
});