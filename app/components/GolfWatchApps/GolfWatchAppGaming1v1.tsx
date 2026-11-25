import type { components } from "../../api/schema";
import { calcCodeSize } from "../../codeSize";
import FoldableBorderedContainerWithCaption from "../FoldableBorderedContainerWithCaption";
import CodeBlock from "../Gaming/CodeBlock";
import ProblemColumnContent from "../Gaming/ProblemColumnContent";
import RankingTable from "../Gaming/RankingTable";
import ScoreBar from "../Gaming/ScoreBar";
import SubmitStatusLabel from "../SubmitStatusLabel";
import ThreeColumnLayout from "../ThreeColumnLayout";
import TitledColumn from "../TitledColumn";
import UserIcon from "../UserIcon";

type Game = components["schemas"]["Game"];
type LatestGameState = components["schemas"]["LatestGameState"];
type RankingEntry = components["schemas"]["RankingEntry"];
type User = components["schemas"]["User"];

type GameResultKind = "winA" | "winB" | "draw";

function checkGameResultKind(
	stateA: LatestGameState | null,
	stateB: LatestGameState | null,
): GameResultKind {
	const scoreA = stateA?.score;
	const scoreB = stateB?.score;
	if (scoreA == null && scoreB == null) {
		return "draw";
	}
	if (scoreA == null) {
		return "winB";
	}
	if (scoreB == null) {
		return "winA";
	}
	if (scoreA === scoreB) {
		// If score is non-null, state and best_score_submitted_at should also be non-null.
		const submittedAtA = stateA!.best_score_submitted_at!;
		const submittedAtB = stateB!.best_score_submitted_at!;
		return submittedAtA < submittedAtB ? "winA" : "winB";
	} else {
		return scoreA < scoreB ? "winA" : "winB";
	}
}

type Props = {
	game: Game;
	ranking: RankingEntry[];
	latestStates: { [key: string]: LatestGameState };
};

export default function GolfWatchAppGaming1v1({
	game,
	ranking,
	latestStates,
}: Props) {
	const playerA: User | undefined = game.main_players[0];
	const playerB: User | undefined = game.main_players[1];

	const stateA = (playerA && latestStates[`${playerA.user_id}`]) ?? null;
	const codeA = stateA?.code ?? "";
	const scoreA = stateA?.score ?? null;
	const statusA = stateA?.status ?? "none";
	const stateB = (playerB && latestStates[`${playerB.user_id}`]) ?? null;
	const codeB = stateB?.code ?? "";
	const scoreB = stateB?.score ?? null;
	const statusB = stateB?.status ?? "none";

	const codeSizeA = calcCodeSize(codeA);
	const codeSizeB = calcCodeSize(codeB);

	const gameResultKind = checkGameResultKind(stateA, stateB);

	const topBg =
		gameResultKind === "winA"
			? "bg-orange-400"
			: gameResultKind === "winB"
				? "bg-purple-400"
				: "bg-sky-600";

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
			<div className={`text-white ${topBg} grid grid-cols-3 px-4 py-2`}>
				<div className="font-bold flex gap-4 justify-start md:justify-between items-center my-auto">
					<div className="flex gap-6 items-center">
						{playerA?.icon_path && (
							<UserIcon
								iconPath={playerA.icon_path}
								displayName={playerA.display_name}
								className="w-12 h-12 my-auto"
							/>
						)}
						<div className="hidden md:block text-4xl">
							{playerA?.display_name}
						</div>
					</div>
					<div className="text-2xl md:text-6xl">{scoreA}</div>
				</div>
				<div className="font-bold text-center">
					<div className="text-gray-100">{game.display_name}</div>
					<div className="text-3xl">
						{gameResultKind === "winA"
							? `勝者 ${playerA!.display_name}`
							: gameResultKind === "winB"
								? `勝者 ${playerB!.display_name}`
								: "引き分け"}
					</div>
				</div>
				<div className="font-bold flex gap-4 justify-end md:justify-between items-center my-auto">
					<div className="text-2xl md:text-6xl">{scoreB}</div>
					<div className="flex gap-6 items-center text-end">
						<div className="hidden md:block text-4xl">
							{playerB?.display_name}
						</div>
						{playerB?.icon_path && (
							<UserIcon
								iconPath={playerB.icon_path}
								displayName={playerB.display_name}
								className="w-12 h-12 my-auto"
							/>
						)}
					</div>
				</div>
			</div>
			<ScoreBar
				scoreA={scoreA}
				scoreB={scoreB}
				bgA="bg-orange-400"
				bgB="bg-purple-400"
			/>
			<ThreeColumnLayout>
				<TitledColumn
					title={<SubmitStatusLabel status={statusA} />}
					className="order-2 md:order-1"
				>
					<FoldableBorderedContainerWithCaption
						caption={`コードサイズ: ${codeSizeA}`}
					>
						<CodeBlock code={codeA} />
					</FoldableBorderedContainerWithCaption>
				</TitledColumn>
				<TitledColumn title={game.problem.title} className="order-1 md:order-2">
					<ProblemColumnContent
						description={game.problem.description}
						sampleCode={game.problem.sample_code}
					/>
					<RankingTable ranking={ranking} />
				</TitledColumn>
				<TitledColumn
					title={<SubmitStatusLabel status={statusB} />}
					className="order-3"
				>
					<FoldableBorderedContainerWithCaption
						caption={`コードサイズ: ${codeSizeB}`}
					>
						<CodeBlock code={codeB} />
					</FoldableBorderedContainerWithCaption>
				</TitledColumn>
			</ThreeColumnLayout>
		</div>
	);
}
