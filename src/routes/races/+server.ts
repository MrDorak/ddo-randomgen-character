import { json } from '@sveltejs/kit';

export const prerender = true

export interface Race {
    name: string;
    selected: boolean | string;
    statsMod?: { increasedStats: Array<object>, loweredStats?: Array<object> };
    forcedClass?: string
    isIconic: boolean
}

const free_races: Array<Race> = [
    {
        name: "dragonborn",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ],
            loweredStats : [ { name: "DEX", value: 2 } ],
        }
    },
    {
        name: "drow",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, { name: "INT", value: 2 }, { name: "CHA", value: 2 }, ],
            loweredStats : [ { name: "CON", value: 2 } ]
        }
    },
    {
        name: "dwarf",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 } ],
            loweredStats : [ { name: "CHA", value: 2 } ]
        }
    },
    {
        name: "elf",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "CON", value: 2 } ]
        }
    },
    {
        name: "gnome",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 } ],
            loweredStats : [ { name: "STR", value: 2 } ]
        }
    },
    {
        name: "halfling",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "STR", value: 2 } ]
        }
    },
    {
        name: "half_elf",
        selected: true,
        isIconic: false,
    },
    {
        name: "half_orc",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "STR", value: 2 } ],
            loweredStats : [ { name: "INT", value: 2 }, { name: "CHA", value: 2 } ]
        }
    },
    {
        name: "human",
        selected: true,
        isIconic: false,
    },
    {
        name: "tiefling",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CHA", value: 2 } ],
        }
    },
    {
        name: "warforged",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 } ],
            loweredStats : [ { name: "WIS", value: 2 }, { name: "CHA", value: 2 } ]
        }
    },
    {
        name: "wood_elf",
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
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "WIS", value: 2 } ]
        }
    },
    {
        name: "shifter",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "INT", value: 2 } ],
        }
    },
    {
        name: "tabaxi",
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
        selected: true,
        isIconic: true,
        forcedClass: 'ranger',
        statsMod: {
            increasedStats : [ { name: "WIS", value: 2 } ]
        }
    },
    {
        name: "bladeforged",
        selected: true,
        isIconic: true,
        forcedClass: 'paladin',
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 }, ],
            loweredStats : [ { name: "DEX", value: 2 }, { name: "WIS", value: 2 }, ]
        }
    },
    {
        name: "deep_gnome",
        selected: true,
        isIconic: true,
        forcedClass: 'wizard',
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 }, { name: "WIS", value: 2 }, ],
            loweredStats : [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ]
        }
    },
    {
        name: "morninglord",
        selected: true,
        isIconic: true,
        forcedClass: 'cleric',
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 }, ],
            loweredStats : [ { name: "CON", value: 2 }, ]
        }
    },
    {
        name: "purple_dragon_knight",
        selected: true,
        isIconic: true,
        forcedClass: 'fighter',
    },
    {
        name: "shadar_kai",
        selected: true,
        isIconic: true,
        forcedClass: 'rogue',
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, ],
            loweredStats : [ { name: "CHA", value: 2 }, ]
        }
    },
    {
        name: "tiefling_scoundrel",
        selected: true,
        isIconic: true,
        forcedClass: 'bard',
        statsMod: {
            increasedStats : [ { name: "CHA", value: 2 }, ],
        }
    },
    {
        name: "trailblazer",
        selected: true,
        isIconic: true,
        forcedClass: 'monk',
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, ],
        }
    },
    {
        name: "razorclaw",
        forcedClass: 'barbarian',
        selected: true,
        isIconic: true,
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
