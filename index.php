<?php
    require __DIR__ . './PHP/header.php';
?>
<div class="h-screen flex justify-center content-center items-center mb-5 mt-5">
    <div class="flex justify-center content-center items-center">
        <main class="block">
            <article class="start-grid justify-items-center place-content-between mb-10 rounded-lg">
                <div class="emoji-orbit">🏎</div>
                <div class="emoji-track opacity-0 sm:opacity-100"></div>
                <div class="text-container">
                    <div class="animation one"></div>
                    <div class="text one">Bem-vindo ao</div>
                    <div class="animation two"></div>
                    <div class="text two">Fatos da Formula 1</div>
                    <div class="emoji">🏎</div>
                    <div class="race-info">
                        <p class="sm:text-lg text-xs text-center"><?php echo "Next Race: " . getLocation($races) . " (" . getCircuit($races) . ")"; ?></p>
                        <p class="sm:text-lg text-xs text-center"><?php echo getTimeToNextRace($races); ?></p>
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
        require __DIR__ . './PHP/navbar.php';
    ?>
    <?php
        require __DIR__ . './PHP/footer.php';
    ?>