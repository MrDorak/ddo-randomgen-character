import { json } from '@sveltejs/kit';

export const prerender = true

export interface Class {
    name: string;
    selected: boolean | string;
    isArchetype: boolean
    weightedStats: Array<object>
}

const free_classes: Array<Class> = [
    {
        name: "barbarian",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "CON", value: 2 }, ]
    },
    {
        name: "bard",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 3 }, ]
    },
    {
        name: "cleric",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 2 }, { name: "WIS", value: 2 }, ]
    },
    {
        name: "druid",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "fighter",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "monk",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "paladin",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ]
    },
    {
        name: "ranger",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "DEX", value: 2 }, { name: "WIS", value: 2 }, ]
    },
    {
        name: "rogue",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "DEX", value: 2 }, { name: "INT", value: 2 }, ]
    },
    {
        name: "sorcerer",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 3 }, ]
    },
    {
        name: "warlock",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "wizard",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 3 }, ]
    },
]

const premium_classes: Array<Class> = [
    {
        name: "alchemist",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 3 }, ]
    },
    {
        name: "artificer",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 2 }, { name: "DEX", value: 2 }, ]
    },
    {
        name: "favored_soul",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 2 }, { name: "CHA", value: 2 }, ]
    },
]

const archetype_classes: Array<Class> = [
    {
        name: "acolyte_of_the_skin",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 3 }, ]
    },
    {
        name: "blight_caster",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "WIS", value: 3 }, ]
    },
    {
        name: "dark_apostate",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "WIS", value: 2 },  { name: "CHA", value: 2 }, ]
    },
    {
        name: "dark_hunter",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "DEX", value: 2 },  { name: "INT", value: 2 }, ]
    },
    {
        name: "sacred_fist",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 2 },  { name: "DEX", value: 2 }, ]
    },
    {
        name: "stormsinger",
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
