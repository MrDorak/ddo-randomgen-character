import {derived, writable} from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type {Race} from "./routes/races/+server";

interface Data extends Race{
    selected: boolean | string;
    name: string;
    alias?: string;
}

interface DataProps {
    [index: string]: Data[][];
}

interface Alignments {
    [index: string]: Array<Data>;
}

export let data: Writable<any> = writable({})

export let selectedStartingStats: Writable<any> = writable('28')

export async function fetchStore(url: string): Promise<(Writable<any> | Writable<boolean> | (() => Promise<void>))[]> {
    const loading: Writable<boolean> = writable(false)
    const error: Writable<boolean | string> = writable(false)

    async function get(): Promise<void> {
        loading.set(true)
        error.set(false)
        try {
            const response = await fetch(url)
            const json = await response.json();
            data.update((data: any) => {
                data[url] = json
                return data;
            })
        } catch(e: any) {
            error.set(`Error fetching ${url} ` + e)
        }
        loading.set(false)
    }

    await get();

    return [ data, loading, error, get]
}

export const racesSelected: Readable<Data[]> = derived(
    data,
    ($data: DataProps): Data[] => {
        if (!$data.races) {
            return []
        }

        let selected = Object.values($data.races).flatMap((values: Data[]) => values.filter((r: Data) => r.selected));
        if (selected.length === 0) {
            return Object.values($data.races).flatMap((values: Data[]) => values)
        }

        return selected
    }
);

export const hasAllFreeRaceSelected: Readable<DataProps> = derived(
    data,
    ($data: any): DataProps | any => {
        return $data.races ? (Object.values($data.races.free).filter((race: any) => race.selected).length === $data.races.free.length) : false
    }
);

export const hasAllPremiumRaceSelected: Readable<DataProps> = derived(
    data,
    ($data: any): DataProps | any => {
        return $data.races ? (Object.values($data.races.premium).filter((race: any) => race.selected).length === $data.races.premium.length) : false
    }
);

export const hasAllIconicRaceSelected: Readable<DataProps> = derived(
    data,
    ($data: any): DataProps | any => {
        return $data.races ? (Object.values($data.races.iconic).filter((race: any) => race.selected).length === $data.races.iconic.length) : false
    }
);

export const classesSelected: Readable<Data[]> = derived(
    data,
    ($data: DataProps): Data[] => {
        if (!$data.classes) {
            return []
        }

        let selected = Object.values($data.classes).flatMap((values: Data[]) => values.filter((r: Data) => r.selected));
        if (selected.length === 0) {
            return Object.values($data.classes).flatMap((values: Data[]) => values)
        }

        return selected
    }
);

export const hasAllFreeClassSelected: Readable<DataProps> = derived(
    data,
    ($data: any): DataProps | any => {
        return $data.classes ? (Object.values($data.classes.free).filter((race: any) => race.selected).length === $data.classes.free.length) : false
    }
);

export const hasAllPremiumClassSelected: Readable<DataProps> = derived(
    data,
    ($data: any): DataProps | any => {
        return $data.classes ? (Object.values($data.classes.premium).filter((race: any) => race.selected).length === $data.classes.premium.length) : false
    }
);

export const hasAllArchetypeClassSelected: Readable<DataProps> = derived(
    data,
    ($data: any): DataProps | any => {
        return $data.classes ? (Object.values($data.classes.archetype).filter((race: any) => race.selected).length === $data.classes.archetype.length) : false
    }
);

export const alignmentsSelected: Readable<Data[]> = derived(
    data,
    ($data: Alignments): Data[] => {
        if (!$data.alignments) {
            return []
        }

        let selected = Object.values($data.alignments).filter((r: Data) => r.selected)
        if (selected.length === 0) {
            return Object.values($data.alignments)
        }

        return selected
    }
);

export const hasAllLawfulAlignmentsSelected: Readable<Alignments> = derived(
    data,
    ($data: any): Alignments | any => {
        if (!$data.alignments) return false;

        return Object.values($data.alignments).filter((alignment: any) => {
            return (alignment.name.startsWith("lawful") || alignment.name.includes("lawful")) && !alignment.selected;
        }).length === 0
    }
);

export const hasAllNeutralAlignmentsSelected: Readable<Alignments> = derived(
    data,
    ($data: any): Alignments | any => {
        if (!$data.alignments) return false;

        return Object.values($data.alignments).filter((alignment: any) => {
            return (alignment.name.startsWith("neutral") || alignment.name.includes("neutral")) && !alignment.selected;
        }).length === 0
    }
);

export const hasAllChaoticAlignmentsSelected: Readable<Alignments> = derived(
    data,
    ($data: any): Alignments | any => {
        if (!$data.alignments) return false;

        return Object.values($data.alignments).filter((alignment: any) => {
            return (alignment.name.startsWith("chaotic") || alignment.name.includes("chaotic")) && !alignment.selected;
        }).length === 0
    }
);