import { json } from '@sveltejs/kit';

const stats_list: string[] = ["28", "32", "34", "36"];

export function GET(): Response {
    const stats: { name: string, selected: string, }[] = stats_list.map((name: string) => ({ name, selected: '28' }));

    return json(stats);
}
