<script lang="ts">
    import {
        Button,
        ButtonGroup,
        Spinner, Table,
        TableBody, TableBodyCell, TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
    import {
        racesSelected,
        classesSelected,
        alignmentsSelected,
        selectedStartingStats,
        data
    } from '../../store'


    let numberGen = [1, 2, 3];
    let loading = false;
    const max = 3;
    const min = 1;

    let results = [];
    const starting_stats = [
        {name: 'STR', value: 8},
        {name: 'DEX', value: 8},
        {name: 'CON', value: 8},
        {name: 'INT', value: 8},
        {name: 'WIS', value: 8},
        {name: 'CHA', value: 8},
    ];

    const getStatMod = (stat) => {
        return Math.floor((stat / 2) - 5)
    }

    const clearResults = () => {
        results = [];
    }

    const handleClick = () => {
        let classesCopy = $classesSelected;

        const chosenAlignment = $alignmentsSelected[Math.floor(Math.random() * $alignmentsSelected.length)];

        switch (chosenAlignment.alias) {
            case 'lawful_good':
                classesCopy = classesCopy.filter(function( _class ) {
                    return !["bard", "stormsinger", "barbarian", "druid", "blightcaster", "acolyte_of_the_skin"].includes(_class.name);
                })
                break;
            case 'lawful_neutral':
                classesCopy = classesCopy.filter(function( _class ) {
                    return !["bard", "stormsinger", "barbarian", "paladin", "sacred_fist"].includes(_class.name);
                })
                break;
            case 'neutral_good':
                classesCopy = classesCopy.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist", "acolyte_of_the_skin"].includes(_class.name);
                })
                break;
            case 'chaotic_good':
                classesCopy = classesCopy.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist", "druid", "blightcaster", "acolyte_of_the_skin"].includes(_class.name);
                })
                break;
            default:
                classesCopy = classesCopy.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist"].includes(_class.name);
                })
                break;
        }

        if (classesCopy.length === 0) {
            return;
        }

        let raceIdx = Math.floor(Math.random() * $racesSelected.length);
        let chosenRace = $racesSelected[raceIdx];

        if (chosenRace?.forcedClass) {
            while (!classesCopy.some(e => e.name === chosenRace?.forcedClass)) {
                raceIdx = Math.floor(Math.random() * $racesSelected.length);
                chosenRace = $racesSelected[raceIdx]
            }
        }

        // 9-14 => 1pt ; 15-16 => 2pts ; 17-18 => 3pts. racials are applied AFTER.
        let chosenStats = JSON.parse(JSON.stringify(starting_stats));
        let startingStats = $selectedStartingStats;
        if (chosenRace.name === 'drow' && $selectedStartingStats !== '28') {
            startingStats = $selectedStartingStats - 4;
        } else if (chosenRace.isIconic && $selectedStartingStats === '28') {
            startingStats = '32'
        }
        
        console.log(startingStats);

        for (let pts = 1; pts <= startingStats; pts++) {
            let ability;
            let idx = Math.floor(Math.random() * chosenStats.length);
            while ((ability = chosenStats[idx].value) === 18) {
                idx = Math.floor(Math.random() * chosenStats.length);
            }

            if (ability >= 14 && ability < 16) {
                pts += 1; // costs 2 total
            } else if (ability >= 16) {
                pts += 2; // costs 3 total
            }
            chosenStats[idx].value++;
        }

        if (chosenRace.statsMod) {
            Object.entries(chosenRace.statsMod).forEach(([idx, changes]) => {
                changes.forEach(incr => {
                    chosenStats[chosenStats.findIndex(stat => stat.name === incr.name)].value += idx === "increasedStats" ? incr.value : -incr.value
                })
            });
        }

        // use input data unless nothing is selected where we use the default 1-3 range
        const numberClasses = Math.min(numberGen.length > 0 ? numberGen[Math.floor(Math.random()*numberGen.length)] : Math.floor(Math.random() * (max - min + 1) + min), classesCopy.length)
        let chosenClasses = [];
        let totalLvls = 20;
        let levels, name;
        for (let i = 1; i <= numberClasses; i++) {
            if (i === 1 && chosenRace.forcedClass?.length > 0) {
                name = chosenRace.forcedClass;
            } else {
                name = classesCopy[Math.floor(Math.random() * classesCopy.length)].name;
            }

            // paladins/sacred fist cant multiclass with : bard, barbarian, druid, and acolyte of the skin
            // monks cant multiclass with : bard, barbarian
            // archetypes can't be the core class
            switch (name) {
                case 'bard':
                case 'stormsinger':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["paladin", "sacred_fist", "monk", "stormsinger", "bard"].includes(_class.name);
                    })
                    break;
                case 'barbarian':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["paladin", "sacred_fist", "monk"].includes(_class.name);
                    })
                    break;
                case 'druid':
                case 'blight_caster':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["paladin", "sacred_fist", "blight_caster", "druid"].includes(_class.name);
                    })
                    break;
                case 'dark_apostate':
                case 'cleric':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["cleric", "dark_apostate"].includes(_class.name);
                    })
                    break;
                case 'dark_hunter':
                case 'ranger':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["ranger", "dark_hunter"].includes(_class.name);
                    })
                    break;
                case 'acolyte_of_the_skin':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["paladin", "sacred_fist", "warlock"].includes(_class.name);
                    })
                    break;
                case 'warlock':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["acolyte_of_the_skin"].includes(_class.name);
                    })
                    break;
                case 'paladin':
                case 'sacred_fist':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["bard", "barbarian", "druid", "acolyte_of_the_skin", "paladin", "sacred_fist"].includes(_class.name);
                    })
                    break;
                case 'monk':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["bard", "barbarian"].includes(_class.name);
                    })
                    break;

                default: break;
            }

            if (i > 1) {
                // if this is the last level, we dump all the levels remaining
                if (i === numberClasses) {
                    levels = totalLvls;
                } else {
                    levels = Math.floor(Math.random() * (totalLvls - (numberClasses - i + 1)) + 1);
                }
            } else if (numberClasses === 1 || classesCopy.length === 0) {
                levels = 20;
            } else {
                levels = Math.floor(Math.random() * ((totalLvls - numberClasses) - 1 + 1) + 1);
            }
            
            totalLvls -= levels;
            chosenClasses[i - 1] = {
                name,
                levels
            }

            classesCopy = classesCopy.filter(function( _class ) {
                return _class.name !== name
            })
        }

        chosenClasses = chosenClasses.sort((a,b) => b.levels - a.levels)

        results = [{
            race: chosenRace.name,
            alignment: chosenAlignment.name,
            classes: chosenClasses,
            stats: chosenStats
        }, ...results]
    }
