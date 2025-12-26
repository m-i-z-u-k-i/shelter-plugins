const {
    GuildMemberStore,
    ChannelStore,
    SelectedChannelStore,
    RelationshipStore,
    SoundStore
} = shelter.flux.storesFlat;

const {
    util: { getFiber, reactFiberWalker },
    observeDom,
    util: { log },
    plugin: { store }
} = shelter;
const { TextArea } = shelter.ui;

const { subscribe } = shelter.plugin.scoped.flux;
export const settings = () => (
    <TextArea
        value={'// please separate allowed user ids with line breaks\n' + (store.ids.join("\n") || "")}
        mono
        onInput={onInput}
        resize-x
        resize-y
    />
)
let allowedUsers;
let lastPlayTime = 0;

const processedMessageIds = new Set();

export function onLoad() {
    subscribe("MESSAGE_CREATE", handleDispatch);
    log("owo! im there!");
}

export function onUnload() {
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
    if (now - lastPlayTime < 1000) {
        log("too soon since last click! waiting~");
        return;
    }

    lastPlayTime = now;

    log("found valid !click message! playing sound uwu");
    new Audio('https://cdn.discordapp.com/soundboard-sounds/1442006037522546688').play();
}

function onInput(text: string) {
    store.ids = text.split("\n").filter(line => !line.startsWith("//"))
    log(store.ids)
}
