import { json } from '@sveltejs/kit';

const alignments_list: string[] = [
    "lawful good", "lawful neutral", "neutral good", "true neutral", "chaotic good", "chaotic neutral"];

export function GET(): Response {
    const alignments: { name: string, alias: string, selected: boolean, }[]
        = alignments_list.map((name: string) => ({ name, alias: name.replaceAll(" ", "_"), selected: true }));

    return json(alignments);
}
