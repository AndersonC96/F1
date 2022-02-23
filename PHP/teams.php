<?php
    require __DIR__ . './header.php';
?>
<?php
    require __DIR__ . './navbar.php';
?>
<?php
    $sorting = 'team';
    if(isset($_GET['sorting']) && !empty($_GET['sorting'])){
    // se a classificação está definida e não vazia
        $sorting = $_GET['sorting'];
    }
?>
<div class="mb-5 mt-5">
    <div class="">
        <form class="absolute right-[33%] text-xs sm:right-[5%] sm:text-lg" action="./teams.php" id="sorting-form">
            <label class="mr-1" for="sorting">Ordenar por:</label>
            <select class="border border-black rounded-md" name="sorting" id="">
                <option value="name" disabled selected> </option>
                <option value="team">Padrão</option>
                <option value="name">Nome</option>
                <option value="wins">Vitórias</option>
                <option value="championships">Campeonatos</option>
            </select>
        </form>
        <div class="mb-20">
            <main class="grid grid-cols-1 sm:grid-cols-2 sm:gap-1 pt-10">
                <?php foreach (getTeams($teams, $sorting) as $team) : ?>
                    <?php
                        $driversFromTeam = getDriversFromTeam($drivers, $team['name']);
                        $driversString = implode(" & ", $driversFromTeam);
                    ?>
                    <article class="grid justify-items-center mb-20 sm:text-xs">
                        <img class="scale-75 motion-safe:hover:scale-90 filter grayscale hover:filter-none" src="<?php echo $team['image']; ?>" alt="<?php echo $team['name']; ?>">
                        <h2 class="uppercase font-bold sm:text-lg text-base text-center hover:text-pink-500 mb-2"><a href="<?php echo $team['website'] ?>"><?php echo $team['name']; ?></a></h2>
                        <div class="flex flex-col items-center justify-center justify-items-center">
                            <p class="sm:text-lg text-sm text-center"><?php echo "<b>Pilotos</b>: " . $driversString; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Equipe Principal</b>: " . $team['teamPrincipal']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Chefe Técnico</b>: " . $team['technical_chief']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Sede</b>: " . $team['base']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Unidade de energia</b>: " . $team['powerUnit']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Motor</b>: " . $team['engine']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Chassis</b>: " . $team['chassis']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Título de Construtores</b>: " . $team['championships']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Título de Pilotos</b>: " . $team['driversChampionships']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Corridas</b>: " . $team['racesEntered']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Primeira corrida</b>: " . $team['firstEntry']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Corridas vencidas</b>: " . $team['wins']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Primeira vitória</b>: " . $team['firstWin']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Última vitória</b>: " . $team['lastWin']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Pódios</b>: " . $team['podiums']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Pole positions</b>: " . $team['pole_positions']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Volta mais rápida</b>: " . $team['fastest_laps']; ?></p>
                            <p class="sm:text-lg text-sm text-center"><?php echo "<b>Melhor Colocação</b>: " . $team['highestraceResult']; ?></p>
                            <p class="sm:text-lg text-sm"><?php echo "<b>Estreia</b>: " . $team['year']; ?></p>
                            <img class="scale-75 motion-safe:hover:scale-90 filter grayscale hover:filter-none" src="<?php echo $team['imageCar']; ?>">
                        </div>
                    </article>
                <?php endforeach; ?>
            </main>
        </div>
        <style>
            ul>li:nth-of-type(2)>a{
                color: white;
                text-transform: uppercase;
            }
        </style>
        <?php
            require __DIR__ . './footer.php';
        ?>