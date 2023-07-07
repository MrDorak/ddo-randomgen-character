<script lang="ts">
    import { onMount } from 'svelte';
    import {Spinner, Checkbox, Tooltip} from 'flowbite-svelte';
    import { fetchStore, hasAllFreeRaceSelected, hasAllPremiumRaceSelected, hasAllIconicRaceSelected } from '../../store'
    import { writable } from "svelte/store";

    export let displayNames

    let [ data, loading, error ] = [ null, writable(true), null];

    onMount(async () => {
        [ data, loading, error ] = await fetchStore('races');
    })

    const handleChange = () => {
        data.set($data)
    }

    const toggleAll = (e) => {
        data.update(data => {
            Object.values(data.races).forEach(val => val.forEach(race => race.selected = e.target.checked));
            return data
        })
    }

    const toggle = (e, type) => {
        data.update(data => {
            Object.entries(data.races).forEach(([idx, val]) => idx === type ? val.forEach(race => race.selected = e.target.checked) : null);
            return data
        })
    }
</script>

<div class="flex flex-col justify-center gap-2">
    <span class="text-orange-500 mr-2">Race Selector</span>
    <div class="flex flex-wrap gap-3">
        <Checkbox checked={$hasAllFreeRaceSelected && $hasAllPremiumRaceSelected && $hasAllIconicRaceSelected } on:change={e => toggleAll(e)}>
            Select all
        </Checkbox>
        <Checkbox checked={$hasAllFreeRaceSelected} on:change={e => toggle(e, 'free')}>
            Select all free races
        </Checkbox>
        <Checkbox checked={$hasAllPremiumRaceSelected} on:change={e => toggle(e, 'premium')}>
            Select all premium races
        </Checkbox>
        <Checkbox checked={$hasAllIconicRaceSelected} on:change={e => toggle(e, 'iconic')}>
            Select all iconic races
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
            {#if $data.races.free.length}
                <div class="flex flex-col gap-2 p-2 bg-blue-500 grow rounded-l-lg">
                    <span class="text-center text-slate-900">Free</span>
                    <div class="flex flex-wrap justify-center gap-2">
                        {#each Object.values($data.races.free) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="free_{data.alias}"
                                   on:change={handleChange}
                            />
                            <label for="free_{data.alias}" class="flex flex-col items-center">
                                <img src="images/races/free/{data.alias}_race_icon.png"
                                     alt="{data.name}"
                                     title="{data.name}"
                                />
                                <Tooltip class="flex flex-col">
                                    <span>
                                        Name : <span class="text-blue-500">{data.name}</span>
                                    </span>
                                    {#if data?.statsMod}
                                        <span>
                                            Stats modifiers :
                                            { @html Object.entries(data.statsMod).map(([idx, changes]) => changes.map(incr => `<span class="${idx === "increasedStats" ? 'text-green-500' : 'text-red-500'}">${incr.name} : ${idx === "increasedStats" ? '+' + incr.value : -incr.value}</span>`).join(', ')).join(', ') }
                                        </span>
                                    {/if}
                                </Tooltip>
                                {#if displayNames}
                                    <small>{data.name}</small>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if $data.races.premium.length}
                <div class="flex flex-col gap-2 p-2 bg-red-500 grow">
                    <span class="text-center text-slate-900">Premium</span>
                    <div class="flex flex-wrap justify-center gap-2">
                        {#each Object.values($data.races.premium) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="premium_{data.alias}"
                                   on:change={handleChange}
                            />
                            <label for="premium_{data.alias}" class="flex flex-col items-center">
                                <img src="images/races/premium/{data.alias}_race_icon.png"
                                     alt="{data.name}"
                                     title="{data.name}"
                                />
                                <Tooltip class="flex flex-col">
                                    <span>
                                        Name : <span class="text-red-500">{data.name}</span>
                                    </span>
                                    {#if data?.statsMod}
                                        <span>
                                            Stats modifiers :
                                            { @html Object.entries(data.statsMod).map(([idx, changes]) => changes.map(incr => `<span class="${idx === "increasedStats" ? 'text-green-500' : 'text-red-500'}">${incr.name} : ${idx === "increasedStats" ? '+' + incr.value : -incr.value}</span>`).join(', ')).join(', ') }
                                        </span>
                                    {/if}
                                </Tooltip>
                                {#if displayNames}
                                    <small>{data.name}</small>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if $data.races.iconic.length}
                <div class="flex flex-col gap-2 p-2 bg-yellow-500 grow rounded-r-lg">
                    <span class="text-center text-slate-900">Iconic</span>
                    <div class="flex flex-wrap justify-center gap-2">
                        {#each Object.values($data.races.iconic) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="iconic_{data.alias}"
                                   on:change={handleChange}
                            />
                            <label for="iconic_{data.alias}" class="flex flex-col items-center">
                                <img src="images/races/iconic/{data.alias}_race_icon.png"
                                     alt="{data.name}"
                                     title="{data.name}"
                                />
                                <Tooltip class="flex flex-col">
                                    <span>
                                        Name : <span class="text-yellow-500">{data.name}</span>
                                    </span>
                                    <span>
                                        Forced class : <span class="text-red-500">{data.displayForcedClass}</span>
                                    </span>
                                    {#if data?.statsMod}
                                        <span>
                                            Stats modifiers :
                                            { @html Object.entries(data.statsMod).map(([idx, changes]) => changes.map(incr => `<span class="${idx === "increasedStats" ? 'text-green-500' : 'text-red-500'}">${incr.name} : ${idx === "increasedStats" ? '+' + incr.value : -incr.value}</span>`).join(', ')).join(', ') }
                                        </span>
                                    {/if}
                                </Tooltip>
                                {#if displayNames}
                                    <small>{data.name}</small>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    label img {
        opacity: 50%;
    }

    :checked+label img {
        opacity: 100%;
    }

    input[type=checkbox] {
        display: none;
    }
</style>