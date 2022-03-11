var firebaseConfig = {
    apiKey: "AIzaSyBmHGKgQ2b-Ev6BAN2PfUrxqGbIZuu_ZLs",
    authDomain: "when2meet2-f6008.firebaseapp.com",
    projectId: "when2meet2-f6008",
    storageBucket: "when2meet2-f6008.appspot.com",
    messagingSenderId: "1093028913539",
    appId: "1:1093028913539:web:55f4635a43e15aa1c7d6b6"
  };
  
  // for =================== make a meeting =================
  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize auth and firestore references
  const auth = firebase.auth()
  const database = firebase.firestore()
  
  // udpate firestore settings
  database.settings({timestampsInSnapshots: true})
  
  // Set up our register function
  // what it does:
  // ensures that email that user entered is not in firestore (will send alert if it is)
  // adds new user to firestore
  
  const app = Vue.createApp({
    data() {
        // returns an object
        return {
            // any key value pairs or properties of your choice
            // ================= for auth_signup.html ===================
            email: '',
            password: '',
            userToken: '',
            error_code: '',
            userId: '',
  
            signup_username: '',
            signup_email: '',
            signup_tele: '',
            signup_password: '',
  
            // ================= for auth_login.html ===================
            logged_in_user: '',
  
  
            // ================= for my_availability.html ===================
            days_of_week: [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday'
            ], 
            time_intervals:[
              '00:00',
              '01:00',
              '02:00',
              '03:00',
              '04:00',
              '05:00',
              '06:00',
              '07:00',
              '08:00',
              '09:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '19:00',
              '20:00',
              '21:00',
              '22:00',
              '23:00'
            ],
  
            // ================== for my_friends.html==================
            my_friends_array: [],
            // my_friends_array should only contain emails
            my_friends_schedule:[],

            array_of_usernames : [],
            array_of_names : [],
            keyed_username : '',
            check_friend_username_exist : '',
            added_friend: '',
            button_clicked : false,
  
  
            // ====================== for make a meeting =================
  
            user_list: [],
            days: [],
            dates: [],
            no_modification_time_intervals:[
              '00:00',
              '01:00',
              '02:00',
              '03:00',
              '04:00',
              '05:00',
              '06:00',
              '07:00',
              '08:00',
              '09:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '19:00',
              '20:00',
              '21:00',
              '22:00',
              '23:00'
            ],
            compounded_time_slot:[
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            ],
  
            start_date: '',
  
            months: [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December'
            ],
  
            selected_times: [],
  
            selected_meeting: {
                date: '',
                time: ''
            },
  
            showCalendar: false
        }
    },
    // ===================for my_availability.html===================
    mounted() {
      if (localStorage.schedule) {
        console.log("mounted_schedule")
        this.user_list.available_time_slots = JSON.parse(localStorage.schedule);
  
      }
    },
  
    created() {
      // this should populate the user list
      let user_id = localStorage.getItem("user_id")
      
      //if user first time logs in we need to run populate_user_list at least once
      if(user_id == null){
        
        
      }
      this.populate_user_list();
      // we need to populate current user evertime we refresh and all the data should come from local storage
      // this.user_list = JSON.parse(localStorage.getItem("user_list"))
      // this.my_friends_array = JSON.parse(localStorage.getItem("my_friends_array"))




      this.get_list_of_friends_details(); 
      // console.log(this.user_list.available_time_slots)
      // console.log(this.my_friends_schedule)

      // this.populate_my_friends();


      // ============ for my_friends.html ================
      
  
  
      // console.log(this.populate_my_friends());
      
  
      console.log('===========created()==============')
      // listener for a change in auth status
      // auth.onAuthStateChanged(user => {
      //   if (user) {
      //     console.log('user logged in: ', user)
          
      //     this.userToken = user
      //     alert('user logged in!')
          
  
      //     // store user id
      //     this.userId = user.uid;
      //     console.log("Logged in user Id:" + this.userId);
          
      //     // retrieve data from firestore
      //     database.collection("users").get()
      //     .then(snapshot => {
      //       console.log('=====snapshot======')
      //       let records = snapshot.docs
      //       records.forEach(user => {
      //         if(user.id == this.userId){
      //           console.log(user.data()) // retrieves the indiviual data for logged in user JSON
      //           this.logged_in_user = user.data()
      //           console.log("stored used: " + JSON.stringify(this.logged_in_user))
      //           // window.location.href="my_availability.html"
      //         }
      //       })
      //     })
      //   }
      //   else {
      //     console.log('user logged out from created()')
      //     // alert('user logged out!')
      //     this.userToken = user
      //     // window.location.href="login.html"
          
      //   }
      // })
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
                '0': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                '1': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                '2': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                '3': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                '4': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                '5': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                '6': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            },
              my_friends: []
            })
  
            alert('User created!')
  
          })
          .catch(function (error) {
            var error_code = error.code
            var error_message = error.message
  
            console.log(error_code)
            alert(error_message)
          })
      },
  
      login_user() {
        console.log('==========LOGIN FUNCTION===========')
        console.log(this.email)
        console.log(this.password)
      
        auth.signInWithEmailAndPassword(this.email, this.password)
        .then(cred=>{
          console.log('=====credentials======')
          console.log(cred)
          // console.log(cred.user)
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
        auth.signOut()
        .then(() => {
          console.log("User signed out by logout()")
        }) 
      },
  
      // ======================= for my_availability =======================
      change_availability(day_index,time_index){
        // id of person is still being hardcoded until the database is up
        
        // console.log(id_of_person)
        // console.log(time_index)

        let the_exact_date_and_time_availability = this.user_list.available_time_slots[day_index][time_index]
        if(the_exact_date_and_time_availability == 1){
          // the_exact_date_and_time_availability = '8'
          this.user_list.available_time_slots[day_index][time_index] = 0

        }else{
          // the_exact_date_and_time_availability = '9'
          this.user_list.available_time_slots[day_index][time_index] = 1
        }
        
        console.log(this.user_list.available_time_slots)
        let string_schedule = JSON.stringify(this.user_list.available_time_slots)
        localStorage.setItem("schedule",string_schedule)


        // for(user of this.user_list){
        //     // console.log(user.id)
        //     if(user.id == id_of_person){
  
        //         // THIS IS TO SEE WHAT THE INITIAL LIST WAS BEFORE YOU CLICK TO CHANGE THE BUTTON
        //         console.log(user.available_time_slots[day_index])
        //         let the_exact_date_and_time_availability = user.available_time_slots[day_index][time_index]
        //         if(the_exact_date_and_time_availability == 1){
        //             // the_exact_date_and_time_availability = '8'
        //             user.available_time_slots[day_index][time_index] = 0
  
        //         }else{
        //             // the_exact_date_and_time_availability = '9'
        //             user.available_time_slots[day_index][time_index] = 1
        //         }
  
        //         //THIS CONSOLE LOG IS TO SEE THE LIST WITH THE VALUE THAT HAS BEEN CHANGED AFTER YOU PRESS THE BUTTON
        //         console.log(user.available_time_slots[day_index])
        //     }          
        // }

      },
  
      getTimeslot() {
        //this function takes in an id and return all the available time slot of the person
        return this.user_list.available_time_slots
      },
      // ======================= for my_friends ========================
      start_autocomplete(){
        // console.log(input_field)
        this.autocomplete(input_field,this.array_of_usernames);
      },
  
      autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        // console.log(inp)
        // console.log("HELLO")
        // console.log(array_of_usernames)
  
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
          var a, b, i, val = this.value;
          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) { return false; }
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          a = document.createElement("DIV");
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);
          /*for each item in the array...*/
          for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              /*create a DIV element for each matching element:*/
              b = document.createElement("DIV");
              /*make the matching letters bold:*/
              b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
              b.innerHTML += arr[i].substr(val.length);
              /*insert a input field that will hold the current array item's value:*/
              b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function (e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
              });
              a.appendChild(b);
            }
          }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
            }
          }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
          closeAllLists(e.target);
        });
      },
  
      // populate_my_friends() {
      //   // user_id = 'V7ExWdwh2Zrnb5G5GFce'
      //   // console.log("get Friends function")
      //   console.log("=======populate_my_friends()========")
      //   let user_id = localStorage.getItem("user_id")
      //   let api_endpoint = 'https://us-central1-when2meet2-f6008.cloudfunctions.net/user/'
      //   api_endpoint += user_id
      //   axios.get(api_endpoint)
      //     .then(response => {
      //       this.my_friends_array = response.data.my_friends
      //       console.log(this.my_friends_array)
      //       // now we need to populated the my_friends_schedule
      //       axios

      //     })
      //     .catch(error => {
      //       console.log(error.message)
      //     })
      // },

      populate_user_list() {
        // this function will populate user_list and my friends array with friends user name
      
        console.log("==populate_user_list()==")
        let user_id = localStorage.getItem("user_id")
        let api_endpoint = 'https://us-central1-when2meet2-f6008.cloudfunctions.net/user/'
        api_endpoint+= user_id
        axios.get(api_endpoint)
        .then(response => {
            // this.user_list = response.data
            // console.log(this.user_list)
            // console.log(response.data)
            this.user_list = response.data
            this.my_friends_array = response.data.my_friends
            // localStorage.setItem("user_list",JSON.stringify(response.data))
            // localStorage.setItem("my_friends_array",JSON.stringify(response.data.my_friends))
            
            console.log(this.user_list.available_time_slots)

            
        })
        .catch(error => {
            console.log(error.message)
        })
    },
  
      get_list_of_friends_details() {
        console.log("======== get_list_of_friends_details=======")
        //this will populate array_of_usernane,array_of_names with all the database and names
        //
        let api_endpoint = 'https://us-central1-when2meet2-f6008.cloudfunctions.net/user'
        axios.get(api_endpoint)
          .then(response => {
            // console.log(response.data)
            let user_array = response.data
            const current_user ={}
            current_user.name = this.user_list.name
            current_user.username = this.user_list.username
            current_user.available_time_slots = this.user_list.available_time_slots
            current_user.added= false
            this.my_friends_schedule.push(current_user)
            // localStorage.setItem("current_user",JSON.stringify(current_user))
            for (user of user_array) {
                this.array_of_usernames.push(user.username)
                this.array_of_names.push(user.name)
              for( user_name of this.my_friends_array) {
                if(user_name == user.username){
                  const friend = {}
                  friend.name = user.name
                  friend.username = user.username
                  friend.available_time_slots = user.available_time_slots
                  friend.added = false
                  this.my_friends_schedule.push(friend)
                  
                  console.log(this.my_friends_schedule)
                  
                  // this.array_of_schedule.push(user.available_time_slots)

                }
              
              }
              
            }
            // this.my_friends_array = response.data.my_friends
          })
          .catch(error => {
            console.log(error.message)
          })
      },
  
      check_add_friend_username() {
        // console.log(this.array_of_usernames)
        // console.log(this.keyed_username)
        console.log(input_field.value)
        if (this.array_of_usernames.includes(input_field.value)) {
          // console.log(true)
          this.keyed_username = input_field.value
          this.check_friend_username_exist = true
        }
  
      },
  
      is_button_clicked() {
        console.log("BUTTONCLICKED")
        // console.log(this.check_friend_username_exist)
        this.button_clicked = true
        this.check_add_friend_username()
        // this.button_clicked = false
      },
  
      add_friend(user_id) {
        // console.log(this.my_friends_array)
        // this.keyed_username = ''
  
        this.check_friend_username_exist = false
        this.my_friends_array.push(input_field.value)
        // console.log(new_friends_array)
        // console.log(this.my_friends_array)
  
        let url = 'https://us-central1-when2meet2-f6008.cloudfunctions.net/user/V7ExWdwh2Zrnb5G5GFce'
        axios.put(url,
          {
            my_friends: this.my_friends_array,
          }
  
        )
  
          .then(response => {
  
          })
          .catch(error => {
  
          });
  
      },
  
      remove_friend(to_remove_username) {
        // console.log(to_remove_username)
        // console.log(this.my_friends_array)
        this.removeItemOnce(this.my_friends_array, to_remove_username)
        // console.log(this.my_friends_array)
        let url = 'https://us-central1-when2meet2-f6008.cloudfunctions.net/user/V7ExWdwh2Zrnb5G5GFce'
        axios.put(url,
          {
            my_friends: this.my_friends_array,
          }
        )
          .then(response => {
  
          })
          .catch(error => {
  
          });
      },
  
      removeItemOnce(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
          arr.splice(index, 1);
        }
        return arr;
      },
  
      // ==================== for make a meeting ==================
      checkItems(day) {
        return true
      },
  
      addPerson(person_obj) {
        console.log("====== addPerson ======")
        console.log(person_obj)
        // toggle when user clicks on the member's names
        if (person_obj.added == false) {
          person_obj.added = true
          let this_person_available_time_slot = person_obj.available_time_slots
          // this for loop is to add all thier avaiable time slot in to vue data of compounded time slot
          // compounded time slot will be used to display all time slot
          //first loop is for each day
          for (index in this_person_available_time_slot) {
            let current_time_slot = this.compounded_time_slot[index]
            this.compounded_time_slot[index] = this_person_available_time_slot[index].map(function (num, idx) {
              return num + current_time_slot[idx]
            })
          }
        }
        else if (person_obj.added == true) {
          person_obj.added = false
          let this_person_available_time_slot = person_obj.available_time_slots
          // this for loop is to add all thier avaiable time slot in to vue data of compounded time slot
          // compounded time slot will be used to display all time slot
          for (obj in this_person_available_time_slot) {
            let current_time_slot = this.compounded_time_slot[obj]
            this.compounded_time_slot[obj] = this_person_available_time_slot[obj].map(function (num, idx) {
              return current_time_slot[idx] - num
            })
          }
        }
      },
  
      process_timeframe() {
        //get dates for calendar
        this.generate_days()
        
        console.log("========process time frame start==============")
        let start_time = document.getElementById("no_ealier_than").value
        let end_time = document.getElementById("no_later_than").value
        console.log(start_time)
        console.log(end_time)
        
        
        
        //this for loop will edit compounded_time_slot
        for(day in this.compounded_time_slot){
            this.compounded_time_slot[day] = this.compounded_time_slot[day].slice(start_time,end_time)
            
        }
        console.log(this.compounded_time_slot.Monday)
  
        //now we need to edit the rows
        // for loop all the data into a list so we can use slice on list 
        // we cant use slice on object array 
        let time_intervals = []
        for(time of this.time_intervals){
            time_intervals.push(time)
        }
        //slicing
        time_intervals = time_intervals.slice(start_time,end_time)
        //now clear the time 
        this.time_intervals = []
  
        for(time of time_intervals){
            this.time_intervals.push(time)
        }
        console.log(time_intervals)
  
        this.showCalendar = true
  
      },
    reset_page(){
        location.reload()
      },
  
    generate_days() {
        if ( this.start_date != '' ) {
            // create a new date object
            let start_date = new Date(this.start_date)
  
            let dates_arr = []
            let days_arr = []
  
            // loop through for the week
            // every time adding one day
            for (let i=0; i<7; i++) {
                let new_date = start_date.addDays(i)
  
                let date = new_date.getDate()
                let month = new_date.getMonth() + 1
                let year = new_date.getFullYear()
                let day = this.days_of_week[new_date.getDay()]
  
                let date_str = date + "/" + month + "/" + year
                dates_arr.push(date_str)
                days_arr.push(day)
            }
            
            this.dates = dates_arr
            this.days = days_arr
        }
  
      },
  
    selectCell(time_idx, day_idx) {
        // triggered when a user selects on a cell in the calendar
        console.log(time_idx)
        console.log(day_idx)
  
        let selectedObj = {
            day: Number(day_idx),
            time: time_idx
        }
  
        this.selected_times.push(selectedObj)
        
        // selected_times contains the objects of all the cells that user clicked on
        console.log(this.selected_times);
  
      }
    },
    // ===================for make a meeting ===================
    computed: {
      processSelected() {
        let sorted_selected_obj = {
            date: '',
            times: []
        }
  
        for ( selectedObj of this.selected_times ) {
            let date = selectedObj.day
            let time = selectedObj.time
            
            if ( sorted_selected_obj.date == '' && sorted_selected_obj.times == '' ) {
                sorted_selected_obj.date = date
                sorted_selected_obj.times = [time]
            }
  
            else {
                // if date is the same, push time into times arr
                if ( sorted_selected_obj.date == date ) {
                    sorted_selected_obj.times.push(time)
                }
  
                // else, change sorted_selected_obj to take on new date and new time
                else {
                    sorted_selected_obj.date = date
                    sorted_selected_obj.times = [time]
                }
            }     
        }
  
        console.log(sorted_selected_obj)
  
        // get min and max times in times array (start time and end time)
        let times = sorted_selected_obj.times
        let min = Math.min(...times);
        let max = Math.max(...times);
        
        console.log('min: ', min)
        console.log('max: ', max)
  
        // only update selected_meeting if user has selected anything (to avoid it showing undefined)
        if ( times.length > 0 && min != max ) {
            let duration = this.time_intervals[min] + "-" + this.time_intervals[max]
  
            this.selected_meeting = {
                date: this.dates[sorted_selected_obj.date],
                time: duration
            }
        }
  
        // if user has only selected one time (i.e min = max)
        else if ( times.length > 0 && min != -1 && min == max ) {
            let duration = this.time_intervals[min] + "-" + ''
  
            this.selected_meeting = {
                date: this.dates[sorted_selected_obj.date],
                time: duration
            }
        }
        
      }
    }
  });
        
  