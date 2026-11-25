// Renders every page of the site into dist/ as static HTML, with the data
// each page needs embedded for hydration. Run after `vite build`.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "vite";
import type { PageData } from "./app/pageData";

type EntryServer = {
	render: (data: PageData) => string;
	pageTitle: (data: PageData) => string;
};

type WatchPageData = Extract<PageData, { page: "watch" }>;
type TournamentPageData = Extract<PageData, { page: "tournament" }>;

// The tournament page of the original site took the players as query
// parameters (player1..6, ordered by their qualifying ranks). These are the
// ones used at the event.
const TOURNAMENT_PLAYER_IDS = [10, 14, 9, 17, 13, 19];

async function readData<T>(path: string): Promise<T> {
	return JSON.parse(await readFile(`data/${path}`, "utf8")) as T;
}

async function collectPages(): Promise<[string, PageData][]> {
	const { games } = await readData<{
		games: { game_id: number; display_name: string }[];
	}>("games.json");

	const pages: [string, PageData][] = [
		["", { page: "index" }],
		[
			"dashboard/",
			{
				page: "dashboard",
				games: games.map(({ game_id, display_name }) => ({
					game_id,
					display_name,
				})),
			},
		],
	];
	for (const { game_id } of games) {
		const { game } = await readData<WatchPageData>(`games/${game_id}.json`);
		const { ranking } = await readData<WatchPageData>(
			`games/${game_id}/watch/ranking.json`,
		);
		const { states } = await readData<{
			states: WatchPageData["latestStates"];
		}>(`games/${game_id}/watch/latest_states.json`);
		pages.push([
			`golf/${game_id}/watch/`,
			{ page: "watch", game, ranking, latestStates: states },
		]);
	}
	const { tournament } = await readData<TournamentPageData>("tournament.json");
	pages.push([
		"tournament/",
		{ page: "tournament", tournament, playerIDs: TOURNAMENT_PLAYER_IDS },
	]);
	return pages;
}

function escapeHtml(s: string): string {
	return s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

const vite = await createServer({
	server: { middlewareMode: true },
	appType: "custom",
	optimizeDeps: { noDiscovery: true },
});
try {
	const { render, pageTitle } = (await vite.ssrLoadModule(
		"/app/entry-server.tsx",
	)) as EntryServer;
	const template = await readFile("dist/index.html", "utf8");

	for (const [path, data] of await collectPages()) {
		const json = JSON.stringify(data).replaceAll("<", "\\u003c");
		// Use replacer functions so that "$" in the content is not interpreted as
		// a replacement pattern (submitted code may contain "$'" or "$&").
		const html = template
			.replace(
				"</head>",
				() => `<title>${escapeHtml(pageTitle(data))}</title></head>`,
			)
			.replace(
				'<div id="root"></div>',
				() =>
					`<div id="root">${render(data)}</div><script id="page-data" type="application/json">${json}</script>`,
			);
		await mkdir(`dist/${path}`, { recursive: true });
		await writeFile(`dist/${path}index.html`, html);
		console.log(`dist/${path}index.html`);
	}
} finally {
	await vite.close();
}
