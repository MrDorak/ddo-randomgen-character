import {derived, writable} from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

interface Data {
    selected: boolean;
    name: string;
}

interface DataProps {
    [index: string]: Array<Array<Data>>;
}

export let data: Writable<DataProps> = writable({})

export async function fetchStore(url: string): Promise<(Writable<DataProps> | Writable<boolean> | (() => Promise<void>))[]> {
    const loading: Writable<boolean> = writable(false)
    const error: Writable<boolean> = writable(false)

    async function get(): Promise<void> {
        loading.set(true)
        error.set(false)
        try {
            const response = await fetch(url)
            const json = await response.json();
            data.update((data: DataProps) => {
                data[url] = json
                return data;
            })
        } catch(e: any) {
            error.set(e)
        }
        loading.set(false)
    }

    await get();

    return [ data, loading, error, get]
}

export const racesSelected: Readable<string> = derived(
    data,
    ($data: DataProps): string => {
        return $data.races ? JSON.stringify(Object.values($data.races).map((values: Data[]) => values.filter((r: { selected: boolean }) => r.selected))) : ''
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

export const classesSelected: Readable<string> = derived(
    data,
    ($data: DataProps): string => {
        return $data.classes ? JSON.stringify(Object.values($data.classes).map((values: Data[]) => values.filter((r: { selected: boolean }) => r.selected))) : ''
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