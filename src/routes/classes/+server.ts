import { json } from '@sveltejs/kit';

export const prerender = true

export interface Class {
    name: string;
    displayName: string;
    selected: boolean | string;
    isArchetype: boolean
    weightedStats: Array<object>
}

const free_classes: Array<Class> = [
    {
        name: "barbarian",
        displayName: "Barbarian",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "CON", value: 2 }, ]
    },
    {
        name: "bard",
        displayName: "Bard",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 3 }, ]
    },
    {
        name: "cleric",
        displayName: "Cleric",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 2 }, { name: "WIS", value: 2 }, ]
    },
    {
        name: "druid",
        displayName: "Druid",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "fighter",
        displayName: "Fighter",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "monk",
        displayName: "Monk",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "paladin",
        displayName: "Paladin",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ]
    },
    {
        name: "ranger",
        displayName: "Ranger",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "DEX", value: 2 }, { name: "WIS", value: 2 }, ]
    },
    {
        name: "rogue",
        displayName: "Rogue",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "DEX", value: 2 }, { name: "INT", value: 2 }, ]
    },
    {
        name: "sorcerer",
        displayName: "Sorcerer",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 3 }, ]
    },
    {
        name: "warlock",
        displayName: "Warlock",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "wizard",
        displayName: "Wizard",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 3 }, ]
    },
]

const premium_classes: Array<Class> = [
    {
        name: "alchemist",
        displayName: "Alchemist",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 3 }, ]
    },
    {
        name: "artificer",
        displayName: "Artificer",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "favored_soul",
        displayName: "Favored Soul",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "CHA", value: 2 }, ]
    },
]

const archetype_classes: Array<Class> = [
    {
        name: "acolyte_of_the_skin",
        displayName: "Acolyte of the Skin",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 3 }, ]
    },
    {
        name: "blight_caster",
        displayName: "Blight Caster",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "WIS", value: 3 }, ]
    },
    {
        name: "dark_apostate",
        displayName: "Dark Apostate",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "WIS", value: 2 },  { name: "CHA", value: 2 }, ]
    },
    {
        name: "dark_hunter",
        displayName: "Dark Hunter",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "DEX", value: 2 },  { name: "INT", value: 2 }, ]
    },
    {
        name: "sacred_fist",
        displayName: "Sacred Fist",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 2 },  { name: "DEX", value: 2 }, ]
    },
    {
        name: "stormsinger",
        displayName: "Stormsinger",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 3 }, ]
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
