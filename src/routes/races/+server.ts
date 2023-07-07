import { json } from '@sveltejs/kit';

interface Stat {
    name: string
    value: number
}

export const prerender = true

export interface Race {
    alias: string;
    name: string;
    selected: boolean | string;
    statsMod?: { increasedStats: Array<Stat>, loweredStats?: Array<Stat> };
    forcedClass?: string
    forcedClassName?: string
    isIconic: boolean
}

const free_races: Array<Race> = [
    {
        alias: "dragonborn",
        name: "Dragonborn",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ],
            loweredStats : [ { name: "DEX", value: 2 } ],
        }
    },
    {
        alias: "drow",
        name: "Drow",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, { name: "INT", value: 2 }, { name: "CHA", value: 2 }, ],
            loweredStats : [ { name: "CON", value: 2 } ]
        }
    },
    {
        alias: "dwarf",
        name: "Dwarf",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 } ],
            loweredStats : [ { name: "CHA", value: 2 } ]
        }
    },
    {
        alias: "elf",
        name: "Elf",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "CON", value: 2 } ]
        }
    },
    {
        alias: "gnome",
        name: "Gnome",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 } ],
            loweredStats : [ { name: "STR", value: 2 } ]
        }
    },
    {
        alias: "halfling",
        name: "Halfling",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "STR", value: 2 } ]
        }
    },
    {
        alias: "half_elf",
        name: "Half-Elf",
        selected: true,
        isIconic: false,
    },
    {
        alias: "half_orc",
        name: "Half-Orc",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "STR", value: 2 } ],
            loweredStats : [ { name: "INT", value: 2 }, { name: "CHA", value: 2 } ]
        }
    },
    {
        alias: "human",
        name: "Human",
        selected: true,
        isIconic: false,
    },
    {
        alias: "tiefling",
        name: "Tiefling",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CHA", value: 2 } ],
        }
    },
    {
        alias: "warforged",
        name: "Warforged",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 } ],
            loweredStats : [ { name: "WIS", value: 2 }, { name: "CHA", value: 2 } ]
        }
    },
    {
        alias: "wood_elf",
        name: "Wood Elf",
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
        alias: "aasimar",
        name: "Aasimar",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "WIS", value: 2 } ]
        }
    },
    {
        alias: "shifter",
        name: "Shifter",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ],
            loweredStats : [ { name: "INT", value: 2 } ],
        }
    },
    {
        alias: "tabaxi",
        name: "Tabaxi",
        selected: true,
        isIconic: false,
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 } ]
        }
    }
];

const iconic_races: Array<Race> = [
    {
        alias: "aasimar_scourge",
        name: "Aasimar Scourge",
        selected: true,
        isIconic: true,
        forcedClass: 'ranger',
        forcedClassName: 'Ranger',
        statsMod: {
            increasedStats : [ { name: "WIS", value: 2 } ]
        }
    },
    {
        alias: "bladeforged",
        name: "Bladeforged",
        selected: true,
        isIconic: true,
        forcedClass: 'paladin',
        forcedClassName: 'Paladin',
        statsMod: {
            increasedStats : [ { name: "CON", value: 2 }, ],
            loweredStats : [ { name: "DEX", value: 2 }, { name: "WIS", value: 2 }, ]
        }
    },
    {
        alias: "deep_gnome",
        name: "Deep Gnome",
        selected: true,
        isIconic: true,
        forcedClass: 'wizard',
        forcedClassName: 'Wizard',
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 }, { name: "WIS", value: 2 }, ],
            loweredStats : [ { name: "STR", value: 2 }, { name: "CHA", value: 2 }, ]
        }
    },
    {
        alias: "morninglord",
        name: "Morninglord",
        selected: true,
        isIconic: true,
        forcedClass: 'cleric',
        forcedClassName: 'Cleric',
        statsMod: {
            increasedStats : [ { name: "INT", value: 2 }, ],
            loweredStats : [ { name: "CON", value: 2 }, ]
        }
    },
    {
        alias: "purple_dragon_knight",
        name: "Purple Dragon Knight",
        selected: true,
        isIconic: true,
        forcedClass: 'fighter',
        forcedClassName: 'Fighter',
    },
    {
        alias: "shadar_kai",
        name: "Shadar-kai",
        selected: true,
        isIconic: true,
        forcedClass: 'rogue',
        forcedClassName: 'Rogue',
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, ],
            loweredStats : [ { name: "CHA", value: 2 }, ]
        }
    },
    {
        alias: "tiefling_scoundrel",
        name: "Tiefling Scoundrel",
        selected: true,
        isIconic: true,
        forcedClass: 'bard',
        forcedClassName: 'Bard',
        statsMod: {
            increasedStats : [ { name: "CHA", value: 2 }, ],
        }
    },
    {
        alias: "trailblazer",
        name: "Tabaxi Trailblazer",
        selected: true,
        isIconic: true,
        forcedClass: 'monk',
        forcedClassName: 'Monk',
        statsMod: {
            increasedStats : [ { name: "DEX", value: 2 }, ],
        }
    },
    {
        alias: "razorclaw",
        name: "Razorclaw Shifter",
        selected: true,
        isIconic: true,
        forcedClass: 'barbarian',
        forcedClassName: 'Barbarian',
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
