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
        console.log('test');
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
                <div class="flex justify-center gap-3 p-2 bg-green-300 grow text-slate-900 rounded-lg">
                    {#each Object.values($data.stats) as data}
                        <Radio name="stats" bind:group={$selectedStartingStats} value="{data.name}" id="stats_{data.name}" on:click={handleChange}>
                            <span class="text-slate-900">{data.name} pts</span>
                        </Radio>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</div>