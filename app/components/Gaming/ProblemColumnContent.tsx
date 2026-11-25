import FoldableBorderedContainerWithCaption from "../FoldableBorderedContainerWithCaption";
import CodeBlock from "./CodeBlock";

function SwiftNotice() {
	return (
		<FoldableBorderedContainerWithCaption caption="スコア計算・Swift 環境">
			<div className="text-gray-700 flex flex-col gap-2">
				<p>スコアはコード中の全 ASCII 空白文字を除去した後のバイト数です。</p>
				<p>
					同じスコアを出した場合、より提出が早かったプレイヤーの勝ちとなります。
				</p>
				<p>
					この環境の Swift バージョンは{" "}
					<strong className="font-bold">6.1.2</strong> です。
					ファイルアクセスやネットワークアクセスはできません。
				</p>
				<p>
					テストの成否は、標準出力へ出力された文字列を比較して判定されます。
					末尾の改行はあってもなくても構いません。
					標準エラー出力の内容は無視されますが、fatal error
					等で実行が中断された場合は失敗扱いとなります。
				</p>
			</div>
		</FoldableBorderedContainerWithCaption>
	);
}

type Props = {
	description: string;
	sampleCode: string;
	sampleCodeHtml: string;
};

export default function ProblemColumnContent({
	description,
	sampleCode,
	sampleCodeHtml,
}: Props) {
	return (
		<>
			<FoldableBorderedContainerWithCaption caption="問題">
				<pre className="text-gray-700 whitespace-pre-wrap break-words">
					{description}
				</pre>
			</FoldableBorderedContainerWithCaption>
			<FoldableBorderedContainerWithCaption caption="サンプルコード">
				<CodeBlock code={sampleCode} html={sampleCodeHtml} />
			</FoldableBorderedContainerWithCaption>
			<SwiftNotice />
		</>
	);
}
