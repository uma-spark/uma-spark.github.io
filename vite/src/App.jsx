/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
/** biome-ignore-all lint/a11y/useSemanticElements: <explanation> */
/** biome-ignore-all lint/a11y/useFocusableInteractive: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./utils";
import "./App.scss";
import html2canvas from "html2canvas";

function CardItem({ card, clickCard, size }) {
	const source = `/cards/support_card_s_${card.id}.png`;
	const titleIndex = card.name.indexOf("]");
	const cardTitle = card.name.slice(0, titleIndex + 1);
	const cardName = card.name.slice(titleIndex + 2);
	const style = { height: size || 125, width: size || 125 };
	return (
		<div role="button" className="card" onClick={clickCard} style={style}>
			<img className="card-thumb" src={source} alt={cardName}></img>
			<div className="status">
				<img
					className="status-thumb"
					src={`/stats/utx_ico_obtain_0${card.type}.png`}
					alt=""
				></img>
			</div>
			<div className="card-hover">
				<div className="card-title">{cardTitle}</div>
				<div className="card-name">{cardName}</div>
			</div>
		</div>
	);
}

const sizeOptions = [200, 175, 150, 125, 100, 75, 60, 50, 40];
function CardsSelected({ selectedCards, clickCard, header }) {
	const ref = useRef(null);
	const [size, setSize] = useState(150);

	function updateSize(el) {
		const height = el.clientHeight + 8;
		const width = el.clientWidth + 8;
		for (const sizeOption of sizeOptions) {
			const rows = Math.floor(height / (sizeOption + 8));
			const columns = Math.floor(width / (sizeOption + 8));
			const total = rows * columns;
			// console.log(
			// 	"UPDATE!!!",
			// 	height,
			// 	width,
			// 	sizeOption,
			// 	rows,
			// 	columns,
			// 	total,
			// 	selectedCards.length,
			// );
			if (total >= selectedCards.length) {
				setSize(sizeOption);
				break;
			}
		}
	}
	useEffect(() => {
		selectedCards.length;
		updateSize(ref.current);
	});
	useEffect(() => {
		if (!ref.current) return;
		const resizeObserver = new ResizeObserver(() => updateSize(ref.current));
		resizeObserver.observe(ref.current);
		return () => resizeObserver.disconnect();
	});
	const cardItems = selectedCards.map((card) => (
		<CardItem
			key={card.uid || card.id}
			card={card}
			clickCard={() => clickCard(card)}
			size={size}
		></CardItem>
	));
	return (
		<div className="card-selected">
			{header}
			<div className="card-selected-list" ref={ref}>
				{cardItems}
			</div>
		</div>
	);
}

function CardsPicker({
	cards,
	clickCard,
	onClear,
	onFullscreen,
	onDownload,
	onCopy,
	notification,
	hideMenu,
	rarityFilters,
	onRarityFilter,
}) {
	const [filter, setFilter] = useState("");
	const [photoMode, setPhotoMode] = useState(false);
	const pickerCards = cards
		.filter((card) => card.name.toLowerCase().includes(filter.toLowerCase()))
		.map((card) => (
			<CardItem
				key={card.uid || card.id}
				card={card}
				clickCard={() => clickCard(card)}
			></CardItem>
		));

	return photoMode ? (
		<div className="card-picker">
			<div
				className={`card-picker-photo-actions ${hideMenu ? "hide-menu" : ""}`}
			>
				{/* biome-ignore format: svg */}
				<svg onClick={() => setPhotoMode(false)} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" ><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"></path></svg>
				{/* biome-ignore format: svg */}
				<svg onClick={onDownload} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-v-4153d47a=""><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"></path></svg>
				{/* biome-ignore format: svg */}
				<svg onClick={onCopy} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-v-4153d47a=""><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"></path></svg>
				{/* biome-ignore format: svg */}
				<svg onClick={onFullscreen} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"></path></svg>
			</div>
			<span className={`notification ${notification ? "visible" : ""}`}>
				{notification}
			</span>
		</div>
	) : (
		<div className="card-picker">
			<div className="card-picker-actions">
				{/* biome-ignore format: svg */}
				<svg onClick={onClear} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" ><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path> 				</svg>
				{/* biome-ignore format: svg */}
				<svg onClick={() => setPhotoMode(true)} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" ></path></svg>
			</div>
			<div className="filter-items">
				<div
					onClick={() => onRarityFilter(1)}
					className={`filter-icon ${rarityFilters.has(1) ? "active" : ""}`}
				>
					<img src="/rarity/utx_ico_rarity_00.png"></img>
				</div>
				<div
					onClick={() => onRarityFilter(2)}
					className={`filter-icon ${rarityFilters.has(2) ? "active" : ""}`}
				>
					<img src="/rarity/utx_ico_rarity_01.png"></img>
				</div>
				<div
					onClick={() => onRarityFilter(3)}
					className={`filter-icon ${rarityFilters.has(3) ? "active" : ""}`}
				>
					<img src="/rarity/utx_ico_rarity_02.png"></img>
				</div>
				<input
					placeholder="Search for cards..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
				></input>
			</div>
			<div className="card-picker-list">{pickerCards}</div>
		</div>
	);
}

