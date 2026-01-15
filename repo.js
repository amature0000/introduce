const EXTRA = ["PracticalProgramming-Team5/SmartFileManager"];

async function renderRepo(container, repo) {
    const div = document.createElement("div");
    div.className = `repo ${repo.category !== "normal" ? "top" : ""}`;

    div.innerHTML = `
    <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
    <p>${repo.description || "No description"}</p>
    <div class="meta">
        <div class="badges">${repo.badge}</div>
        <div class="pushed_at">Last update: ${when_pushed(repo.pushed_at)}</div>
    </div>`;
    container.appendChild(div);
}

async function loadRepos() {
    const user = "amature0000";
    const container = document.getElementById("repos");
    const loader = document.getElementById("load");
    container.innerHTML = "";
    loader.innerHTML = "";

    const repos = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`).then(r => r.json());
    console.log(repos);

    const extraRepos = await Promise.all(
        EXTRA.map(r => fetch(`https://api.github.com/repos/${r}`).then(res => res.json()))
    );

    const all = [
        ...repos.map(r => ({
            ...r,
            category: "normal"
        })),
        ...extraRepos.map(r => ({
            ...r,
            category: "extra"
        }))
    ];

    await Promise.all(
        all.map(async repo => {
            repo.badge = await getReleases(repo.full_name);
            repo.hasReleases = (repo.badge == "" ? false : true);
        })
    )

    all.sort((a, b) => {
        // extra 우선
        if(a.category != b.category) return a.category == "extra" ? -1 : 1;
        // releases 우선
        if (a.hasReleases != b.hasReleases) return a.hasReleases ? -1 : 1;
        // pushed_at 기준
        return new Date(b.pushed_at) - new Date(a.pushed_at);
    });

    for (const repo of all) await renderRepo(container, repo);
}

function when_pushed(dateStr) {
    if (!dateStr) return "No pushes yet";

    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);

    if (days < 1) return "Today";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

async function getReleases(name) {
    const url = `https://img.shields.io/github/downloads/${name}/total.svg`;

    const res = await fetch(url);
    const svg = await res.text();

    if (svg.includes("no releases found")) return "";
    return `<img
        src="https://img.shields.io/github/downloads/${name}/total.svg?logo=github"
        alt="downloads"/>`;
}