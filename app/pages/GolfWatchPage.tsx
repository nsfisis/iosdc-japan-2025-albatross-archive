import type { components } from "../api/schema";
import GolfWatchAppGaming1v1 from "../components/GolfWatchApps/GolfWatchAppGaming1v1";

type Props = {
	game: components["schemas"]["Game"];
	ranking: components["schemas"]["RankingEntry"][];
	latestStates: { [key: string]: components["schemas"]["LatestGameState"] };
};

export default function GolfWatchPage({ game, ranking, latestStates }: Props) {
	return (
		<GolfWatchAppGaming1v1
			game={game}
			ranking={ranking}
			latestStates={latestStates}
		/>
	);
}
