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
        weightedStats: [ { name: "STR", value: 3 }, { name: "CON", value: 3 }, ]
    },
    {
        name: "bard",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 5 }, ]
    },
    {
        name: "cleric",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 3 }, { name: "WIS", value: 3 }, ]
    },
    {
        name: "druid",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 3 }, { name: "DEX", value: 3 }, ]
    },
    {
        name: "fighter",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 3 }, { name: "DEX", value: 3 }, ]
    },
    {
        name: "monk",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 3 }, { name: "DEX", value: 3 }, ]
    },
    {
        name: "paladin",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "STR", value: 3 }, { name: "CHA", value: 3 }, ]
    },
    {
        name: "ranger",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "DEX", value: 3 }, { name: "WIS", value: 3 }, ]
    },
    {
        name: "rogue",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "DEX", value: 3 }, { name: "INT", value: 3 }, ]
    },
    {
        name: "sorcerer",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 5 }, ]
    },
    {
        name: "warlock",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "CHA", value: 3 }, { name: "DEX", value: 3 }, ]
    },
    {
        name: "wizard",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 5 }, ]
    },
]

const premium_classes: Array<Class> = [
    {
        name: "alchemist",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 5 }, ]
    },
    {
        name: "artificer",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "INT", value: 3 }, { name: "DEX", value: 3 }, ]
    },
    {
        name: "favored_soul",
        selected: true,
        isArchetype: false,
        weightedStats: [ { name: "WIS", value: 3 }, { name: "CHA", value: 3 }, ]
    },
]

const archetype_classes: Array<Class> = [
    {
        name: "acolyte_of_the_skin",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 5 }, ]
    },
    {
        name: "blight_caster",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "WIS", value: 5 }, ]
    },
    {
        name: "dark_apostate",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "WIS", value: 3 },  { name: "CHA", value: 3 }, ]
    },
    {
        name: "dark_hunter",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "DEX", value: 3 },  { name: "INT", value: 3 }, ]
    },
    {
        name: "sacred_fist",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 3 },  { name: "DEX", value: 3 }, ]
    },
    {
        name: "stormsinger",
        selected: true,
        isArchetype: true,
        weightedStats: [ { name: "CHA", value: 5 }, ]
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
