<script lang="ts">
    import { onMount } from 'svelte';
    import {Badge, Spinner, Tooltip} from 'flowbite-svelte';
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
        <span class="text-orange-500 mr-2 flex">
            Starting Stats Selector
            <Badge color="black" rounded large class="!p-1 !font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              <span class="sr-only">Icon description</span>
            </Badge>
            <Tooltip>Iconics are by default 32pts. Drow always have 4 less starting points.</Tooltip>
        </span>
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
                <div class="flex flex-wrap justify-center gap-3 p-2 grow rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
                    {#each Object.values($data.stats) as data}
                        <div class="flex items-center pl-3">
                            <input name="stats" id="stats_{data.name}" type="radio" bind:group={$selectedStartingStats} value="{data.name}" on:change={handleChange}
                                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                            <label for="stats_{data.name}" class="w-full ml-2 text-sm font-medium">{data.name} pts</label>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>