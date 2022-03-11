<?php
    require __DIR__ . '/header.php';
?>
<?php
    require __DIR__ . '/navbar.php';
?>
<?php
    $sorting = 'team';
    if(isset($_GET['sorting']) && !empty($_GET['sorting'])){
    // se a classificação está definida e não vazia
        $sorting = $_GET['sorting'];// armazena a classificação
    }
?>
<div class="mb-5 mt-5">
    <div class="">
        <form class="absolute right-[40%] text-xs sm:right-[2%] sm:text-lg" action="./races.php" id="sorting-form">
            <label class="mr-1" for="sorting">Ordenar por: </label>
            <select class="border border-black rounded-md" name="sorting" id="">
                <option value="team" disabled selected> </option>
                <option value="team">Equipe</option>
                <option value="wins">Vitórias</option>
                <option value="name">Nome</option>
            </select>
        </form>
        <main class="grid grid-cols-1 sm:grid-cols-2 sm:gap-1 pt-10">
            <?php foreach ( getCalendar($calendar, $sorting) as $race) : ?>
                <article class="grid justify-items-center place-content-between mb-10 rounded-lg hover:bg-gray-100">
                    <img class="scale-90 motion-safe:hover:scale-100 filter grayscale hover:filter-none" src="<?php echo $race['image']; ?>" alt="<?php echo $race['name']; ?>">
                    <h2 class="uppercase font-bold sm:text-lg text-lg text-center hover:text-pink-500"><a href="<?php echo $race['site'] ?>"><?php echo $race['name']; ?></a></h2>
                    <div class="flex flex-col items-center justify-center justify-items-center sm:text-lg text-base text-center">
                        <p class="text-center mb-2"><b><?php echo $race['country']; ?></b></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Circuito</b>: " . $race['circuit']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Primeiro Grande Prêmio</b>: " . $race['first_grand_prix']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Primeiro vencedor</b>: " . $race['first_win']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Último vencedor</b>: " . $race['last_win']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Mais vitórias</b>: " . $race['most_win']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Mais vitórias (Construtores)</b>: " . $race['most_wins_constructors']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Mais pole position</b>: " . $race['most_pole']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Mais pódios</b>: " . $race['most_podiums']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Mais pontos</b>: " . $race['most_points']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Mais voltas lideradas</b>: " . $race['most_laps_led']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Volta mais rápida</b>: " . $race['lap_record']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Número de voltas</b>: " . $race['number_of_laps']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Tamanho do circuito</b>: " . $race['circuit_length']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "<b>Distância percorrida</b>: " . $race['race_distance']; ?></p>
                    </div>
                </article>
            <?php endforeach; ?>
        </main>
    </div>
</div>
<style>
    ul>li:nth-of-type(3)>a{
        color: white;
        text-transform: uppercase;
    }
</style>
<?php
    require __DIR__ . '/footer.php';
?>