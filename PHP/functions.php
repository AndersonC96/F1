<?php
    declare(strict_types=1);// modo estrito
    require __DIR__ . '/data.php';// requer o arquivo data.php
    function getTeamFromDriver(array $driverList, string $driver): array{
    // retorna o array com os dados do piloto
        $returnTeam = [];// cria um array vazio
        foreach($driverList as $name){
        // percorre o array
            /*if($name['driver'] === $driver){// se o nome do piloto for igual ao nome do piloto passado
                $returnTeam[] = $name;// adiciona o array com os dados do piloto ao array de retorno
            }*/
            if($name['name'] === $driver){
                array_push($returnTeam, $name['team']);// adiciona o array com os dados do piloto ao array de retorno
            }
        }
        return $returnTeam;// retorna o array de retorno
    };
    function getDriversFromTeam(array $driverList, string $team): array{
    // retorna o array com os dados dos pilotos
        /*$returnDrivers = [];// cria um array vazio
        foreach($driverList as $name){
            if($name['team'] === $team){
                $returnDrivers[] = $name;// adiciona o array com os dados do piloto ao array de retorno
            }
        }
        return $returnDrivers;// retorna o array de retorno*/
        $returnDriver = [];// cria um array vazio
        foreach($driverList as $name){
            if($name['team'] === $team){
                array_push($returnDriver, $name['name']);// adiciona o array com os dados do piloto ao array de retorno
            }
        }
        return $returnDriver;// retorna o array de retorno
    };
    function isDriverAWinnerThisSeason(array $drivers): void{
    // recebe o array de pilotos
        /*foreach($drivers as $driver){// percorre o array de pilotos
            if($driver['points'] > 0){// se o piloto tiver pontos
                echo $driver['name'] . ' is a winner this season!';// imprime o nome do piloto
            }
        }*/
        foreach($drivers as $driver){
            if($driver['wonThisSeason'] === true){
                echo $driver['name'] . " (" . $driver['team'] . ")" . " é o campeão da temporada.\n";// imprime o nome do piloto
            }else{
                continue;// pula para o próximo
            }
        }
    };
    function isWinnerThisSeason(bool $hasWon): string{
    // recebe um booleano
        /*if($hasWon === true){// se o piloto tiver ganho
            return 'ganhou';// retorna a string ganhou
        }else{// se o piloto não tiver ganho
            return 'perdeu';// retorna a string perdeu
        }*/
        return $hasWon ? "Yes" : "No";// retorna a string ganhou ou perdeu
    };
    function age(int $birthyear): int{// recebe um inteiro
        return date('Y') - $birthyear;// retorna a idade do piloto
    };
    function timeToNextRace(){
    // função que retorna o tempo para a próxima corrida
        /*$date = new DateTime('2020-05-05');// cria uma nova data
        $now = new DateTime();// cria uma nova data
        $interval = $date->diff($now);// cria um intervalo entre as datas
        return $interval->format('%a');// retorna o tempo em dias*/
        $date = strtotime("2021-10-24");// cria uma nova data
        $remaining = $date - time();// cria um intervalo entre as datas
        $days_remaining = floor($remaining / 86400);// retorna o tempo em dias
        $hours_remaining = floor(($remaining % 86400) / 3600);// retorna o tempo em horas
        echo "$days_remaining dias e $hours_remaining horas restantes";// imprime o tempo restante
    }
    function nextRace(array $races): array{
        $i = 0;
        foreach($races as $race){
            if(strtotime($race['dateTime']) > strtotime(date("Y-m-d"))){
                return $races[$i];
            }
            $i += 1;
        }
    }
    function getLocation(array $races): string{
        $nextRace = nextRace($races);
        return $nextRace['location'];
    }
    function getCircuit(array $races): string{
        $nextRace = nextRace($races);
        return $nextRace['circuit'];
    }
    function getTimeToNextRace(array $races): string{
        $nextRace = nextRace($races);
        $rem = strtotime($nextRace['dateTime']) - time();
        $day = floor($rem / 86400);
        $hr  = floor(($rem % 86400) / 3600);
        $min = floor(($rem % 3600) / 60);
        $timeLeft = "$day Dias $hr Horas $min Minutos restantes";
        return $timeLeft;
    }
    function getDrivers(array $drivers, string $sorting){
        $sortByWins = array_column($drivers, 'wins');
        $sortByName = array_column($drivers, 'name');
        if($sorting === "wins"){
            array_multisort($sortByWins, SORT_DESC, $drivers);
        }else if($sorting === "name"){
            array_multisort($sortByName, SORT_ASC, $drivers);
        }
        return $drivers;
    }
    function getTeams(array $teams, string $sorting){
        $sortByWins = array_column($teams, 'wins');
        $sortByName = array_column($teams, 'name');
        $sortByChampionchips = array_column($teams, 'championships');
        if($sorting === "wins"){
            array_multisort($sortByWins, SORT_DESC, $teams);
        }else if($sorting === "name"){
            array_multisort($sortByName, SORT_ASC, $teams);
        }else if($sorting === "championships"){
            array_multisort($sortByChampionchips, SORT_DESC, $teams);
        }
        return $teams;
    }
    function getChampions(array $champions, string $sorting){
        $sortByWins = array_column($champions, 'wins');
        $sortByName = array_column($champions, 'name');
        if($sorting === "wins"){
            array_multisort($sortByWins, SORT_DESC, $champions);
        }else if($sorting === "name"){
            array_multisort($sortByName, SORT_ASC, $champions);
        }
        return $champions;
    }