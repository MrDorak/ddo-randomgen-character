import {json} from '@sveltejs/kit';

export const prerender = true

export interface Tree {
    name: string
    alias: string
    selected: boolean | string;
}

const universal_trees: Array<Tree> = [
    {
        name: "Falconry",
        alias: "falconry",
        selected: false,
    },
    {
        name: "Harper Agent",
        alias: "harper_agent",
        selected: false,
    },
    {
        name: "Inquisitive",
        alias: "inquisitive",
        selected: false,
    },
    {
        name: "Vistani Knife Fighter",
        alias: "vistani_knife_fighter",
        selected: false,
    },
    {
        name: "Feydark Illusionist",
        alias: "feydark_illusionist",
        selected: false,
    },
    {
        name: "Horizon Walker",
        alias: "horizon_walker",
        selected: false,
    },
]

export function GET(): Response {
    return json(universal_trees);
}
