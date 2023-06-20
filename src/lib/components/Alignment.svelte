<script lang="ts">
    import { onMount } from 'svelte';
    import { Spinner, Checkbox } from 'flowbite-svelte';
    import { fetchStore, hasAllLawfulAlignmentsSelected, hasAllNeutralAlignmentsSelected, hasAllChaoticAlignmentsSelected } from '../../store'
    import { writable } from "svelte/store";

    export let show

    let [ data, loading, error ] = [ null, writable(true), null];

    onMount(async () => {
        [ data, loading, error ] = await fetchStore('alignments');
    })

    const handleChange = () => {
        data.set($data)
    }

    const toggleAll = (e) => {
        data.update(data => {
            Object.values(data.alignments).forEach(alignment => alignment.selected = e.target.checked);
            return data
        })
    }

    const toggle = (e, type) => {
        data.update(data => {
            Object.values(data.alignments).forEach(alignment => alignment.name.startsWith(type) || alignment.name.includes(type) ? alignment.selected = e.target.checked : null);
            return data
        })
    }
</script>

<div class:hidden={!show} class="flex flex-col justify-center gap-2">
    <div class="flex gap-3">
        <span class="text-orange-500 mr-2">Alignment Selector</span>
        <Checkbox checked={$hasAllLawfulAlignmentsSelected && $hasAllNeutralAlignmentsSelected && $hasAllChaoticAlignmentsSelected } on:change={e => toggleAll(e)}>
            Select all
        </Checkbox>
        <Checkbox checked={$hasAllLawfulAlignmentsSelected} on:change={e => toggle(e, 'lawful')}>
            Select all lawful alignments
        </Checkbox>
        <Checkbox checked={$hasAllNeutralAlignmentsSelected} on:change={e => toggle(e, 'neutral')}>
            Select all neutral alignments
        </Checkbox>
        <Checkbox checked={$hasAllChaoticAlignmentsSelected} on:change={e => toggle(e, 'chaotic')}>
            Select all chaotic alignments
        </Checkbox>
    </div>
    <div class="flex">
        {#if $loading}
            <div class="text-center m-3">
                Loading <Spinner></Spinner>
            </div>
        {:else if $error}
        <p class="text-red-500">{$error}</p>
        {:else}
            {#if $data.alignments}
                <div class="flex justify-center gap-3 p-2 bg-blue-300 grow text-slate-900 rounded-lg">
                    {#each Object.values($data.alignments) as data}
                        <Checkbox bind:checked={data.selected} id="stats_{data.name}" on:change={handleChange}>
                            <span class="text-slate-900">{data.name}</span>
                        </Checkbox>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>