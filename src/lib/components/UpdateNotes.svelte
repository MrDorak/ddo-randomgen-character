<script lang="ts">
    import {Button, Modal} from "flowbite-svelte";

let open = false;
</script>

<div class="flex justify-center">
    <div class="flex">
        <Button on:click={() => open = true}>Update Notes</Button>
    </div>
</div>

<Modal title="Update Notes" bind:open={open} autoclose outsideclose>
    <div class="flex flex-col gap-5">

        <!--<div class="flex flex-col gap-2">
            <h2 class="text-2xl underline font-bold">2023-07-07</h2>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Features</h3>
                <ul>
                    <li></li>
                </ul>
            </div>
        </div>-->

        <div class="flex flex-col gap-2">
            <h2 class="text-2xl underline font-bold">2023-07-07</h2>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Features</h3>
                <ul>
                    <li>- <span class="font-bold text-red-500">NEW !</span> Add an optional enhancement trees randomizer, there is now even more random to your random character !</li>
                </ul>
            </div>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Adjustments</h3>
                <ul>
                    <li>- The "display names" option state is now saved for future visits</li>
                    <li>- Tooltips should be more readable</li>
                </ul>
            </div>

            <div class="flex flex-col gap-1">
                <h3 class="text-xl font-bold">Fixes</h3>
                <ul>
                    <li>- Fix a crash when selecting only a class and its archetype</li>
                </ul>
            </div>
        </div>
    </div>
    <svelte:fragment slot='footer'>
        <Button>Close</Button>
    </svelte:fragment>
</Modal>