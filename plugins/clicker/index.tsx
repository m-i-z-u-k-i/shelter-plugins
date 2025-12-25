const {
  GuildMemberStore,
  ChannelStore,
  SelectedChannelStore,
  RelationshipStore
} = shelter.flux.storesFlat;
const {
  util: { getFiber, reactFiberWalker },
  observeDom
} = shelter;
const { subscribe } = shelter.plugin.scoped.flux;

export function onLoad() { // optional
}

export function onUnload() { // required
    console.log("meow and goodbye!")
}

function handleDispatch(payload) {
    if ((payload.channelId !== "1408931102940205156" && !payload.content.includes("!click")) || payload.channelId == "1410138227494617151") return;
    new Audio('https://cdn.discordapp.com/soundboard-sounds/1442006037522546688').play()
}

subscribe("MESSAGE_CREATE", handleDispatch)
