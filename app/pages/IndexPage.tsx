import BorderedContainer from "../components/BorderedContainer";
import NavigateLink from "../components/NavigateLink";
import { BASE_PATH } from "../config";

export default function IndexPage() {
	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-y-6">
			<img
				src={`${BASE_PATH}logo.svg`}
				alt="iOSDC Japan 2025"
				className="w-96 h-auto"
			/>
			<div className="text-center">
				<div className="font-bold text-transparent bg-clip-text bg-iosdc-japan">
					<div className="text-6xl">Swift Code Battle</div>
				</div>
			</div>
			<div className="mx-2">
				<BorderedContainer>
					<p className="text-gray-900 max-w-prose">
						Swift コードバトルは指示された動作をする Swift
						コードをより短く書けた方が勝ち、という 1 対 1
						の対戦コンテンツです。9/6
						に実施された予選を勝ち抜いたプレイヤーによるトーナメント形式での
						コードバトルを 9/19 (金) day0
						に実施します。ここでは短いコードが正義です！
						可読性も保守性も放り投げた、イベントならではのコードをお楽しみください！
					</p>
					<div className="mt-4 pt-4 border-t border-gray-300 max-w-prose">
						<p className="font-bold text-gray-900">追記</p>
						<p className="mt-2 text-gray-900">
							イベントは終了しました。ご参加いただいたみなさま、ありがとうございました！
							出題された問題や提出コード、トーナメント結果はこちらからご覧いただけます。
						</p>
						<div className="mt-4 flex justify-center gap-4">
							<NavigateLink to="/dashboard/">問題一覧</NavigateLink>
							<NavigateLink to="/tournament/">トーナメント結果</NavigateLink>
						</div>
					</div>
				</BorderedContainer>
			</div>
		</div>
	);
}
