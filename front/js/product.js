let selectedColor = undefined
let selectedQuantity = undefined

// Crée le code HTML des options de couleurs qui sera inséré par displayProduct() avec innerHTML
function createColorOptions (array){
    let htmlTxt = ""
    for (let k = 0 ; k < array.colors.length ; k++){
        htmlTxt += `<option value="${array.colors[k]}">${array.colors[k]}</option>`
    }
    return htmlTxt
}

// Ajoute les elements du produit (array) dans la page via .innerHTML
function displayProduct(array, colorOptions){
    let item = document.getElementsByClassName("item")[0]
    item.innerHTML = `<article>
                        <div class="item__img">
                            <img src="${array.imageUrl}" alt="${array.altTxt}">
                        </div>

                        <div class="item__content">
                            <div class="item__content__titlePrice">
                                <h1 id="title">${array.name}</h1>
                                <p>Prix : <span id="price">${array.price}</span>€</p>
                            </div>

                            <div class="item__content__description">
                                <p class="item__content__description__title">Description :</p>
                                <p id="description">${array.description}</p>
                            </div>

                            <div class="item__content__settings">
                                <div class="item__content__settings__color">
                                <label for="color-select">Choisir une couleur :</label>
                                <select name="color-select" id="colors">
                                    <option value="">--SVP, choisissez une couleur --</option>
                                    ${colorOptions}
                                </select>
                                </div>

                                <div class="item__content__settings__quantity">
                                <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                                <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                                </div>
                            </div>

                            <div class="item__content__addButton">
                                <button id="addToCart">Ajouter au panier</button>
                            </div>
                        </div>
                    </article>`
}

// Vérifie si le produit est deja présent dans le panier
function isAlreadyStored(storedProducts, product){

    for (let l = 0 ; l < storedProducts.length ; l++){
        if (storedProducts[l].id == product.id && storedProducts[l].color == product.color){ // SI produit trouvé dans le panier
            storedProducts[l].quantity = parseInt(storedProducts[l].quantity, 10) + parseInt(product.quantity, 10) // Modifie la qte
            if (storedProducts[l].quantity > 100){
                window.alert("Quantité maximale atteinte pour ce produit")
                storedProducts[l].quantity = 100
            }
            localStorage.setItem("product", JSON.stringify(storedProducts)) // // Modifie le localstorage
            return 1
        }
    }
    return 0 // Produit non présent dans le panier
}

// Ajoute le produit au panier
function add2Cart(product){

    let storedProducts = JSON.parse(localStorage.getItem('product'))

    if (storedProducts){ // Si il y a deja des produits dans le panier
        if (isAlreadyStored(storedProducts, product)){ // Si le produit est deja present dans le panier
            // Ajustement de le quantite (automatique fait dans isalreadyStored())
        } else {
            // ajout du produit au panier
            storedProducts.push(product) // Insere le nouveau produit dans le tableau
            localStorage.setItem("product", JSON.stringify(storedProducts)) // Re-initialise la valeure de la clé 'product'
        }
        
    } else { // AJOUT DU PRODUIT DANS LE PANIER (storedProducts)
        storedProducts = []
        storedProducts.push(product) // Insere le nouveau produit dans le panier
        localStorage.setItem("product", JSON.stringify(storedProducts)) // Re-initialise la valeure de la clé 'product'
    }
}

function main(article){

    // Affiche le produit renvoyé par l'api
    let productColors = createColorOptions(article)
    displayProduct(article, productColors)


    // ECOUTE l'evenement 'change' sur le <select> id='colors'
    let colorSelector = document.getElementById('colors')
    colorSelector.addEventListener('change', function(event){
        selectedColor = event.target.value
    })

    // ECOUTE l'evenement 'change' sur le <input> id='quantity'
    let quantitySelector = document.getElementById('quantity')
    quantitySelector.addEventListener('change', function(event){
        if (event.target.value <= 0){
            event.target.value = 0
        } else if (event.target.value > 100){
            event.target.value = 100
        }
        selectedQuantity = event.target.value
    })

    // ECOUTE l'evenement 'click' sur <button> id='addToCart'
    let button = document.getElementById('addToCart')
    button.addEventListener('click', function(event){
        if (selectedColor && selectedQuantity){
            // Creation de l'ojbet 'selectedProduct' qui sera ajouter au panier
            let selectedProduct = {
                id : productId,
                color: selectedColor,
                quantity: selectedQuantity,
                price: article.price,
                imageUrl: article.imageUrl,
                alt: article.altTxt,
                name: article.name
            };
            add2Cart(selectedProduct) // Ajout du produit dans le panier (localstorage)
        } else {
            window.alert("Veuillez sélectionner une couleur ainsi qu'une quantité")
        }
    })
}


// Recupere l'id du produit depuis l'url
let productUrl = window.location.search
let urlParams = new URLSearchParams(productUrl)
let productId = urlParams.get('id')

let fetchUrl = 'http://localhost:3000/api/products/' + productId

// Récupération des données et appelle la fonction main() en lui passant en parametre le retour de la requete
fetch(fetchUrl)
    .then(function (res){
        if (res.ok){
            return res.json()
        }
    })
    .then(data => main(data))
    .catch(function (e){
        window.alert(e)
    })
