import { json } from '@sveltejs/kit';

export const prerender = true

const free_classes: string[] = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorcerer", "warlock", "wizard"];
const premium_classes: string[] = ["alchemist", "artificer", "favored_soul"];
const archetype_classes: string[] = ["acolyte_of_the_skin", "blight_caster", "dark_apostate", "dark_hunter", "sacred_fist", "stormsinger"];

export function GET(): Response {
    const classes: {
        free: { name: string, selected: boolean }[],
        premium: { name: string, selected: boolean }[],
        archetype: { name: string, selected: boolean }[]
    } = {
        "free" : free_classes.map((name: string) => ({ name, selected: true })),
        "premium" : premium_classes.map((name: string) => ({ name, selected: true })),
        "archetype" : archetype_classes.map((name: string) => ({ name, selected: true })),
    };

    return json(classes);
}
