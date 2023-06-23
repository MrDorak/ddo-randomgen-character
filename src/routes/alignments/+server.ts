import {json} from '@sveltejs/kit';

export const prerender = true

export interface Alignment {
    name: string;
    displayName: string;
    selected: boolean | string;
}

const alignments_list: Array<Alignment> = [
    {
        name: "lawful_good",
        displayName: "Lawful Good",
        selected: true,
    },
    {
        name: "lawful_neutral",
        displayName: "Lawful Neutral",
        selected: true,
    },
    {
        name: "neutral_good",
        displayName: "Neutral Good",
        selected: true,
    },
    {
        name: "true_neutral",
        displayName: "True Neutral",
        selected: true,
    },
    {
        name: "chaotic_good",
        displayName: "Chaotic Good",
        selected: true,
    },
    {
        name: "chaotic_neutral",
        displayName: "Chaotic Neutral",
        selected: true,
    },
]

export function GET(): Response {
    return json(alignments_list);
}
