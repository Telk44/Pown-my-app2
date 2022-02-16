##  Pown my app


 ## Pour lancer l'application : 

Exécuter la commande:

    npm install

puis

   node app.js


## Pour sécuriser l'application : 

-- Faille XSS 
pour échapper les caractères, intégrer la fonction suivante dans app.js / app.post ligne 69

 if (passwordMatch) {
                function htmlEncode(str){
                    return String(str).replace(/[^\w. ]/gi, function(c){
                    return '&#'+c.charCodeAt(0)+';';
                    })
                };
                let usrname = htmlEncode((foundUser.username));
                res.send(`<div align ='center'><h3>Welcome ${usrname} ! </h3></div>`);

-- Faille CSRF 
Mise en place d'un système de token unique, jeton CSRF. Vérifier dans le dossier app.js et dans app.post, la concordance du token généré et envoyé. Je n'ai pas réussi à le faire! 