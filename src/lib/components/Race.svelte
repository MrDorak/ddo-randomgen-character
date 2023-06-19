<script lang="ts">
    export let show

    let selected = import.meta.glob('$lib/assets/races/**/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' });

    const gallery_free = import.meta.glob('$lib/assets/races/free/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' })
    const gallery_premium = import.meta.glob('$lib/assets/races/premium/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' })
    const gallery_iconic = import.meta.glob('$lib/assets/races/iconic/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, as: 'url' })

    async function getRaces() {
        const response = await fetch('/races');
        return await response.json();
    }

    let races = getRaces();

    const handleChange = (e, id, url) => {
        if (e.currentTarget.checked) {
            selected.push({id, url})
        }
    }
</script>

{#await races}
    <p>...waiting</p>
{:then races}
    <div class:hidden={!show} class="flex gap-2">
        {#if races.free.length}
            <div class="flex gap-2 p-2 bg-blue-300">
                {#each Object.entries(races.free) as [id, data]}
                    <input class="hidden" bind:checked={data.selected} type="checkbox" id="free_{data.name}"
                           on:change={event => handleChange(event, id, 'free')}
                    />
                    <label for="free_{data.name}">
                        <img src="images/races/free/{data.name}_race_icon.png" alt="" />
                    </label>
                {/each}
            </div>
        {/if}
        {#if races.premium.length}
            <div class="flex gap-2 p-2 bg-red-500">
                {#each Object.entries(races.premium) as [id, data]}
                    <input class="hidden" bind:checked={data.selected} type="checkbox" id="premium_{data.name}"
                           on:change={event => handleChange(event, id, 'premium')}
                    />
                    <label for="premium_{data.name}">
                        <img src="images/races/premium/{data.name}_race_icon.png" alt=""/>
                    </label>
                {/each}
            </div>
        {/if}
        {#if races.iconic.length}
            <div class="flex gap-2 p-2 bg-yellow-500">
                {#each Object.entries(races.iconic) as [id, data]}
                    <input class="hidden" bind:checked={data.selected} type="checkbox" id="iconic_{data.name}"
                           on:change={event => handleChange(event, id, 'iconic')}
                    />
                    <label for="iconic_{data.name}">
                        <img src="images/races/iconic/{data.name}_race_icon.png" alt="" />
                    </label>
                {/each}
            </div>
        {/if}
    </div>

{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

<div class:hidden={!show} class="flex gap-2">
    <div class="flex gap-2 p-2 bg-blue-300">
        <!--{#each Object.entries(gallery_free) as [id, url], i}
            <input class="hidden" checked type="checkbox" id="free_{i}" />
            <label for="free_{i}">
                <img src="{url}" alt="" />
            </label>
        {/each}-->
    </div>
    <div class="flex gap-2 p-2 bg-red-500">
        <!--{#each Object.entries(gallery_premium) as [id, url], i}
            <input class="hidden" checked type="checkbox" id="premium_{i}" on:change={event => handleChange(event, id, url)}/>
            <label for="premium_{i}">
                <img src="{url}" alt="" />
            </label>
        {/each}-->
    </div>
    <div class="flex gap-2 p-2 bg-yellow-500">
        {#each Object.entries(gallery_iconic) as [id, url], i}
            <input class="hidden" checked type="checkbox" id="iconic_{i}" />
            <label for="iconic_{i}">
                <img src="{url}" alt=""/>
            </label>
        {/each}
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