function App({ cards, bannerIds }) {
	const indexedCards = {};
	for (const card of cards) {
		indexedCards[card.id] = card;
	}

	const sparkContainer = useRef(null);
	const [rarityFilters, setRarityFilters] = useState(new Set([2, 3]));
	const [highlightIds, setHighlightIds] = useLocalStorage("highlight", []);
	const [selectedIds, setSelectedIds] = useLocalStorage("selected", []);
	let initialUid = 1;
	const [highlightCards, setHighlightCards] = useState(
		highlightIds.map((id) => ({ ...indexedCards[id], uid: initialUid++ })),
	);
	const [selectedCards, setSelectedCards] = useState(
		selectedIds.map((id) => ({ ...indexedCards[id], uid: initialUid++ })),
	);
	const [uid, setUid] = useState(initialUid);
	const sortedCards = [...cards].sort((a, b) => {
		if (bannerIds.has(a.id)) {
			if (!bannerIds.has(b.id)) return -1;
			return a.rarity === b.rarity ? a.id - b.id : b.rarity - a.rarity;
		} else {
			return bannerIds.has(b.id) ? 1 : 0;
		}
	});
	const pickerCards = useMemo(
		() => sortedCards.filter((c) => rarityFilters.has(c.rarity)),
		[rarityFilters, sortedCards],
	);
	const [pickerHideMenu, setPickerHideMenu] = useState(false);
	const [pickerNotification, setPickerNotification] = useState("");

	function selectCard(card) {
		const _card = { ...card, uid };
		setUid(uid + 1);
		if (bannerIds.has(_card.id)) {
			const cards = [...highlightCards, _card];
			setHighlightCards(cards);
			setHighlightIds(cards.map((c) => c.id));
		} else {
			const cards = [...selectedCards, _card];
			setSelectedCards(cards);
			setSelectedIds(cards.map((c) => c.id));
		}
	}

	function removeHighlightCard(card) {
		const cards = highlightCards.filter((c) => c !== card);
		setHighlightCards(cards);
		setHighlightIds(cards.map((card) => card.id));
	}
	function removeSelectedCard(card) {
		const cards = selectedCards.filter((c) => c !== card);
		setSelectedCards(cards);
		setSelectedIds(cards.map((card) => card.id));
	}
	function clearCards() {
		setSelectedCards([]);
		setSelectedIds([]);
		setHighlightCards([]);
		setHighlightIds([]);
	}

	function onFullscreen() {
		const isFullscreen = Boolean(document.fullscreenElement);
		if (isFullscreen) {
			document.exitFullscreen();
		} else {
			sparkContainer.current.requestFullscreen();
		}
	}

	function onDownload() {
		setPickerHideMenu(true);
		setTimeout(async () => {
			const canvas = await html2canvas(sparkContainer.current);
			setPickerHideMenu(false);
			const a = document.createElement("a");
			a.download = "uma-spark.png";
			a.href = canvas.toDataURL();
			a.click();
		}, 0);
	}

	function onCopy() {
		setPickerHideMenu(true);
		setTimeout(async () => {
			const canvas = await html2canvas(sparkContainer.current);
			setPickerHideMenu(false);
			canvas.toBlob(async (blob) => {
				await navigator.clipboard.write([
					new ClipboardItem({ "image/png": blob }),
				]);
				setPickerNotification("Copied!");
				setTimeout(() => setPickerNotification(""), 2000);
			});
		}, 0);
	}

	function onRarityFilter(rarity) {
		const filters = new Set(rarityFilters);
		if (filters.has(rarity)) {
			filters.delete(rarity);
		} else {
			filters.add(rarity);
		}
		setRarityFilters(filters);
	}

	return (
		<div className="spark-container" ref={sparkContainer}>
			<div className="spark-selected">
				<CardsSelected
					selectedCards={highlightCards}
					clickCard={removeHighlightCard}
					header={
						<img
							className="highlight-img"
							src="/banner/img_bnr_gacha_30011.png"
							alt=""
						></img>
					}
				></CardsSelected>
				<CardsSelected
					selectedCards={selectedCards}
					clickCard={removeSelectedCard}
					header={
						<img
							className="highlight-img"
							src="/item/item_icon_00050.png"
							alt=""
						></img>
					}
				></CardsSelected>
			</div>
			<CardsPicker
				cards={pickerCards}
				clickCard={selectCard}
				onClear={clearCards}
				onFullscreen={onFullscreen}
				onDownload={onDownload}
				onCopy={onCopy}
				notification={pickerNotification}
				hideMenu={pickerHideMenu}
				rarityFilters={rarityFilters}
				onRarityFilter={onRarityFilter}
			></CardsPicker>
		</div>
	);
}

export default App;
