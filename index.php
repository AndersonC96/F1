<?php
    require __DIR__ . '/PHP/header.php';
?>
<div class="h-screen flex justify-center content-center items-center mb-5 mt-5">
    <div class="flex justify-center content-center items-center">
        <main class="block">
            <article class="start-grid justify-items-center place-content-between mb-10 rounded-lg">
                <div class="emoji-orbit"><center>🏎</center></div>
                <div class="emoji-track opacity-0 sm:opacity-100"></div>
                <div class="text-container">
                    <div class="animation one"></div>
                    <div class="text one"><center>Bem-vindo ao</center></div>
                    <div class="animation two"></div>
                    <div class="text two"><center>Portal Formula 1</center></div>
                    <div class="emoji"><center>🏎</center></div>
                    <div class="race-info">
                        <p class="sm:text-lg text-xs text-center"><?php echo "<b>Próxima corrida</b>: " . getLocation($races) . " (" . getCircuit($races) . ")"; ?></p>
                        <p class="sm:text-lg text-xs text-center"><?php echo "<b>Grande prêmio</b>: " . getGrandPrix($races); ?></p>
                        <p class="sm:text-lg text-xs text-center"><?php echo "<b>Tempo restante</b>: " . getTimeToNextRace($races); ?></p>
                    </div>
                </div>
            </article>
        </main>
    </div>
    </div>
    <style>
        ul>li:nth-of-type(1)>a{
            color: white;
            text-transform: uppercase;
        }
    </style>
    <?php
        require __DIR__ . '/PHP/navbar.php';
    ?>
    <?php
        require __DIR__ . '/PHP/footer.php';
    ?>