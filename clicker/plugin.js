(function(exports) {

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region solid-js/web
var require_web = __commonJS({ "solid-js/web"(exports, module) {
	module.exports = shelter.solidWeb;
} });

//#endregion
//#region plugins/clicker/index.tsx
var import_web = __toESM(require_web(), 1);
const { GuildMemberStore, ChannelStore, SelectedChannelStore, RelationshipStore, SoundStore } = shelter.flux.storesFlat;
const { util: { getFiber, reactFiberWalker }, observeDom, util: { log }, plugin: { store } } = shelter;
const { TextArea } = shelter.ui;
store.ids = [];
const { subscribe } = shelter.plugin.scoped.flux;
const settings = () => (0, import_web.createComponent)(TextArea, {
	get value() {
		return "// please separate allowed user ids with line breaks\n" + (store.ids.join("\n") || "");
	},
	mono: true,
	onInput,
	"resize-x": true,
	"resize-y": true
});
let lastPlayTime = 0;
const processedMessageIds = new Set();
function onLoad() {
	subscribe("MESSAGE_CREATE", handleDispatch);
	log("owo! im there!");
}
function onUnload() {
	processedMessageIds.clear();
	log("meow and goodbye!");
}
function handleDispatch(payload) {
	if (payload.type !== "MESSAGE_CREATE") return;
	const message = payload.message;
	if (!message) return;
	const content = message.content || "";
	if (!content.includes("!click")) return;
	if (!store.ids.includes(message.author.id)) {
		log("user not in allowed list!");
		return;
	}
	if (processedMessageIds.has(message.id)) {
		log("duplicate message ignored :3");
		return;
	}
	processedMessageIds.add(message.id);
	if (processedMessageIds.size > 100) {
		const iterator = processedMessageIds.keys();
		for (let i = 0; i < 50; i++) processedMessageIds.delete(iterator.next().value);
	}
	const now = Date.now();
	if (now - lastPlayTime < 1e3) {
		log("too soon since last click! waiting~");
		return;
	}
	lastPlayTime = now;
	log("found valid !click message! playing sound uwu");
	new Audio("https://cdn.discordapp.com/soundboard-sounds/1442006037522546688").play();
}
function onInput(text) {
	store.ids = text.split("\n").filter((line) => !line.startsWith("//"));
	log(store.ids);
}

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
exports.settings = settings
return exports;
})({});