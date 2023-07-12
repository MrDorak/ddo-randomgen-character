<script lang="ts">
    import {
        Button,
        ButtonGroup,
        Table,
        TableBody, TableBodyCell, TableBodyRow,
        TableHead,
        TableHeadCell,
        Toast,
        Modal, Badge, Tooltip
    } from 'flowbite-svelte';

    import {
        racesSelected,
        classesSelected,
        alignmentsSelected,
        selectedStartingStats,
        universalTreesSelected,
        data
    } from '../../store'

    import { slide } from "svelte/transition";
    import type { Alignment} from "../../routes/alignments/+server";
    import type { Race } from "../../routes/races/+server";
    import type { Class } from "../../routes/classes/+server";

    let results = [];
    let errors = [];

    let numberGen = [1, 2, 3];

    let weight = "no_weight";
    let capstone_tree = "no_capstone";
    let randomizeEnhancementTrees = true;
    let enhancementPoints = 80;

    const maxClasses = 3;
    const minClasses = 1;
    const base_stats = [
        {name: 'STR', value: 8, weight: 1},
        {name: 'DEX', value: 8, weight: 1},
        {name: 'CON', value: 8, weight: 1},
        {name: 'INT', value: 8, weight: 1},
        {name: 'WIS', value: 8, weight: 1},
        {name: 'CHA', value: 8, weight: 1},
    ];

    const groupBy = (xs, key) => {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const getStatMod = (stat) => {
        return Math.floor((stat / 2) - 5)
    }

    const clearResults = () => {
        results = [];
    }

    const filterAlignment = (alignment : string, classes: Array<Class>) => {
        switch (alignment) {
            case 'lawful_good':
                classes = classes.filter(function( _class : Class ) {
                    return !["bard", "stormsinger", "barbarian", "druid", "blightcaster", "acolyte_of_the_skin"].includes(_class.alias);
                })
                break;
            case 'lawful_neutral':
                classes = classes.filter(function( _class ) {
                    return !["bard", "stormsinger", "barbarian", "paladin", "sacred_fist"].includes(_class.alias);
                })
                break;
            case 'neutral_good':
                classes = classes.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist", "acolyte_of_the_skin"].includes(_class.alias);
                })
                break;
            case 'chaotic_good':
                classes = classes.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist", "druid", "blightcaster", "acolyte_of_the_skin"].includes(_class.alias);
                })
                break;
            default:
                classes = classes.filter(function( _class ) {
                    return !["monk", "paladin", "sacred_fist"].includes(_class.alias);
                })
                break;
        }

        return classes;
    }

    const handleClick = () => {
        if (errors.filter(e => e).length === 0) {
            errors = [];
        }

        let racesCopy : Array<Race> = JSON.parse(JSON.stringify($racesSelected));
        let alignmentCopy : Array<Alignment> = JSON.parse(JSON.stringify($alignmentsSelected));
        let classesCopy : Array<Class> = JSON.parse(JSON.stringify($classesSelected));

        let alignmentIdx = Math.floor(Math.random() * alignmentCopy.length);
        let chosenAlignment : Alignment = alignmentCopy[alignmentIdx];

        let raceIdx = Math.floor(Math.random() * racesCopy.length);
        let chosenRace : Race = racesCopy[raceIdx];

        classesCopy = filterAlignment(chosenAlignment.alias, classesCopy)

        while (classesCopy.length === 0 || !classesCopy.some(tmp => tmp.alias === chosenRace?.forcedClass)) {
            alignmentCopy.splice(alignmentIdx, 1);

            if (alignmentCopy.length === 0) {
                racesCopy.splice(raceIdx, 1);
                raceIdx = Math.floor(Math.random() * racesCopy.length);
                chosenRace = racesCopy[raceIdx];

                if (!chosenRace) {
                    errors = [...errors, {
                        message: "No possible outcome for this configuration of class, iconic race and alignment, please adjust it.",
                        show: true,
                        timer: 5
                    }]
                    return;
                }

                if (!chosenRace?.forcedClass) {
                    break;
                }

                classesCopy = JSON.parse(JSON.stringify($classesSelected));
                alignmentCopy = JSON.parse(JSON.stringify($alignmentsSelected));
                alignmentIdx = Math.floor(Math.random() * alignmentCopy.length);
                chosenAlignment = alignmentCopy[alignmentIdx];

                classesCopy = filterAlignment(chosenAlignment.alias, $classesSelected)

                continue;
            }

            classesCopy = JSON.parse(JSON.stringify($classesSelected));
            alignmentIdx = Math.floor(Math.random() * alignmentCopy.length);
            chosenAlignment = alignmentCopy[alignmentIdx];

            classesCopy = filterAlignment(chosenAlignment.alias, classesCopy)
        }

        // use input data unless nothing is selected where we use the default 1-3 range
        let numberClasses = Math.min(numberGen.length > 0 ? numberGen[Math.floor(Math.random()*numberGen.length)] : Math.floor(Math.random() * (maxClasses - minClasses + 1) + minClasses), classesCopy.length)

        // if we have to have a class capstone, we need 20 lvls in a unique class
        if (capstone_tree === "class_capstone") {
            numberClasses = 1;
        }
        let chosenClasses = [];
        let totalLvls = 20;
        let levels, alias, name, enhancementTrees, weightedStats;

        for (let i = 1; i <= numberClasses; i++) {
            if (classesCopy.length === 0) break;

            if (i === 1 && chosenRace?.forcedClass?.length > 0) {
                alias = chosenRace.forcedClass;
                const forcedClass = classesCopy.find(_class => _class.alias === alias);

                name = chosenRace.forcedClassName;
                weightedStats = forcedClass.weightedStats
                enhancementTrees = forcedClass.enhancementTrees;
            } else {
                const classIdx = Math.floor(Math.random() * classesCopy.length);
                alias = classesCopy[classIdx].alias;

                name = classesCopy[classIdx].name;
                weightedStats = classesCopy[classIdx].weightedStats
                enhancementTrees = classesCopy[classIdx].enhancementTrees;
            }

            // paladins/sacred fist cant multiclass with : bard, barbarian, druid, and acolyte of the skin
            // monks cant multiclass with : bard, barbarian
            // archetypes can't be the core class
            switch (alias) {
                case 'bard':
                case 'stormsinger':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["paladin", "sacred_fist", "monk", "stormsinger", "bard"].includes(_class.alias);
                    })
                    break;
                case 'barbarian':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["paladin", "sacred_fist", "monk"].includes(_class.alias);
                    })
                    break;
                case 'druid':
                case 'blight_caster':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["paladin", "sacred_fist", "blight_caster", "druid"].includes(_class.alias);
                    })
                    break;
                case 'dark_apostate':
                case 'cleric':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["cleric", "dark_apostate"].includes(_class.alias);
                    })
                    break;
                case 'dark_hunter':
                case 'ranger':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["ranger", "dark_hunter"].includes(_class.alias);
                    })
                    break;
                case 'acolyte_of_the_skin':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["paladin", "sacred_fist", "warlock"].includes(_class.alias);
                    })
                    break;
                case 'warlock':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["acolyte_of_the_skin"].includes(_class.alias);
                    })
                    break;
                case 'paladin':
                case 'sacred_fist':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["bard", "barbarian", "druid", "acolyte_of_the_skin", "paladin", "sacred_fist"].includes(_class.alias);
                    })
                    break;
                case 'monk':
                    classesCopy = classesCopy.filter(function( _class ) {
                        return !["bard", "barbarian"].includes(_class.alias);
                    })
                    break;

                default: break;
            }

            if (i > 1) {
                // if this is the last level, we dump all the remaining levels
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
                alias,
                name,
                levels,
                weightedStats,
                enhancementTrees
            }

            classesCopy = classesCopy.filter( _class => _class.alias !== alias)
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

        // if weight, add it to the base weight
        if (weight !== 'no_weight') {
            chosenClasses.forEach((_class, idx) => {
                if ((weight === 'weight_main' && idx === 0) || weight === 'weight_all') {
                    _class.weightedStats.forEach(stat => {
                        const statIndex = chosenStats.findIndex(baseStat => baseStat.name === stat.name)
                        chosenStats[statIndex].weight += (stat.value - 1)
                    })
                }
            })
        }

        let cumulativeWeights = [];
        for (let i = 0; i < chosenStats.length; i += 1) {
            cumulativeWeights[i] = chosenStats[i].weight + (cumulativeWeights[i - 1] || 0);
        }
        let maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];

        // allocate stat points
        for (let pts = 1; pts <= startingStats; pts++) {
            let randomNumber = maxCumulativeWeight * Math.random();

            let ability;

            // apply weight
            for (let itemIndex = 0; itemIndex < chosenStats.length; itemIndex++) {
                if (chosenStats[itemIndex].value === 18) {
                    chosenStats[itemIndex].weight = 0;

                    //recalculate weights
                    for (let i = 0; i < chosenStats.length; i += 1) {
                        cumulativeWeights[i] = chosenStats[i].weight + (cumulativeWeights[i - 1] || 0);
                    }
                    maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
                    randomNumber = maxCumulativeWeight * Math.random();

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

        let chosenEnhancementTrees = [];

        if (randomizeEnhancementTrees) {
            const universalTreeCopy = $universalTreesSelected
                .map(value => ({value, sort: Math.random()}))
                .sort((a, b) => a.sort - b.sort)
                .map(({value}) => value)
                .slice(0, Math.floor(Math.random() * (3 - 1 + 1) + 1));

            let capstone_class_tree_idx = null, capstone_universal_tree_idx = null;
            if (capstone_tree === "class_capstone") {
                capstone_class_tree_idx = Math.floor(Math.random() * 3)
            } else if (capstone_tree === "universal_capstone") {
                capstone_universal_tree_idx = Math.floor(Math.random() * (universalTreeCopy.length - 1 + 1))
            }

            chosenEnhancementTrees =
                chosenClasses
                    .flatMap((_class, idx) => {
                        _class.enhancementTrees
                            .map(value => ({ value, sort: Math.random() }))
                            .sort((a, b) => a.sort - b.sort)
                            .map(({ value }) => value)

                        // because sorcerer have tree restrictions, I have to randomly remove one for each set of opposites before the weight calc
                        if (_class.alias === 'sorcerer') {
                            for (let itemIndex = 0; itemIndex < _class.enhancementTrees.length; itemIndex++) {
                                switch (_class.enhancementTrees[itemIndex].alias) {
                                    case "fire_savant":
                                        _class.enhancementTrees = _class.enhancementTrees.filter(function (tree) {
                                            return !["water_savant"].includes(tree.alias);
                                        })
                                        break;
                                    case "water_savant":
                                        _class.enhancementTrees = _class.enhancementTrees.filter(function (tree) {
                                            return !["fire_savant"].includes(tree.alias);
                                        })
                                        break;
                                    case "earth_savant":
                                        _class.enhancementTrees = _class.enhancementTrees.filter(function (tree) {
                                            return !["air_savant"].includes(tree.alias);
                                        })
                                        break;
                                    case "air_savant":
                                        _class.enhancementTrees = _class.enhancementTrees.filter(function (tree) {
                                            return !["earth_savant"].includes(tree.alias);
                                        })
                                        break;

                                    default:
                                        break;
                                }
                            }
                        }

                        return _class.enhancementTrees.map((t, treeIndex) => {
                            return {
                                ...t,
                                className: _class.name,
                                levels: _class.levels,
                                weight: (capstone_class_tree_idx === treeIndex) ? 666 : (chosenClasses.length - idx + ((treeIndex + 1) * Math.floor(_class.levels / 0.90)))
                            }
                        })
                    })
                    // remove duplicates
                    .filter((tree, idx, self) => idx === self.findIndex(t => t.alias === tree.alias));

            chosenEnhancementTrees.unshift({ name: chosenRace.name, alias: "racial", className: "Racial", levels: 20, value: 0, weight: Math.floor(Math.random() * 20) })

            chosenEnhancementTrees.unshift(
                ...[
                    ...universalTreeCopy
                        .map((ut, idx) => ({
                            ...ut,
                            className: "Universal",
                            levels: 20,
                            value: 0,
                            weight: capstone_universal_tree_idx === idx ? 666 : Math.floor(Math.random() * 20) + 1 + idx
                        })),
                ]
            )

            let copyEnhancementTrees = JSON.parse(JSON.stringify(chosenEnhancementTrees));
            let maxEnhancementTreeValue = 41 + Math.floor(Math.random() * 4 + 1) // 42 to 45 in a single tree

            do {
                copyEnhancementTrees = JSON.parse(JSON.stringify(chosenEnhancementTrees));
                // calculate total tree weight
                let cumulativeTreeWeights = [];
                for (let i = 0; i < copyEnhancementTrees.length; i += 1) {
                    cumulativeTreeWeights[i] = copyEnhancementTrees[i].weight + (cumulativeTreeWeights[i - 1] || 0);
                }
                let maxCumulativeTreeWeight = cumulativeTreeWeights[cumulativeTreeWeights.length - 1];

                let attributed, picked_trees = [], randomNumber;
                for (let pts = 1; pts <= enhancementPoints; pts++) {
                    attributed = false;
                    randomNumber = maxCumulativeTreeWeight * Math.random();

                    // apply weight
                    for (let itemIndex = 0; itemIndex < copyEnhancementTrees.length; itemIndex++) {
                        if (picked_trees.length === 6 && copyEnhancementTrees[itemIndex].alias !== "racial" && !picked_trees.includes(copyEnhancementTrees[itemIndex].alias)) {
                            continue;
                        }

                        if (
                            (copyEnhancementTrees[itemIndex].value >= maxEnhancementTreeValue)
                            || (copyEnhancementTrees[itemIndex].value >= 10 && copyEnhancementTrees[itemIndex].levels <= 2)
                            || (copyEnhancementTrees[itemIndex].value >= 20 && copyEnhancementTrees[itemIndex].levels <= 4)
                        ) {
                            //recalculate weights
                            copyEnhancementTrees[itemIndex].weight = 0;
                            cumulativeTreeWeights = [];
                            for (let i = 0; i < copyEnhancementTrees.length; i += 1) {
                                cumulativeTreeWeights[i] = copyEnhancementTrees[i].weight + (cumulativeTreeWeights[i - 1] || 0);
                            }
                            maxCumulativeTreeWeight = cumulativeTreeWeights[cumulativeTreeWeights.length - 1];
                            randomNumber = maxCumulativeTreeWeight * Math.random();

                            continue;
                        }

                        if (cumulativeTreeWeights[itemIndex] >= randomNumber) {
                            copyEnhancementTrees[itemIndex].value++;
                            attributed = true;

                            if(copyEnhancementTrees[itemIndex].alias !== "racial" && !picked_trees.includes(copyEnhancementTrees[itemIndex].alias)) {
                                picked_trees.push(copyEnhancementTrees[itemIndex].alias);
                            }
                            break;
                        }
                    }

                    if (attributed === false) {
                        pts--;
                    }
                }
            } while(capstone_tree !== "no_capstone" && !copyEnhancementTrees.some(ce => ce.value === maxEnhancementTreeValue))

            chosenEnhancementTrees = copyEnhancementTrees.filter(ct => ct.value !== 0 || ct.alias === "racial").sort((a,b) => b.value - a.value)
        }

        results = [{
            race: chosenRace.name,
            alignment: chosenAlignment.name,
            classes: chosenClasses,
            stats: chosenStats,
            enhancement_trees: {
                trees: groupBy(chosenEnhancementTrees, 'className'),
                open: false
            }
        }, ...results]
    }

    const timeout = idx => {
        try {
            if (!errors[idx]?.timer) {
                errors[idx].timer = 5;
            }

            if (--errors[idx].timer > 0) {
                return setTimeout(timeout, 1000, idx);
            }

            errors[idx].show = false

            if (!errors.some(e => e.timer !== 0)) {
                errors = [];
            }
        } catch (e) {
            // fallback
            setTimeout(() => errors = [], 1000)
        }
    }

    const createBlobText = item => {
        const classes = Object.entries(item.classes).map(([, _class]) => `${_class.levels} ${_class.name}`).join(" / ");
        const stats = item.stats.map(stat => `${stat.name} : ${stat.value} (${getStatMod(stat.value)})`).join(" - ");
        const trees = Object.entries(item.enhancement_trees.trees).map(([key, trees]) => `${key}: \n ${trees.map(stat => `\t${stat.name} : ${stat.value} point${stat.value > 1 ? 's' : ''}`).join("\n")}`).join("\n");

        return `${item.alignment} ${item.race}\n\n${classes}\n\n${stats}${trees.length > 0 ? `\n\n${trees}` : ''}`;
    }

    const download = item => {
        var blob = new Blob([ createBlobText(item) ], { type: "txt" });

        var a = document.createElement('a');
        a.download = `${item.alignment} ${item.race}`;
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = ["txt", a.download, a.href].join(':');
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
        return false;
    }
</script>

<div class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
        <span class="text-orange-500">Randomizer options</span>

        <div class="flex flex-col gap-3 p-3 rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
            <div class="flex flex-wrap items-center gap-2">
                <span class="mr-2">Enhancement Trees :</span>
                <div class="flex flex-wrap flex-col grow gap-2">
                    <div class="flex flex-wrap justify-center">
                        <div class="items-center">
                            <input id="class-trees-checkbox-list" type="checkbox" bind:checked={randomizeEnhancementTrees} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                            <label for="class-trees-checkbox-list" class="w-full ml-2 text-sm font-medium">Randomize enhancement trees</label>
                        </div>
                    </div>
                    {#if randomizeEnhancementTrees}
                        <div class="flex flex-wrap">
                            <div class="flex flex-wrap items-center justify-center gap-3 grow">
                                <div>
                                    <input id="no_capstone" type="radio" bind:group={capstone_tree} value="no_capstone" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                    <label for="no_capstone" class="w-full ml-2 text-sm font-medium">No forced capstone</label>
                                </div>
                                <div class="flex items-center">
                                    <input id="class_capstone" type="radio" bind:group={capstone_tree} value="class_capstone" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                    <label for="class_capstone" class="w-full ml-2 text-sm font-medium">Class capstone</label>
                                    <Badge color="black" rounded large class="!p-1 !font-semibold">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                                        </svg>
                                        <span class="sr-only">Information Icon</span>
                                    </Badge>
                                    <Tooltip>Choosing this option will prevent multiclassing.</Tooltip>
                                </div>
                                <div class="flex items-center">
                                    <input id="universal_capstone" type="radio" bind:group={capstone_tree} value="universal_capstone" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                    <label for="universal_capstone" class="w-full ml-2 text-sm font-medium">Universal capstone</label>
                                    <Badge color="black" rounded large class="!p-1 !font-semibold">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                                        </svg>
                                        <span class="sr-only">Information Icon</span>
                                    </Badge>
                                    <Tooltip>If there is no universal tree selected, this will be ignored.</Tooltip>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            <hr>

            <div class="flex flex-wrap items-center gap-2">
                <span class="mr-2">Number of multiclass :</span>
                <div class="flex flex-wrap items-center justify-center gap-3 grow">
                    <div class="flex items-center">
                        <input id="checkbox_1" type="checkbox" bind:group={numberGen} value="{1}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="checkbox_1" class="w-full ml-2 text-sm font-medium">1 class</label>
                    </div>
                    <div class="flex items-center">
                        <input id="checkbox_2" type="checkbox" bind:group={numberGen} value="{2}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="checkbox_2" class="w-full ml-2 text-sm font-medium">2 classes</label>
                    </div>
                    <div class="flex items-center">
                        <input id="checkbox_3" type="checkbox" bind:group={numberGen} value="{3}" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="checkbox_3" class="w-full ml-2 text-sm font-medium">3 classes</label>
                    </div>
                </div>
            </div>

            <hr>

            <div class="flex flex-wrap items-center gap-2">
                <span class="mr-2">Ability score weight :</span>
                <div class="flex flex-wrap items-center justify-center gap-3 grow">
                    <div>
                        <input id="no_weight" type="radio" bind:group={weight} value="no_weight" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="no_weight" class="w-full ml-2 text-sm font-medium">Don't apply weight, let it be truly random</label>
                    </div>
                    <div>
                        <input id="weight_main" type="radio" bind:group={weight} value="weight_main" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="weight_main" class="w-full ml-2 text-sm font-medium">Apply stat weight based off main class</label>
                    </div>
                    <div>
                        <input id="weight_all" type="radio" bind:group={weight} value="weight_all" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                        <label for="weight_all" class="w-full ml-2 text-sm font-medium">Apply stat weight based off classes</label>
                    </div>
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
                <TableHeadCell>Enhancement Trees</TableHeadCell>
                <TableHeadCell>Download / Copy</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each results as item}
                    <TableBodyRow>
                        <TableBodyCell>{item.alignment}</TableBodyCell>
                        <TableBodyCell>{item.race}</TableBodyCell>
                        {#each Array(3) as _, index}
                            <TableBodyCell>{item.classes[index] ? `${item.classes[index].levels} ${item.classes[index].name}` : '-'}</TableBodyCell>
                        {/each}
                        <TableBodyCell>
                            {@html item.stats.map(stat => `${stat.name} : ${stat.value} <span class="text-red-400">(${getStatMod(stat.value)})</span>`).join(" - ")}
                        </TableBodyCell>
                        <TableBodyCell class="text-center">
                            {#if Object.keys(item.enhancement_trees.trees).length }
                                <Button on:click={() => item.enhancement_trees.open = true}>Show Trees</Button>
                            {:else}
                                -
                            {/if}
                        </TableBodyCell>
                        <TableBodyCell>
                            <div class="flex justify-center items-center gap-2">
                                <svg on:click={ download(item) } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                /
                                <svg on:click={navigator.clipboard.writeText(createBlobText(item))} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                        </TableBodyCell>
                    </TableBodyRow>

                    <Modal title="Enhancement trees" bind:open={item.enhancement_trees.open} size="xs" autoclose outsideclose>
                        <div class="flex flex-col gap-2">
                            {@html Object.entries(item.enhancement_trees.trees).map(([key, trees]) => {
                                return `<span class="flex flex-col"><span class="underline">${key}</span> ${trees.map(stat => `<span>${stat.name} : <span class="text-blue-400">${stat.value} point${stat.value > 1 ? 's' : ''}</span></span>`).join(" ")} </span>`
                            }).join("")}
                        </div>
                        <svelte:fragment slot='footer'>
                            <Button>Close</Button>
                        </svelte:fragment>
                    </Modal>
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
