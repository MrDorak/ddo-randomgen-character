import {json} from '@sveltejs/kit';

export const prerender = true

export interface Tree {
    name: string
    alias: string
    core: boolean,
    selected?: boolean,
    upcoming?: boolean,
}

const destiny_trees: Array<Tree> = [
    {
        name: "Draconic Incarnation",
        alias: "draconic_incarnation",
        core: true,
    },
    {
        name: "Fatesinger",
        alias: "fatesinger",
        core: true,
    },
    {
        name: "Magus of the Eclipse",
        alias: "magus_of_the_eclipse",
        core: true,
    },
    {
        name: "Machro-technic",
        alias: "machrotechnic",
        core: false,
        selected: false,
    },
    {
        name: "Divine Crusader",
        alias: "divine_crusader",
        core: true,
    },
    {
        name: "Exalted Angel",
        alias: "exalted_angel",
        core: true,
    },
    {
        name: "Unyielding Sentinel",
        alias: "unyielding_sentinel",
        core: true,
    },
    {
        name: "Grandmaster of Flowers",
        alias: "grandmaster_of_flowers",
        core: true,
    },
    {
        name: "Legendary Dreadnought",
        alias: "legendary_dreadnought",
        core: true,
    },
    {
        name: "Shadow-dancer",
        alias: "shadowdancer",
        core: true,
    },
    {
        name: "Fury of the Wild",
        alias: "fury_of_the_wild",
        core: true,
    },
    {
        name: "Primal Avatar",
        alias: "primal_avatar",
        core: true,
    },
    {
        name: "Shiradi Champion",
        alias: "shiradi_champion",
        core: true,
    },
]

export function GET(): Response {
    return json(destiny_trees);
}
