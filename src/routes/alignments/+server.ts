import { json } from '@sveltejs/kit';

const alignments_list: string[] = ["lawful good", "lawful neutral", "lawful evil", "neutral good", "true neutral", "neutral evil", "chaotic good", "chaotic neutral", "chaotic evil"];

export function GET(): Response {
    const alignments: { name: string, selected: boolean, }[] = alignments_list.map((name: string) => ({ name, selected: true }));

    return json(alignments);
}
