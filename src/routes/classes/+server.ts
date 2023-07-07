import { json } from '@sveltejs/kit';

export const prerender = true

interface Stat {
    name: string
    value: number
}

interface Tree {
    name: string
    alias: string
    value: number
}

export interface Class {
    name: string;
    displayName: string;
    selected: boolean | string;
    isArchetype: boolean;
    weightedStats: Array<Stat>;
    enhancementTrees: Array<Tree>
}

const free_classes: Array<Class> = [
    {
        name: "barbarian",
        displayName: "Barbarian",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "CON", value: 2 }, ],
        enhancementTrees: [
            { name : "Frenzied Berserker", alias: "frenzied_berserker", value: 0 },
            { name : "Occult Slayer", alias: "occult_slayer", value: 0 },
            { name : "Ravager", alias: "ravager", value: 0 },
        ]
    },
    {
        name: "bard",
        displayName: "Bard",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 3 }, ],
        enhancementTrees: [
            { name : "Spellsinger", alias: "spellsinger", value: 0 },
            { name : "Warchanter", alias: "warchanter", value: 0 },
            { name : "Swashbuckler", alias: "swashbuckler", value: 0 },
        ]
    },
    {
        name: "cleric",
        displayName: "Cleric",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 2 }, { name: "WIS", value: 2 }, ],
        enhancementTrees: [
            { name : "Divine Disciple", alias: "divine_disciple", value: 0 },
            { name : "Radiant Servant", alias: "radiant_servant", value: 0 },
            { name : "Warpriest", alias: "warpriest", value: 0 },
        ]
    },
    {
        name: "druid",
        displayName: "Druid",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "DEX", value: 2 }, ],
        enhancementTrees: [
            { name : "Season's Herald", alias: "seasons_herald", value: 0 },
            { name : "Nature's Warrior", alias: "natures_warrior", value: 0 },
            { name : "Nature's Protector", alias: "natures_protector", value: 0 },
        ]
    },
    {
        name: "fighter",
        displayName: "Fighter",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "DEX", value: 2 }, ],
        enhancementTrees: [
            { name : "Kensei", alias: "kensei", value: 0 },
            { name : "Stalwart Defender", alias: "stalwart_defender", value: 0 },
            { name : "Vanguard", alias: "vanguard", value: 0 },
        ]
    },
    {
        name: "monk",
        displayName: "Monk",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "DEX", value: 2 }, ],
        enhancementTrees: [
            { name : "Henshin Mystic", alias: "henshin_mystic", value: 0 },
            { name : "Ninja Spy", alias: "ninja_spy", value: 0 },
            { name : "Shintao Monk", alias: "shintao_monk", value: 0 },
        ]
    },
    {
        name: "paladin",
        displayName: "Paladin",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ],
        enhancementTrees: [
            { name : "Sacred Defender", alias: "sacred_defender", value: 0 },
            { name : "Knight of the Chalice", alias: "knight_of_the_chalice", value: 0 },
            { name : "Vanguard", alias: "vanguard", value: 0 },
        ]
    },
    {
        name: "ranger",
        displayName: "Ranger",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "DEX", value: 2 }, { name: "WIS", value: 2 }, ],
        enhancementTrees: [
            { name : "Arcane Archer", alias: "arcane_archer", value: 0 },
            { name : "Deepwood Stalker", alias: "deepwood_stalker", value: 0 },
            { name : "Tempest", alias: "tempest", value: 0 },
        ]
    },
    {
        name: "rogue",
        displayName: "Rogue",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "DEX", value: 2 }, { name: "INT", value: 2 }, ],
        enhancementTrees: [
            { name : "Assassin", alias: "assassin", value: 0 },
            { name : "Mechanic", alias: "mechanic", value: 0 },
            { name : "Thief-Acrobat", alias: "thief_acrobat", value: 0 },
        ]
    },
    {
        name: "sorcerer",
        displayName: "Sorcerer",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 3 }, ],
        enhancementTrees: [
            { name : "Air Savant", alias: "air_savant", value: 0 },
            { name : "Water Savant", alias: "water_savant", value: 0 },
            { name : "Earth Savant", alias: "earth_savant", value: 0 },
            { name : "Fire Savant", alias: "fire_savant", value: 0 },
            { name : "Eldritch Knight", alias: "eldritch_knight", value: 0 },
        ]
    },
    {
        name: "warlock",
        displayName: "Warlock",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 2 }, { name: "DEX", value: 2 }, ],
        enhancementTrees: [
            { name : "Enlightened Spirit", alias: "enlightened_spirit", value: 0 },
            { name : "Soul Eater", alias: "soul_eater", value: 0 },
            { name : "Tainted Scholar", alias: "tainted_scholar", value: 0 },
        ]
    },
    {
        name: "wizard",
        displayName: "Wizard",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 3 }, ],
        enhancementTrees: [
            { name : "Archmage", alias: "archmage", value: 0 },
            { name : "Pale Master", alias: "pale_master", value: 0 },
            { name : "Eldritch Knight", alias: "eldritch_knight", value: 0 },
        ]
    },
]

