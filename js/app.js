// Initialize Firebase
var config = {
    apiKey: "AIzaSyCVnF1OOb0sxSYn0VyVHqSSeu0E8zXtW4U",
    authDomain: "test-e339a.firebaseapp.com",
    databaseURL: "https://test-e339a.firebaseio.com",
    projectId: "test-e339a",
    storageBucket: "test-e339a.appspot.com",
    messagingSenderId: "408235569660"
};

var map;
var uid;

// AIzaSyAqu7AHxVVAn3HM-0p452n_YOLSXHc13HY
firebase.initializeApp(config);

var database = firebase.database();

// firebase     .database()     .ref('chat/' + 1)     .set({         message:
// 'Hola',         date: Date(),         'transmitter':
// localStorage.getItem('uid'),         'receiver': 1     });

function authenticate() {
    firebase
        .auth()
        .onAuthStateChanged(function (user) {
            if (user) {
                uid = user.uid;
            } else {
                // No user is signed in.
            }
        });
}
var leadsRef = database.ref('users');
leadsRef.on('value', function (snapshot) {
    $('.usuarios').html('');
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        $('.usuarios').append(`<li class="list-group-item">` + childData.username + `<button onClick="eliminar('` + childSnapshot.key + `')" class="btn btn-danger pull-right">Eliminar</button></li>`);
    });
});

function getCategories() {
    var leadsRef = database.ref('categories');
    leadsRef.on('value', function (snapshot) {
        $('.usuarios').html('');
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            $('#categoria').append(` <div class="col-xs-6 col-md-3"><a href="categoria.html?id=` + childSnapshot.key + `" 
            class="thumbnail">
            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjc4IiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI3OCAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTViZDU0ODAyMzMgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxNHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWJkNTQ4MDIzMyI+PHJlY3Qgd2lkdGg9IjI3OCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxMDEuMzA0Njg3NSIgeT0iOTYuMyI+Mjc4eDE4MDwvdGV4dD48L2c+PC9nPjwvc3ZnPg==" alt="...">
            <strong">` + childData.name + `</strong>
            </a>
            </div>`);
            $('.mapa_list').append('<li class="list-group-item">' + childData.name + '</li>');
            addMarker(childData.coords);
        });
    });
}

function getChat() {
    var id = getUrlVars()['id'];
    var uid;
    firebase
        .auth()
        .onAuthStateChanged(function (user) {
            if (user) {
                uid = user.uid;
                console.log(id);
                console.log(uid);
                var leadsRef = database.ref('chat');
                leadsRef.on('value', function (snapshot) {
                    $('.chat').html('');
                    snapshot.forEach(function (childSnapshot) {
                        var childData = childSnapshot.val();
                        if (childData.receiver == id && childData.transmitter == uid || childData.receiver == uid && childData.transmitter == id) {
                            console.log('hla');
                            $('.chat').append(`<div class="col-sm-4 col-md-4 col-lg-4 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
                <span>` + childData.message + `</span>
            </div>`);
                        }
                    });
                });
            } else {
                // No user is signed in.
            }
        });
}

function getUsers() {
    var leadsRef = database.ref('users');
    leadsRef.on('value', function (snapshot) {
        $('.contactos')
            .empty
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            $('.contactos').append('<a href="chat.html?id=' + childSnapshot.key + '"><li class="list-group-item">' + childData.username + '</li></a>')
            console.log(childData);
        });
    });
}

function enviar() {

    var id = getUrlVars()['id'];
    var uid;
    firebase
        .auth()
        .onAuthStateChanged(function (user) {
            if (user) {
                uid = user.uid;
                var message = $('#message').val();
                firebase
                    .database()
                    .ref('chat')
                    .push({
                        'message': message,
                        'receiver': id,
                        'transmitter': uid,
                        'date': Date()
                    });
                $('#message').val('');

            } else {
                // No user is signed in.
            }
        });

}

function eliminar(id) {
    firebase
        .database()
        .ref('users')
        .child(id)
        .remove();
}

function getCategoria(id) {
    var id = getUrlVars()['id'];
    var categoria;
    database
        .ref('categories/' + id)
        .on('value', function (snapshot) {
            categoria = (snapshot.val());
            $('.nombre').html(categoria.name);
            $('.descripcion').html(categoria.description);
            $('.imagen').html(categoria.picture);
        });
}

function agregar() {
    var name = $('#name').val();
    var correo = $('#correo').val();

    if (!name || !correo) {
        alert('Ingresa datos válidos');
        return;
    }
    firebase
        .database()
        .ref('users')
        .push({username: name, email: correo, profile_picture: 'google.com'});
    $('#name').val('');
    $('#correo').val('');
}

function loginFb() {
    var provider = new firebase
        .auth
        .FacebookAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook
            // API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user);
            alert('Hola ' + user);
            localStorage.setItem('uid', user.uid);
            location.href = "home.html";
        })
        .catch(function (error) {
            // Handle Errors here.
            console.log(error);
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            alert(errorMessage);
            // ...
        });
}

function loginTw() {
    var provider = new firebase
        .auth
        .TwitterAuthProvider();

    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret. You can use
            // these server side with your app's credentials to access the Twitter API.
            var token = result.credential.accessToken;
            var secret = result.credential.secret;
            // The signed-in user info.
            var user = result.user;
            alert('Hola ' + user.displayName);
            localStorage.setItem('uid', user.uid);
            location.href = "home.html";
            // ...
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            alert(errorMessage);
            // ...
        });
}

function loginGmail() {
    var provider = new firebase
        .auth
        .GoogleAuthProvider();

    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google
            // API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            alert('Hola ' + user.displayName);
            localStorage.setItem('uid', user.uid);
            location.href = "home.html";
            // ...
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            alert(errorMessage);
            // ...
        });
}

function login() {
    var email = $('#email').val();
    var password = $('#password').val();
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function (result) {
            localStorage.setItem('uid', result.uid);
            location.href = "home.html";
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            // ...
        });
}

function register() {
    var email = $('#email').val();
    var password = $('#password').val();
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function (result) {
            localStorage.setItem('uid', result.uid);
            location.href = "home.html";
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            // ...
        })
}

function recover() {
    var accountEmail = $('#email').val();
    var creds = {
        email: accountEmail
    };
    firebase
        .auth()
        .sendPasswordResetEmail(accountEmail);
    alert('Verifica tu bandeja de entrada para que restaures tu contraseña');
}

function getUrlVars() {
    var vars = {};
    var parts = window
        .location
        .href
        .replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
    return vars;
}