</script>

<div class="flex flex-col justify-center gap-5">
    <div class="flex flex-col justify-center gap-2">
        <span class="text-orange-500 mr-2">Number of multiclass</span>
        <div class="flex flex-wrap justify-center gap-3 p-2 grow rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
            <div class="flex items-center pl-3">
                <input id="checkbox_1" type="checkbox" bind:group={numberGen} value="{1}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                <label for="checkbox_1" class="w-full ml-2 text-sm font-medium">1 class</label>
            </div>
            <div class="flex items-center pl-3">
                <input id="checkbox_2" type="checkbox" bind:group={numberGen} value="{2}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                <label for="checkbox_2" class="w-full ml-2 text-sm font-medium">2 classes</label>
            </div>
            <div class="flex items-center pl-3">
                <input id="checkbox_3" type="checkbox" bind:group={numberGen} value="{3}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                <label for="checkbox_3" class="w-full ml-2 text-sm font-medium">3 classes</label>
            </div>
        </div>
    </div>

    <ButtonGroup class="rounded-lg justify-center shadow-none">
        <Button outline color="blue" disabled={ !$data } on:click={ handleClick }>Randomize !</Button>
        <Button outline color="red" disabled={ !$data || !results.length } on:click={ clearResults }>Clear</Button>
    </ButtonGroup>

    <div class="flex mb-5">
        {#if loading}
            <div class="text-center m-3">
                Loading <Spinner></Spinner>
            </div>
        {:else}
            <Table divClass="w-full h-[426px] overflow-auto rounded-lg flex-wrap" hoverable={true}>
                <TableHead>
                    <TableHeadCell>Alignment</TableHeadCell>
                    <TableHeadCell>Race</TableHeadCell>
                    <TableHeadCell>Class 1</TableHeadCell>
                    <TableHeadCell>Class 2</TableHeadCell>
                    <TableHeadCell>Class 3</TableHeadCell>
                    <TableHeadCell>Stats</TableHeadCell>
                </TableHead>
                <TableBody>
                    {#each results as item}
                        <TableBodyRow>
                            <TableBodyCell>{item.alignment}</TableBodyCell>
                            <TableBodyCell>{item.race.replaceAll("_", " ")}</TableBodyCell>
                            {#each Array(3) as _, index(index)}
                                <TableBodyCell>{item.classes[index] ? `${item.classes[index].levels} ${item.classes[index].name.replaceAll("_", " ")}` : '-'}</TableBodyCell>
                            {/each}
                            <TableBodyCell>
                                {@html item.stats.map(stat => `${stat.name}: ${stat.value} <span class="text-red-400">(${getStatMod(stat.value)})</span>`).join(" - ")}
                            </TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        {/if}
    </div>
</div>
