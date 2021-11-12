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
        <form class="absolute right-[40%] text-xs sm:right-[2%] sm:text-lg" action="./drivers.php" id="sorting-form">
            <label class="mr-1" for="sorting">Ordenar por: </label>
            <select class="border border-black rounded-md" name="sorting" id="">
                <option value="team" disabled selected> </option>
                <option value="team">Equipe</option>
                <option value="wins">Vitórias</option>
                <option value="name">Nome</option>
            </select>
        </form>
        <main class="grid grid-cols-1 sm:grid-cols-2 sm:gap-1 pt-10">
            <?php foreach (getDrivers($drivers, $sorting) as $driver) : ?>
                <article class="grid justify-items-center place-content-between mb-10 rounded-lg hover:bg-gray-100">
                    <img class="scale-90 motion-safe:hover:scale-100 filter grayscale hover:filter-none" src="<?php echo $driver['image']; ?>" alt="<?php echo $driver['name']; ?>">
                    <h2 class="uppercase font-bold sm:text-lg text-lg text-center hover:text-pink-500"><a href="<?php echo $driver['website'] ?>"><?php echo $driver['name']; ?></a></h2>
                    <div class="flex flex-col items-center justify-center justify-items-center sm:text-lg text-base text-center">
                        <p class="text-center mb-2"><?php echo $driver['team']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "Nacionalidade: " . $driver['nationality']; ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "Idade: " . age($driver['birthYear']); ?></p>
                        <p class="sm:text-lg text-sm text-center"><?php echo "Vitórias: " . $driver['wins']; ?></p>
                        <p class="sm:text-lg text-sm text-center mb-10"><?php echo "Venceu nesta temporada: " . isWinnerThisSeason($driver['wonThisSeason']); ?></p>
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