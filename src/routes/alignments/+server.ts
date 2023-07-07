import {json} from '@sveltejs/kit';

export const prerender = true

export interface Alignment {
    alias: string;
    name: string;
    selected: boolean | string;
}

const alignments_list: Array<Alignment> = [
    {
        alias: "lawful_good",
        name: "Lawful Good",
        selected: true,
    },
    {
        alias: "lawful_neutral",
        name: "Lawful Neutral",
        selected: true,
    },
    {
        alias: "neutral_good",
        name: "Neutral Good",
        selected: true,
    },
    {
        alias: "true_neutral",
        name: "True Neutral",
        selected: true,
    },
    {
        alias: "chaotic_good",
        name: "Chaotic Good",
        selected: true,
    },
    {
        alias: "chaotic_neutral",
        name: "Chaotic Neutral",
        selected: true,
    },
]

export function GET(): Response {
    return json(alignments_list);
}
