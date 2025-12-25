(function(exports) {

"use strict";

//#region plugins/clicker/index.tsx
const { GuildMemberStore, ChannelStore, SelectedChannelStore, RelationshipStore } = shelter.flux.storesFlat;
const { util: { getFiber, reactFiberWalker }, observeDom, util: { log } } = shelter;
const { subscribe } = shelter.plugin.scoped.flux;
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

//#endregion
exports.onLoad = onLoad
exports.onUnload = onUnload
return exports;
})({});