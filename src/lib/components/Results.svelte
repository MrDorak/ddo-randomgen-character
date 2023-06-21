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
        data
    } from '../../store'


    let numberGen = [1, 2, 3];
    let loading = false;
    const max = 3;
    const min = 1;

    let results = [];

    const handleClick = () => {
        const chosenRace = $racesSelected[Math.floor(Math.random() * $racesSelected.length)].name;

        let forced_class = '';
        // ["aasimar_scourge", "bladeforged", "deep_gnome", "morninglord", "purple_dragon_knight", "shadar_kai", "tiefling_scoundrel", "trailblazer"]
        switch (chosenRace) {
            case 'aasimar_scourge':
                forced_class = 'ranger'
                break;
            case 'bladeforged':
                forced_class = 'paladin'
                break;
            case 'deep_gnome':
                forced_class = 'wizard'
                break;
            case 'morninglord':
                forced_class = 'cleric'
                break;
            case 'purple_dragon_knight':
                forced_class = 'fighter'
                break;
            case 'tiefling_scoundrel':
                forced_class = 'bard'
                break;
            case 'trailblazer':
                forced_class = 'monk'
                break;
            case 'razorclaw':
                forced_class = 'barbarian'
                break;
            default: break;
        }

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

        // use input data unless nothing is selected where we use the default 1-3 range
        const numberClasses = numberGen.length > 0 ? numberGen[Math.floor(Math.random()*numberGen.length)] : Math.floor(Math.random() * (max - min + 1) + min)
        let chosenClasses = [];
        let totalLvls = 20;
        let levels, name;
        for (let i = 1; i <= numberClasses; i++) {
            if (i === 1 && forced_class.length > 0) {
                name = forced_class;
            } else {
                name = classesCopy[Math.floor(Math.random() * classesCopy.length)].name;
            }

            if (i > 1) {
                // if this is the last level, we dump all the levels remaining
                if (i === numberClasses) {
                    levels = totalLvls;
                } else {
                    levels = Math.floor(Math.random() * (totalLvls - (numberClasses - i + 1)) + 1);
                }
            } else if (numberClasses === 1) {
                levels = 20;
            } else {
                levels = Math.floor(Math.random() * ((totalLvls - numberClasses) - 1 + 1) + 1);
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
            race: chosenRace,
            alignment: chosenAlignment.name,
            classes: chosenClasses
        }, ...results]
    }

</script>

<div class="flex flex-col justify-center gap-5">
    <div class="flex flex-col justify-center gap-2">
        <span class="text-orange-500 mr-2">Number of multiclass</span>
        <div class="flex justify-center gap-3 p-2 grow rounded-lg text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white">
            <div class="flex items-center pl-3">
                <input id="checkbox-1" type="checkbox" bind:group={numberGen} value="{1}" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                <label for="checkbox-1" class="w-full ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">1 class</label>
            </div>
            <div class="flex items-center pl-3">
                <input id="checkbox-2" type="checkbox" bind:group={numberGen} value="{2}" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                <label for="checkbox-2" class="w-full ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">2 classes</label>
            </div>
            <div class="flex items-center pl-3">
                <input id="checkbox-3" type="checkbox" bind:group={numberGen} value="{3}" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                <label for="checkbox-3" class="w-full ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">3 classes</label>
            </div>
        </div>
    </div>

    <ButtonGroup class="rounded-lg justify-center shadow-none">
        <Button outline color="dark" disabled={ !$data } on:click={ handleClick }>Randomize !</Button>
        <Button outline color="dark">Clear</Button>
    </ButtonGroup>

    <div class="flex">
        {#if loading}
            <div class="text-center m-3">
                Loading <Spinner></Spinner>
            </div>
        {:else}
            <Table divClass="w-full mb-3 h-[426px] overflow-auto" hoverable={true}>
                <TableHead>
                    <TableHeadCell>Alignment</TableHeadCell>
                    <TableHeadCell>Race</TableHeadCell>
                    <TableHeadCell>Class 1</TableHeadCell>
                    <TableHeadCell>Class 2</TableHeadCell>
                    <TableHeadCell>Class 3</TableHeadCell>
                </TableHead>
                <TableBody class="divide-y">
                    {#each results as item}
                        <TableBodyRow>
                            <TableBodyCell>{item.alignment}</TableBodyCell>
                            <TableBodyCell>{item.race.replaceAll("_", " ")}</TableBodyCell>
                            {#each Array(3) as _, index(index)}
                                <TableBodyCell>{item.classes[index] ? `${item.classes[index].levels} ${item.classes[index].name.replaceAll("_", " ")}` : '-'}</TableBodyCell>
                            {/each}
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        {/if}
    </div>
</div>
