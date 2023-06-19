import { json } from '@sveltejs/kit';

const free_races: string[] = [];
const premium_races: string[] = ["aasimar", "gnome"];
const iconic_races: string[] = ["bladeforged"];

export function GET(): Response {
    const races: {
        free: { name: string, selected: boolean }[],
        premium: { name: string, selected: boolean }[],
        iconic: { name: string, selected: boolean }[]
    } = {
        "free" : free_races.map((name: string) => ({ name, selected: true })),
        "premium" : premium_races.map((name: string) => ({ name, selected: true })),
        "iconic" : iconic_races.map((name: string) => ({ name, selected: true })),
    };

    return json(races);
}
