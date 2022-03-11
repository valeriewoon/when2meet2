const firebaseConfig = {
    apiKey: "AIzaSyBmHGKgQ2b-Ev6BAN2PfUrxqGbIZuu_ZLs",
    authDomain: "when2meet2-f6008.firebaseapp.com",
    projectId: "when2meet2-f6008",
    storageBucket: "when2meet2-f6008.appspot.com",
    messagingSenderId: "1093028913539",
    appId: "1:1093028913539:web:55f4635a43e15aa1c7d6b6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize auth and firestore references
const auth = firebase.auth()
const database = firebase.firestore()

// udpate firestore settings
database.settings({ timestampsInSnapshots: true })

// Set up our register function
// what it does:
// ensures that email that user entered is not in firestore (will send alert if it is)
// adds new user to firestore

const new_user = Vue.createApp({
    data() {
        // returns an object
        return {
            // any key value pairs or properties of your choice
            email: '',
            password: '',
            userToken: '',
            error_code: '',
            name: '',
            signup_username: '',
            signup_email: '',
            signup_tele: '',
            signup_password: '',

            // UI data
            typeValue: '',
            typeStatus: false,
            typeArray: ['When2Meet2'],
            typingSpeed: 50,
            erasingSpeed: 100,
            newTextDelay: 200,
            charIndex: 0
        }
    },

    methods: {
        // auth/weak-password
        // auth/email-already-in-use
        // auth/invalid-email

        register() {
            console.log("register()")
            auth.createUserWithEmailAndPassword(this.signup_email, this.signup_password)
                .then(cred => {
                    database.collection("users").doc(cred.user.uid).set({
                        email: this.signup_email,
                        username: this.signup_username,
                        added: false,
                        upcoming_meetings: [],
                        available_time_slots: {
                            '0': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '1': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '2': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '3': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '4': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '5': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            '6': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                        },
                        my_friends: [],
                        name: this.name
                    })
                    .then((docRef) => {
                        console.log(docRef)
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                    alert('User created!')
                })
                .catch(function (error) {
                    var error_code = error.code
                    var error_message = error.message

                    console.log(error_code)
                    alert(error_message)
                })
            // window.location.href = "auth_login.html"
        },



        login_user() {
            console.log('==========LOGIN FUNCTION===========')
            console.log(this.email)
            console.log(this.password)

            auth.signInWithEmailAndPassword(this.email, this.password)
                .then(cred => {
                    console.log('=====credentials======')
                    console.log(cred)
                    // console.log(cred.user)

                    // PUT EVERTHING INTO LOCAL STORAGE

                    localStorage.setItem("user_id", cred.user.uid)
                    window.location.replace("my_availability.html")
                })
                .catch(err => {
                    console.log(err.code)
                    // alert(err.message)
                    this.error_code = err.code
                    // auth/user-not-found -> wrong email
                    // auth/wrong-password -> wrong or empty password
                    // auth/invalid-email -> empty email
                })
        },


        logout() {
            console.log("logout()")
            auth.signOut()
                .then(() => {
                    console.log("User signed out by logout()")
                    window.location.href = "auth_login.html"
                })
        },

        typeText() {
            if (this.charIndex < this.typeArray[0].length) {
                if (!this.typeStatus) {
                    this.typeStatus = true;
                }
                this.typeValue += this.typeArray[0].charAt(this.charIndex)
                this.charIndex += 1;

                setTimeout(this.typeText, this.typingSpeed);

            }
            else {
                this.typeStatus = false

            }
        },

        termsAndConditions() {
            let template = `Fair use agreement:\nby using this app, you agree:\n1. to give the members of the group the nothing lower than an A grade.\n2. not to publish the code or any design features publicly or online without permission from the group Little Piggies G2T11\n3. enjoy this application!`;
            alert(template)
        }
    },

    created() {
        setTimeout(this.typeText, this.newTextDelay);
    }

});
