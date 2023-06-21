<script lang="ts">
    import { onMount } from 'svelte';
    import { Spinner, Radio } from 'flowbite-svelte';
    import { fetchStore, selectedStartingStats } from '../../store'
    import { writable } from "svelte/store";

    export let show

    let [ data, loading, error ] = [ null, writable(true), null];

    onMount(async () => {
        [ data, loading, error ] = await fetchStore('stats');
    })

    const handleChange = () => {
        data.set($data)
    }
</script>

<div class:hidden={!show} class="flex flex-col justify-center gap-2">
    <div class="flex gap-3">
        <span class="text-orange-500 mr-2">Starting Stats Selector</span>
    </div>
    <div class="flex">
        {#if $loading}
            <div class="text-center m-3">
                Loading <Spinner></Spinner>
            </div>
        {:else if $error}
        <p class="text-red-500">{$error}</p>
        {:else}
            {#if $data.stats}
                <div class="flex justify-center gap-3 p-2 grow rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
                    {#each Object.values($data.stats) as data}
                        <div class="flex items-center pl-3">
                            <input id="stats_{data.name}" type="radio" bind:group={$selectedStartingStats} value="{data.name}" on:click={handleChange}
                                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                            <label for="stats_{data.name}" class="w-full ml-2 text-sm font-medium">{data.name} pts</label>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>