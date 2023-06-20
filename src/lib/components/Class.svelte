<script lang="ts">
    import { onMount } from 'svelte';
    import {Checkbox, Spinner} from 'flowbite-svelte';
    import {fetchStore, hasAllFreeClassSelected, hasAllPremiumClassSelected, hasAllArchetypeClassSelected} from '../../store'
    import { writable } from "svelte/store";

    export let show

    let [ data, loading, error ] = [ null, writable(true), null];

    onMount(async () => {
        [ data, loading, error ] = await fetchStore('classes');
    })

    const handleChange = () => {
        data.set($data)
    }

    const toggleAll = (e) => {
        data.update(data => {
            Object.values(data.classes).forEach(val => val.forEach(race => race.selected = e.target.checked));
            return data
        })
    }

    const toggle = (e, type) => {
        data.update(data => {
            Object.entries(data.classes).forEach(([idx, val]) => idx === type ? val.forEach(race => race.selected = e.target.checked) : null);
            return data
        })
    }
</script>

<div class:hidden={!show} class="flex flex-col justify-center gap-2">
    <div class="flex gap-3">
        <span class="text-orange-500 mr-2">Class Selector</span>
        <Checkbox checked={$hasAllFreeClassSelected && $hasAllPremiumClassSelected && $hasAllArchetypeClassSelected } on:change={e => toggleAll(e)}>
            Select all
        </Checkbox>
        <Checkbox checked={$hasAllFreeClassSelected} on:change={e => toggle(e, 'free')}>
            Select all free classes
        </Checkbox>
        <Checkbox checked={$hasAllPremiumClassSelected} on:change={e => toggle(e, 'premium')}>
            Select all premium classes
        </Checkbox>
        <Checkbox checked={$hasAllArchetypeClassSelected} on:change={e => toggle(e, 'iconic')}>
            Select all iconic classes
        </Checkbox>
    </div>

    <div class="flex">
        {#if $loading}
            <div class="text-center m-3">
                Loading <Spinner></Spinner>
            </div>
        {:else if $error}
        <p class="text-red-500">{$error}</p>
        {:else }
            {#if $data.classes.free.length}
                <div class="flex flex-col gap-2 p-2 bg-blue-300 grow rounded-l-lg">
                    <span class="text-center text-slate-900">Free</span>
                    <div class="flex justify-center gap-2">
                        {#each Object.values($data.classes.free) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="free_{data.name}"
                                   on:change={handleChange}
                            />
                            <label for="free_{data.name}">
                                <img src="images/classes/free/{data.name}_class_icon.png" alt="" />
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if $data.classes.premium.length}
                <div class="flex flex-col gap-2 p-2 bg-red-500 grow">
                    <span class="text-center text-slate-900">Premium</span>
                    <div class="flex justify-center gap-2">
                        {#each Object.values($data.classes.premium) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="premium_{data.name}"
                                   on:change={handleChange}
                            />
                            <label for="premium_{data.name}">
                                <img src="images/classes/premium/{data.name}_class_icon.png" alt=""/>
                            </label>
                        {/each}
                    </div>
                </div>
            {/if}
            {#if $data.classes.archetype.length}
                <div class="flex flex-col gap-2 p-2 bg-yellow-500 grow rounded-r-lg">
                    <span class="text-center text-slate-900">Archetype</span>
                    <div class="flex justify-center gap-2">
                        {#each Object.values($data.classes.archetype) as data}
                            <input class="hidden" bind:checked={data.selected} type="checkbox" id="archetype_{data.name}"
                                   on:change={handleChange}
                            />
                            <label for="archetype_{data.name}">
                                <img src="images/classes/archetype/{data.name}_class_icon.png" alt="" />
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