import { json } from '@sveltejs/kit';

export const prerender = true

export interface Race {
    name: string;
    displayName: string;
    selected: boolean | string;
    statsMod?: { increasedStats: Array<object>, loweredStats?: Array<object> };
    forcedClass?: string
    displayForcedClass?: string
    isIconic: boolean
}

const free_races: Array<Race> = [
    {
        name: "dragonborn",
        displayName: "Dragonborn",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ],
            loweredStats : [ { name: "DEX", value: 2 } ],
        }
    },
    {
        name: "drow",
        displayName: "Drow",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, { name: "INT", value: 2 }, { name: "CHA", value: 2 }, ],
            loweredStats : [ { name: "CON", value: 2 } ]
        }
    },
    {
        name: "dwarf",
        displayName: "Dwarf",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 } ],
            loweredStats : [ { name: "CHA", value: 2 } ]
        }
    },
    {
        name: "elf",
        displayName: "Elf",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "CON", value: 2 } ]
        }
    },
    {
        name: "gnome",
        displayName: "Gnome",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 } ],
            loweredStats : [ { name: "STR", value: 2 } ]
        }
    },
    {
        name: "halfling",
        displayName: "Halfling",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "STR", value: 2 } ]
        }
    },
    {
        name: "half_elf",
        displayName: "Half-Elf",
        selected: true,
        isIconic: false,
    },
    {
        name: "half_orc",
        displayName: "Half-Orc",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "STR", value: 2 } ],
            loweredStats : [ { name: "INT", value: 2 }, { name: "CHA", value: 2 } ]
        }
    },
    {
        name: "human",
        displayName: "Human",
        selected: true,
        isIconic: false,
    },
    {
        name: "tiefling",
        displayName: "Tiefling",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CHA", value: 2 } ],
        }
    },
    {
        name: "warforged",
        displayName: "Warforged",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 } ],
            loweredStats : [ { name: "WIS", value: 2 }, { name: "CHA", value: 2 } ]
        }
    },
    {
        name: "wood_elf",
        displayName: "Wood Elf",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "INT", value: 2 } ]
        }
    },
];

const premium_races: Array<Race> = [
    {
        name: "aasimar",
        displayName: "Aasimar",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "WIS", value: 2 } ]
        }
    },
    {
        name: "shifter",
        displayName: "Shifter",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "INT", value: 2 } ],
        }
    },
    {
        name: "tabaxi",
        displayName: "Tabaxi",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ]
        }
    }
];

const iconic_races: Array<Race> = [
    {
        name: "aasimar_scourge",
        displayName: "Aasimar Scourge",
        selected: true,
        isIconic: true,
        forcedClass: 'ranger',
        displayForcedClass: 'Ranger',
        statsMod: {
            increasedStats : [ { name: "WIS", value: 2 } ]
        }
    },
    {
        name: "bladeforged",
        displayName: "Bladeforged",
        selected: true,
        isIconic: true,
        forcedClass: 'paladin',
        displayForcedClass: 'Paladin',
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 }, ],
            loweredStats : [ { name: "DEX", value: 2 }, { name: "WIS", value: 2 }, ]
        }
    },
    {
        name: "deep_gnome",
        displayName: "Deep Gnome",
        selected: true,
        isIconic: true,
        forcedClass: 'wizard',
        displayForcedClass: 'Wizard',
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 }, { name: "WIS", value: 2 }, ],
            loweredStats : [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ]
        }
    },
    {
        name: "morninglord",
        displayName: "Morninglord",
        selected: true,
        isIconic: true,
        forcedClass: 'cleric',
        displayForcedClass: 'Cleric',
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 }, ],
            loweredStats : [ { name: "CON", value: 2 }, ]
        }
    },
    {
        name: "purple_dragon_knight",
        displayName: "Purple Dragon Knight",
        selected: true,
        isIconic: true,
        forcedClass: 'fighter',
        displayForcedClass: 'Fighter',
    },
    {
        name: "shadar_kai",
        displayName: "Shadar-kai",
        selected: true,
        isIconic: true,
        forcedClass: 'rogue',
        displayForcedClass: 'Rogue',
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, ],
            loweredStats : [ { name: "CHA", value: 2 }, ]
        }
    },
    {
        name: "tiefling_scoundrel",
        displayName: "Tiefling Scoundrel",
        selected: true,
        isIconic: true,
        forcedClass: 'bard',
        displayForcedClass: 'Bard',
        statsMod: {
            increasedStats : [ { name: "CHA", value: 2 }, ],
        }
    },
    {
        name: "trailblazer",
        displayName: "Tabaxi Trailblazer",
        selected: true,
        isIconic: true,
        forcedClass: 'monk',
        displayForcedClass: 'Monk',
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, ],
        }
    },
    {
        name: "razorclaw",
        displayName: "Razorclaw Shifter",
        selected: true,
        isIconic: true,
        forcedClass: 'barbarian',
        displayForcedClass: 'Barbarian',
        statsMod: {
            increasedStats : [ { name: "STR", value: 2 }, ],
            loweredStats : [ { name: "INT", value: 2 }, ]
        }
    }
];

export function GET(): Response {
    const races: {
        free: Race[],
        premium: Race[],
        iconic: Race[]
    } = {
        "free" : free_races,
        "premium" : premium_races,
        "iconic" : iconic_races,
    };

    return json(races);
}
