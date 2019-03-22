	//copie A dans B
	function copie_grille(grille_originale, grille_copie) {
		if(!Array.isArray(grille_originale) || !Array.isArray(grille_copie) || null) {
			console.log("Not an Array!");
			return null;
		}
		for (var i = 0; i < grille_originale.length; i++) {
			//slice(0) plus rapide que slice()
			grille_copie [i] = grille_originale[i].slice(0);
		}
		
		return grille_copie;
	}
	//initialise le tableau en 2 dimensions
	function init_tableau_2D(longueur, hauteur, tableau) {
		var grille = new Array();
		
		for(var i = 0; i < hauteur; i++) {
			grille[i] = new Array();
			
			for(var j = 0; j < longueur; j++) {
				grille[i][j] = tableau[(i * longueur) + j];
			}
		}

		return grille;
	}
	
	//initialise le tableau à l'aide du fichier test.txt
	async function init_grille_fichier() {
		//to do try/catch
		const data = await fetch("test.txt")
			.then(response => response.text())
			.then((data) => {

				return data;
			})	
		var res = data.match(/\d+/g);
		
		return init_tableau_2D(res[0], res[1], data.match(/(\.|\*)/gm));
	}

	//efface les cellules
	function efface(eltID) {
		document.getElementById(eltID).innerHTML = "";
	}
	
	//détermine l'état de chaque case
	function determine_etat(grille, nouvelle_grille) {
		var score = 0;
		//vérifie si la grille est utilisable (faire tous les cas)
		if(typeof grille === 'undefined' ) {
			alert("Grille non initialisée");
			return null;
		}
		if(typeof nouvelle_grille === 'undefined' ) {
			alert("Nouvelle grille non initialisée");
			return null;
		}
		//parcours du tableau
		for (var i = 0; i < grille.length; i++) {
			for (var j = 0; j < grille[0].length; j++) {
				//calcul du score
				//check des collonnes
				//cas tout en haut
				if (i > 0) {
					if(grille[i-1][j] == '*') {
						score++;
					}
				}
				//cas tout en bas
				if (i < (grille.length-1)) {
					if(grille[i+1][j] == '*') {
						score++;
					}
				}
				//check des lignes
				//cas tout à gauche
				if (j > 0) {
					if(grille[i][j-1] == '*') {
						score++;
					}
				}
				//cas tout à droite
				if (j < (grille[0].length-1)) {
					if(grille[i][j+1] == '*') {
						score++;
					}
				}
				//check des diagonales
				//cas diagonale haut gauche
				if (i > 0 && j > 0) {
					if(grille[i-1][j-1] == '*') {
						score++;
					}
				}
				//cas diagonale haut droite
				if (i > 0 && j < (grille[0].length-1)) {
					if(grille[i-1][j+1] == '*') {
						score++;
					}
				}
				//cas diagonale bas gauche
				if (i < (grille.length-1) && j > 0) {
					if(grille[i+1][j-1] == '*') {
						score++;
					}
				}
				//cas diagonale bas droite
				if (i < (grille.length-1) && j < (grille[0].length-1)) {
					if(grille[i+1][j+1] == '*') {
						score++;
					}
				}
				console.log ("score");
				console.log (score);
				//initialise nouvel etat
				//Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
				if(score < 2) {
					//mort de la cellule
					nouvelle_grille[i][j] = '.';
				}
				//Any live cell with more than three live neighbours dies, as if by overcrowding.
				if(score > 3) {
					//mort de la cellule
					nouvelle_grille[i][j] = '.';
				}
				//Any live cell with two or three live neighbours lives on to the next generation.
				/*if((grille[i][j] === 1) && (score === 2 || score === 3)) {
					//cellule en vie
					nouvelle_grille[i][j] = '*';
				}*/
				//Any dead cell with exactly three live neighbours becomes a live cell.
				if(/*grille[i][j] == '.' && */score == 3) {
					//cellule en vie
					nouvelle_grille[i][j] = '*';
				}
				//reinitialise le score
				score = 0;
			}		
		}	
		return nouvelle_grille;
	}
	
	//creation des autos pour le css dynamique
	function nb_cellule(nb_colonne) {
		var nb_auto = "";
		
		for (var j = 0; j < nb_colonne; j++) {
			nb_auto += " auto";
		}
		return nb_auto;
	}
	
	//affiche les cellules
	function affichage(tab) {
		efface("life");
		document.getElementById("life").style["grid-template-columns"]= nb_cellule(tab[0].length);
		for (var i = 0; i < tab.length; i++) {
			for (var j = 0; j < tab[i].length; j++) {
				if (tab[i][j] == "*") {
					document.getElementById("life").innerHTML += '<div style="background-color: red; " class="square"><center>Vivant</center></div>';
				}
				else {
					document.getElementById("life").innerHTML += '<div style="background-color: blue;" class="square"><center>Mort</center></div>';
				}
			}
		}
	}
	
	async function main() {
		var tab = await init_grille_fichier();
		var n_grille = new Array();
		n_grille = copie_grille(tab, n_grille);		
		affichage(tab);
		var boutton = document.getElementById('lancement');
		//ajoute un evenement sur le onclick
		boutton.addEventListener('click', 
			function(){
				console.log ("n_grille");
				console.log (n_grille);		
				console.log (tab);	
				tab = copie_grille(determine_etat(tab, n_grille)/*.slice(0)*/, tab);
				if(tab === null) {
					return null;
				}
				affichage(tab);
			});

	}
	
	main();