const premium_classes: Array<Class> = [
    {
        name: "alchemist",
        displayName: "Alchemist",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 3 }, ],
        enhancementTrees: [
            { name : "Apothecary", alias: "apothecary", value: 0 },
            { name : "Bombardier", alias: "bombardier", value: 0 },
            { name : "Vile Chemist", alias: "vile_chemist", value: 0 },
        ]
    },
    {
        name: "artificer",
        displayName: "Artificer",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 2 }, { name: "DEX", value: 2 }, ],
        enhancementTrees: [
            { name : "Arcanotechnician", alias: "arcanotechnician", value: 0 },
            { name : "Battle Engineer", alias: "battle_engineer", value: 0 },
            { name : "Renegade Mastermaker", alias: "renegade_mastermaker", value: 0 },
        ]
    },
    {
        name: "favored_soul",
        displayName: "Favored Soul",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "CHA", value: 2 }, ],
        enhancementTrees: [
            { name : "Angel of Vengeance", alias: "angel_of_vengeance", value: 0 },
            { name : "Beacon of Hope", alias: "beacon_of_hope", value: 0 },
            { name : "War Soul", alias: "war_soul", value: 0 },
        ]
    },
]

const archetype_classes: Array<Class> = [
    {
        name: "acolyte_of_the_skin",
        displayName: "Acolyte of the Skin",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 3 }, ],
        enhancementTrees: [
            { name : "Acolyte of the Skin", alias: "acolyte_of_the_skin", value: 0 },
            { name : "Soul Eater", alias: "soul_eater", value: 0 },
            { name : "Tainted Scholar", alias: "tainted_scholar", value: 0 },
        ]
    },
    {
        name: "blight_caster",
        displayName: "Blight Caster",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "WIS", value: 3 }, ],
        enhancementTrees: [
            { name : "Season's Herald", alias: "seasons_herald", value: 0 },
            { name : "Nature's Warrior", alias: "natures_warrior", value: 0 },
            { name : "Blight Caster", alias: "blight_caster", value: 0 },
        ]
    },
    {
        name: "dark_apostate",
        displayName: "Dark Apostate",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "WIS", value: 2 },  { name: "CHA", value: 2 }, ],
        enhancementTrees: [
            { name : "Divine Disciple", alias: "divine_disciple", value: 0 },
            { name : "Dark Apostate", alias: "dark_apostate", value: 0 },
            { name : "Warpriest", alias: "warpriest", value: 0 },
        ]
    },
    {
        name: "dark_hunter",
        displayName: "Dark Hunter",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "DEX", value: 2 },  { name: "INT", value: 2 }, ],
        enhancementTrees: [
            { name : "Dark Hunter", alias: "dark_hunter", value: 0 },
            { name : "Deepwood Stalker", alias: "deepwood_stalker", value: 0 },
            { name : "Tempest", alias: "tempest", value: 0 },
        ]
    },
    {
        name: "sacred_fist",
        displayName: "Sacred Fist",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 2 },  { name: "DEX", value: 2 }, ],
        enhancementTrees: [
            { name : "Sacred Defender", alias: "sacred_defender", value: 0 },
            { name : "Radiant Servant", alias: "radiant_servant", value: 0 },
            { name : "Sacred Fist", alias: "sacred_fist", value: 0 },
        ]
    },
    {
        name: "stormsinger",
        displayName: "Stormsinger",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 3 }, ],
        enhancementTrees: [
            { name : "Spellsinger", alias: "spellsinger", value: 0 },
            { name : "Warchanter", alias: "warchanter", value: 0 },
            { name : "Stormsinger", alias: "stormsinger", value: 0 },
        ]
    },
]

export function GET(): Response {
    const classes: {
        free: Class[],
        premium: Class[],
        archetype: Class[]
    } = {
        "free" : free_classes,
        "premium" : premium_classes,
        "archetype" : archetype_classes,
    };

    return json(classes);
}
