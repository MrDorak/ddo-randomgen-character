import {json} from '@sveltejs/kit';

export const prerender = true

export interface Tree {
    name: string
    alias: string
    upcoming?: boolean,
}

const destiny_trees: Array<Tree> = [
    {
        name: "Draconic Incarnation",
        alias: "draconic_incarnation",
    },
    {
        name: "Fatesinger",
        alias: "fatesinger",
    },
    {
        name: "Magus of the Eclipse",
        alias: "magus_of_the_eclipse",
    },
    {
        name: "Machro-technic",
        alias: "machrotechnic",
        upcoming: true,
    },
    {
        name: "Divine Crusader",
        alias: "divine_crusader",
    },
    {
        name: "Exalted Angel",
        alias: "exalted_angel",
    },
    {
        name: "Unyielding Sentinel",
        alias: "unyielding_sentinel",
    },
    {
        name: "Grandmaster of Flowers",
        alias: "grandmaster_of_flowers",
    },
    {
        name: "Legendary Dreadnought",
        alias: "legendary_dreadnought",
    },
    {
        name: "Shadow-dancer",
        alias: "shadowdancer",
    },
    {
        name: "Fury of the Wild",
        alias: "fury_of_the_wild",
    },
    {
        name: "Primal Avatar",
        alias: "primal_avatar",
    },
    {
        name: "Shiradi Champion",
        alias: "shiradi_champion",
    },
]

export function GET(): Response {
    return json(destiny_trees);
}
