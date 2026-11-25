type Props = {
	scoreA: number | null;
	scoreB: number | null;
	bgA: string;
	bgB: string;
};

export default function ScoreBar({ scoreA, scoreB, bgA, bgB }: Props) {
	let scoreRatio: number;
	if (scoreA === null && scoreB === null) {
		scoreRatio = 50;
	} else if (scoreA === null) {
		scoreRatio = 0;
	} else if (scoreB === null) {
		scoreRatio = 100;
	} else {
		const rawRatio = scoreB / (scoreA + scoreB);
		const k = 3.0;
		const emphasizedRatio =
			rawRatio ** k / (rawRatio ** k + (1 - rawRatio) ** k);
		scoreRatio = emphasizedRatio * 100;
	}

	return (
		<div className={`w-full ${bgB}`}>
			<div className={`h-10 ${bgA}`} style={{ width: `${scoreRatio}%` }}></div>
		</div>
	);
}
