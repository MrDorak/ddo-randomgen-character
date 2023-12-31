<script lang="ts">
    import { onMount } from 'svelte';
    import { Spinner, Checkbox } from 'flowbite-svelte';
    import {
        fetchStore,
        hasAllLawfulAlignmentsSelected,
        hasAllNeutralAlignmentsSelected,
        hasAllChaoticAlignmentsSelected
    } from '../../store'
    import { writable } from "svelte/store";


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
            Object.values(data.alignments).forEach(alignment => alignment.alias.startsWith(type) || alignment.alias.includes(type) ? alignment.selected = e.target.checked : null);
            return data
        })
    }
</script>

<div class="flex flex-col justify-center gap-2">
    <span class="text-orange-500 mr-2">Alignment Selector</span>
    <div class="flex flex-wrap gap-3">
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
                <div class="flex flex-wrap justify-center gap-3 p-2 grow rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
                    {#each Object.values($data.alignments) as data}
                        <div class="flex items-center pl-3">
                            <input id="alignments_{data.alias}" type="checkbox" bind:checked={data.selected} on:change={handleChange}
                                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                            <label for="alignments_{data.alias}" class="w-full ml-2 text-sm font-medium">
                                {data.name}
                            </label>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>