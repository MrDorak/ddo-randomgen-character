<script lang="ts">
    import Race from "$lib/components/Race.svelte";
    import Class from "$lib/components/Class.svelte";
    import Alignment from "$lib/components/Alignment.svelte";
    import StartingStats from "$lib/components/StartingStats.svelte";
    import Results from "$lib/components/Results.svelte";

    let raceSelector = true;
    let classSelector = true;
    let alignmentSelector = true;
    let startingStatsSelector = true;
</script>

<div class="md:container md:mx-auto">
    <h1 class="text-5xl font-bold text-center mb-3">
        DDO Class Randomizer
    </h1>

    <div class="flex flex-col gap-5">
        <div>
            <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Options</h3>
            <ul class="items-center w-full text-sm font-medium text-gray-900 bg-gray-100 border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div class="flex items-center pl-3">
                        <input id="race-checkbox-list" type="checkbox" bind:checked={raceSelector} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="race-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show Race</label>
                    </div>
                </li>
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div class="flex items-center pl-3">
                        <input id="class-checkbox-list" type="checkbox" bind:checked={classSelector} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="class-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show Class</label>
                    </div>
                </li>
                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                    <div class="flex items-center pl-3">
                        <input id="alignment-checkbox-list" type="checkbox" bind:checked={alignmentSelector} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="alignment-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show Alignment</label>
                    </div>
                </li>
                <li class="w-full dark:border-gray-600">
                    <div class="flex items-center pl-3">
                        <input id="starting-stats-checkbox-list" type="checkbox" bind:checked={startingStatsSelector} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="starting-stats-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show Starting Stats (defaults to 28 pts)</label>
                    </div>
                </li>
            </ul>
        </div>

        <Race show="{raceSelector}" />

        <Class show="{classSelector}" />

        <Alignment show="{alignmentSelector}" />

        <StartingStats show="{startingStatsSelector}" />

        <Results></Results>
    </div>
</div>