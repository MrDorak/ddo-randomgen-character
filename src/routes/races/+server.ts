import { json } from '@sveltejs/kit';

const free_races: string[] = ["dragonborn", "drow", "dwarf", "elf", "gnome", "half_elf", "halfling", "half_orc", "human", "tiefling", "warforged", "wood_elf"];
const premium_races: string[] = ["aasimar", "shifter", "tabaxi"];
const iconic_races: string[] = ["aasimar_scourge", "bladeforged", "deep_gnome", "morninglord", "purple_dragon_knight", "shadar_kai", "tiefling_scoundrel", "trailblazer", "razorclaw"];

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
