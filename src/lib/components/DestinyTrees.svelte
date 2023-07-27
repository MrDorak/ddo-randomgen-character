<script lang="ts">
    import { onMount } from 'svelte';
    import { Spinner, Checkbox } from 'flowbite-svelte';
    import {
        fetchStore, hasAllDestinyTreesSelected,
    } from '../../store'
    import { writable } from "svelte/store";

    let [ data, loading, error ] = [ null, writable(true), null];

    onMount(async () => {
        [ data, loading, error ] = await fetchStore('destiny_trees');
    })

    const handleChange = () => {
        data.set($data)
    }

    const toggleAll = (e) => {
        data.update(data => {
            Object.values(data.destiny_trees).forEach(tree => tree.selected = e.target.checked);
            return data
        })
    }
</script>

<div class="flex flex-col gap-2">
    <span class="text-orange-500">Destiny Trees Bought</span>
    <div class="flex flex-wrap gap-3">
        <Checkbox checked={ $hasAllDestinyTreesSelected } on:change={e => toggleAll(e)}>
            Select all
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
            {#if $data.destiny_trees}
                <div class="flex flex-wrap justify-center gap-3 p-2 grow rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
                    {#each Object.values($data.destiny_trees).filter(d => !d.core && !d.upcoming) as data}
                        <div class="flex items-center pl-3">
                            <input id="destiny_trees_{data.alias}" type="checkbox" bind:checked={data.selected} on:change={handleChange}
                                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                            <label for="destiny_trees_{data.alias}" class="w-full ml-2 text-sm font-medium">
                                {data.name}
                            </label>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>