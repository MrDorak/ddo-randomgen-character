<script lang="ts">
    import {
        Button,
        ButtonGroup,
        Table,
        TableBody, TableBodyCell, TableBodyRow,
        TableHead,
        TableHeadCell,
        Toast
    } from 'flowbite-svelte';

    import {
        racesSelected,
        classesSelected,
        alignmentsSelected,
        selectedStartingStats,
        data
    } from '../../store'

    import { slide } from "svelte/transition";

    let results = [];
    let errors = [];

    let numberGen = [1, 2, 3];

    let weight = "no_weight";

    const max = 3;
    const min = 1;
    const base_stats = [
        {name: 'STR', value: 8, weight: 1},
        {name: 'DEX', value: 8, weight: 1},
        {name: 'CON', value: 8, weight: 1},
        {name: 'INT', value: 8, weight: 1},
        {name: 'WIS', value: 8, weight: 1},
        {name: 'CHA', value: 8, weight: 1},
    ];

    const getStatMod = (stat) => {
        return Math.floor((stat / 2) - 5)
    }

    const clearResults = () => {
        results = [];
    }

    const filterAlignment = (alignment, classes) => {
        switch (alignment) {
            case 'lawful_good':
                classes = classes.filter(function( _class ) {
                    return !["bard", "stormsinger", "barbarian", "druid", "blightcaster", "acolyte_of_the_skin"].includes(_class.name);
                })
                break;
            case 'lawful_neutral':
                classes = classes.filter(function( _class ) {
                    return !["bard", "stormsinger", "barbarian", "paladin", "sacred_fist"].includes(_class.name);
                })
                break;
            case 'neutral_good':
                classes = classes.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist", "acolyte_of_the_skin"].includes(_class.name);
                })
                break;
            case 'chaotic_good':
                classes = classes.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist", "druid", "blightcaster", "acolyte_of_the_skin"].includes(_class.name);
                })
                break;
            default:
                classes = classes.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist"].includes(_class.name);
                })
                break;
        }

        return classes;
    }

    const handleClick = () => {
        if (errors.filter(e => e).length === 0) {
            errors = [];
        }

        let racesCopy = JSON.parse(JSON.stringify($racesSelected));
        let alignmentCopy = JSON.parse(JSON.stringify($alignmentsSelected));
        let classesCopy = JSON.parse(JSON.stringify($classesSelected));
        let tmpClasses = JSON.parse(JSON.stringify(classesCopy))

        let alignmentIdx = Math.floor(Math.random() * alignmentCopy.length);
        let chosenAlignment = alignmentCopy[alignmentIdx];

        let raceIdx = Math.floor(Math.random() * racesCopy.length);
        let chosenRace = racesCopy[raceIdx];

        hasforcedclass: if (chosenRace?.forcedClass) {
            tmpClasses = filterAlignment(chosenAlignment.alias, tmpClasses)

            while (!tmpClasses.some(tmp => tmp.name === chosenRace?.forcedClass)) {
                alignmentCopy.splice(alignmentIdx, 1);

                if (alignmentCopy.length === 0){
                    racesCopy.splice(raceIdx, 1);
                    raceIdx = Math.floor(Math.random() * racesCopy.length);
                    chosenRace = racesCopy[raceIdx];

                    if (!chosenRace) {
                        errors = [...errors, {
                            message: "No possible outcome out of this configuration of class, race and alignment, please adjust it.",
                            show: true,
                            timer: 10
                        }]
                        return;
                    }

                    if (!chosenRace?.forcedClass) {
                        break hasforcedclass;
                    }

                    continue;
                }

                tmpClasses = JSON.parse(JSON.stringify(classesCopy));
                alignmentIdx = Math.floor(Math.random() * alignmentCopy.length);
                chosenAlignment = alignmentCopy[alignmentIdx];

                tmpClasses = filterAlignment(chosenAlignment.alias, tmpClasses)
            }

            let classes = classesCopy.map(_class => _class.name)
            let races = racesCopy.map(race => race?.forcedClass)

            if (!classes.some(_class => races.includes(_class))) {
                errors = [...errors, {
                    message: "No possible outcome out of this configuration of class and race, please adjust it.",
                    show: true,
                    timer: 10
                }]
                return;
            }

            while (!classesCopy.some(e => e.name === chosenRace?.forcedClass)) {
                raceIdx = Math.floor(Math.random() * racesCopy.length);
                chosenRace = racesCopy[raceIdx]
            }
        }

        tmpClasses = filterAlignment(chosenAlignment.alias, tmpClasses)

        while (tmpClasses.length === 0) {
            alignmentCopy.splice(alignmentIdx, 1)
            if (alignmentCopy.length === 0){
                return;
            }

            tmpClasses = JSON.parse(JSON.stringify(classesCopy));
            alignmentIdx = Math.floor(Math.random() * alignmentCopy.length);
            chosenAlignment = alignmentCopy[alignmentIdx];

            tmpClasses = filterAlignment(chosenAlignment.alias, tmpClasses)
        }

        // use input data unless nothing is selected where we use the default 1-3 range
        const numberClasses = Math.min(numberGen.length > 0 ? numberGen[Math.floor(Math.random()*numberGen.length)] : Math.floor(Math.random() * (max - min + 1) + min), classesCopy.length)
        let chosenClasses = [];
        let totalLvls = 20;
        let levels, name;
        for (let i = 1; i <= numberClasses; i++) {
            let weightedStats;
            if (i === 1 && chosenRace?.forcedClass?.length > 0) {
                name = chosenRace.forcedClass;
                weightedStats = classesCopy.find(classes => classes.name === name).weightedStats
            } else {
                const classIdx = Math.floor(Math.random() * classesCopy.length);
                name = classesCopy[classIdx].name;
                weightedStats = classesCopy[classIdx].weightedStats
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
                levels,
                weightedStats
            }

            classesCopy = classesCopy.filter(function( _class ) {
                return _class.name !== name
            })
        }

        chosenClasses = chosenClasses.sort((a,b) => b.levels - a.levels)
        
        // 9-14 => 1pt ; 15-16 => 2pts ; 17-18 => 3pts. racials are applied AFTER.
        let chosenStats = JSON.parse(JSON.stringify(base_stats));
        let startingStats = $selectedStartingStats;
        if (chosenRace.name === 'drow' && $selectedStartingStats !== '28') {
            startingStats = $selectedStartingStats - 4;
        } else if (chosenRace.isIconic && $selectedStartingStats === '28') {
            startingStats = '32'
        }

        if (weight !== 'no_weight') {
            chosenClasses.map((_class, idx) => {
                if ((weight === 'weight_main' && idx === 0) || weight === 'weight_all') {
                    _class.weightedStats.forEach(stat => {
                        const statIndex = chosenStats.findIndex(baseStat => baseStat.name === stat.name)
                        chosenStats[statIndex].weight += (stat.value - 1)
                    })
                }
            })
        }

        const cumulativeWeights = [];
        for (let i = 0; i < chosenStats.length; i += 1) {
            cumulativeWeights[i] = chosenStats[i].weight + (cumulativeWeights[i - 1] || 0);
        }
        const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];

        // allocate stat points
        for (let pts = 1; pts <= startingStats; pts++) {
            const randomNumber = maxCumulativeWeight * Math.random();

            let ability;

            // apply weight
            for (let itemIndex = 0; itemIndex < chosenStats.length; itemIndex++) {
                if (chosenStats[itemIndex].value === 18) {
                    continue;
                }

                if (cumulativeWeights[itemIndex] >= randomNumber) {
                    ability = chosenStats[itemIndex].value
                    if (ability === 14 || ability === 15) {
                        if ((startingStats - pts) < 2) {
                            if (itemIndex === chosenStats.length - 1) {
                                pts--;
                            }
                            continue;
                        }
                        pts += 1; // costs 2 total
                    } else if (ability >= 16) {
                        if (startingStats - pts < 3) {
                            if (itemIndex === chosenStats.length - 1) {
                                pts--;
                            }
                            continue;
                        }
                        pts += 2; // costs 3 total
                    }

                    chosenStats[itemIndex].value++;
                    break;
                }
            }
        }

        if (chosenRace.statsMod) {
            Object.entries(chosenRace.statsMod).forEach(([idx, changes]) => {
                changes.forEach(incr => {
                    chosenStats[chosenStats.findIndex(stat => stat.name === incr.name)].value += idx === "increasedStats" ? incr.value : -incr.value
                })
            });
        }
        
        results = [{
            race: chosenRace.name,
            alignment: chosenAlignment.name,
            classes: chosenClasses,
            stats: chosenStats
        }, ...results]
    }

    function timeout(idx) {
        if (!errors[idx].timer) {
            errors[idx].timer = 5;
        }
        if (--errors[idx].timer > 0)
            return setTimeout(timeout, 1000, idx);

        errors[idx] = null;
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

    <div class="flex flex-col justify-center gap-2">
        <span class="text-orange-500 mr-2">Apply stat weight based off classes</span>
        <div class="flex flex-wrap justify-center gap-3 p-2 grow rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
            <div class="flex items-center pl-3 gap-3 ">
                <div>
                    <input id="no_weight" type="radio" bind:group={weight} value="no_weight" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                    <label for="no_weight" class="w-full ml-2 text-sm font-medium">Don't apply weight, let chaos reign</label>
                </div>
                <div>
                    <input id="weight_all" type="radio" bind:group={weight} value="weight_all" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                    <label for="weight_all" class="w-full ml-2 text-sm font-medium">Apply stat weight based off classes</label>
                </div>
                <div>
                    <input id="weight_main" type="radio" bind:group={weight} value="weight_main" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                    <label for="weight_main" class="w-full ml-2 text-sm font-medium">Apply stat weight based off main class</label>
                </div>
            </div>
        </div>
    </div>
    
    <ButtonGroup class="rounded-lg justify-center shadow-none">
        <Button outline color="blue" disabled={ !$data } on:click={ handleClick }>Randomize !</Button>
        <Button outline color="red" disabled={ !$data || !results.length } on:click={ clearResults }>Clear</Button>
    </ButtonGroup>

    <div class="flex mb-5">
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
    </div>
</div>

<div class="fixed top-12 right-5 flex flex-col gap-3">
    {#each errors.filter(e => e) as error, i}
        <Toast on:load={timeout(i)} divClass="w-full max-w-xs p-4 text-gray-500 bg-red-400 dark:bg-red-500 shadow text-slate-900 dark:text-white gap-3 border border-red-500"
               transition={slide}
               bind:open={error.show}
        >
            { error.message }
        </Toast>
    {/each}
</div>