let user;
let user_id;
let host_url;


async function fetchUserId(){
    let cookie = '';
    console.log(cookie);
    let res = await fetch('https://carbonfootprinting1608.herokuapp.com/user/dashboard',
        {redirect: 'follow',
            headers:{
                "Cookie":cookie
            }});
    let userJson = await res.json();
    console.log(res);
    console.log(userJson._id);
    return userJson._id;
};


async function logOut(){
    fetch("https://carbonfootprinting1608.herokuapp.com/user/logout",{
        method: 'GET',
        redirect: 'follow'
    }).then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    localStorage.setItem("loggedInUser",'');
    localStorage.setItem("gender",'');
    alert('Successfully Logged Out');
    window.location="https://carbonfootprinting1608.herokuapp.com";
}

async function registration() {
    try {
        let firstname = document.getElementById("firstname").value;
        let lastname = document.getElementById("lastname").value;
        //let username = document.getElementById("username").value;
        let password = document.getElementById("password_s").value;
        let email = document.getElementById("email_s").value;
        let gender = '';
        if (document.getElementById('male').checked) {
            gender = document.getElementById('male').value;
        } else if (document.getElementById('female').checked) {
            gender = document.getElementById('female').value;
        }
        let data = JSON.stringify({
            firstName: firstname,
            lastName: lastname,
            gender: gender,
          //  username: username,
            email: email,
            password: password
        });
        let res = await fetch('https://carbonfootprinting1608.herokuapp.com/user/register', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //const myJson = await res.json();
        const myJson = res.json();
        if (res.status == 200){
            //console.log('Success:', JSON.stringify(myJson));
            console.log("the status is "+res.status);
            alert('User Successfully Registered, Please proceed with login');
            window.location="https://carbonfootprinting1608.herokuapp.com";
        } else {
            console.log("the status is "+res.status);
            alert('User with this ID already exists, Please try different one');
        }
    }
    catch(error){
        console.log('inside register catch');
        alert('Unexpected error occurred ,Please try Again');
        console.error('Error:', error);
    }
}


async function login() {
    try{
        event.preventDefault();
        let email = document.getElementById("email_l").value;
        let password = document.getElementById("password_l").value;
        let data = JSON.stringify({
            email: email,
            password: password
        });
        await fetch('https://carbonfootprinting1608.herokuapp.com/user/login', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res=> {
            data = res.json();
            return data;
        })
            .then(res=>{
                user = res.user_obj;
                user_id=user._id;
                console.log(user);
                console.log(user_id);
                console.log(user.firstName);
                alert('Successfully Logged in');
                window.location="https://carbonfootprinting1608.herokuapp.com/success.html";
                localStorage.setItem("loggedInUser", user.firstName+" "+user.lastName);
                localStorage.setItem("gender",user.gender);
                return user;
            });
    }
    catch (error) {
        alert('No User Exists or Wrong Password,Please Try Again');
        console.error('Error:', error);
    }
}

// incomplete part
async function add_Expense(){
    try{
        let user_id = await fetchUserId();
        let HOST_URL='https://carbonfootprinting1608.herokuapp.com/user/add_expense/';
        let URL = HOST_URL+user_id;
        console.log(user_id);
        let category = document.getElementById('category').value;
        let expense = document.getElementById('expense').value;
        let description = document.getElementById('description').value;
        let today = new Date();
        let transaction_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        console.log('inside add_card',user_id);
        let data = JSON.stringify({
            category: category,
            expense: expense,
            description: description,
            transaction_date: transaction_date
        });
        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                alert(this.responseText);
                console.log(this.responseText);
            }
        });

        xhr.open("PUT", URL);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(data);


    }
    catch (error) {
        alert('Unexpected Error occurred,Please try again')
        console.error('Error:', error);
    }
}


async function fetch_expense(){
    let user_id = await fetchUserId();
    let HOST_URL ='https://carbonfootprinting1608.herokuapp.com/user/get_expense/';
    let URL = HOST_URL+user_id;
    console.log(URL);
    console.log(user_id);
    let data = '';
    let user_expense;
    let res = await fetch(URL)
        .then(res=>{
            data = res.json();
            return data;
        })
         .then(res=>{
             user = res.data;
             user_expense = user[0].transactions;
             return user_expense;
         })
    console.log('res is'+res);
    console.log('user expense is'+ user_expense);
    return res;
}

// async function update_details(){
//     console.log('Clicked');
//     try {
//         let card_number = document.getElementById('cardNumber').value;
//         let shopping_expense = document.getElementById('shoppingExpense').value;
//         let food_expense = document.getElementById('foodExpense').value;
//         let travel_expense = document.getElementById('travelExpense').value;
//         let data = JSON.stringify({
//             card_number: card_number,
//             shopping: shopping_expense,
//             food: food_expense,
//             travel: travel_expense
//         });
//
//         let user_id = await fetchUserId();
//         let HOST_URL='https://carbonfootprinting1608.herokuapp.com/user/update_card/';
//         let URL = HOST_URL+user_id;
//         let xhr = new XMLHttpRequest();
//
//         xhr.addEventListener("readystatechange", function () {
//             if (this.readyState === 4) {
//                 alert('Details Successfully Updated');
//                 console.log(this.responseText);
//             }
//         });
//         xhr.open("PUT", URL);
//         xhr.setRequestHeader("Content-Type", "application/json");
//         xhr.send(data);
//     }catch(error){
//         alert('Unexpected Error Occurred, Please try again');
//         console.error('Error:', error);
//     }
// }

let interestRate = (food,shopping,travel) => {
    let foodE = food*(105/100);
    let shoppingE = shopping*(112/100);
    let travelE = travel*(120/100);
    return (foodE+shoppingE+travelE);
}

let tree = (food,shopping,travel) => {
    let expense = food+shopping+travel;
    let no_of_tree = Math.ceil(expense/10000);
    return no_of_tree;
}

let createTaskCard = (user) => {
    let cardContainer = document.getElementById('card-container');
    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';
    card.style.width='450px';
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let title = document.createElement('h3');
    title.innerText = user.card_number;
    title.className = 'card-title';
    //title.style.fontSize='25px';

    let update_button = document.createElement('button')
    update_button.innerText = 'Update Transactions';
    update_button.setAttribute('onclick','update_details()');
    let shopping = document.createElement('h5');
    let food = document.createElement('h5');
    let travel = document.createElement('h5');
    let totalExpense = document.createElement('h5');
    let expenseInterest = document.createElement('h5');
    let no_of_tree = document.createElement('h5');
    food.innerText = "Food : "+user.food;
    shopping.innerText = "Shopping : "+user.shopping;
    travel.innerHTML = "Travel : "+user.travel;
    totalExpense.innerText = "Total Expenditure on card is : "+(user.food+user.shopping+user.travel);
    expenseInterest.innerText = "Total amount need to be paid is : "+interestRate(user.food,user.shopping,user.travel);
    no_of_tree.innerHTML = "Total trees need to be planted : "+tree(user.food,user.shopping,user.travel);
    cardBody.appendChild(title);
    cardBody.appendChild(shopping);
    cardBody.appendChild(food);
    cardBody.appendChild(travel);
    cardBody.appendChild(totalExpense);
    cardBody.appendChild(expenseInterest);
    cardBody.appendChild(no_of_tree);
    //cardBody.appendChild(update_button);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
}


async function fetch_total_expense(){
    let expenses = await fetch_expense();
    let travel_expense=0;
    let food_expense=0;
    let shopping_expense=0;
    let cash_expense=0;

    let travel = expenses.filter(travel => travel.category =='travel')
    for(let i=0;i<travel.length;i++){
        travel_expense=travel_expense+parseInt(travel[i].expense)
    }

    let food = expenses.filter(food => food.category =='food')
    for(let i=0;i<food.length;i++){
        food_expense=food_expense+parseInt(food[i].expense)
    }

    let shopping = expenses.filter(shopping => shopping.category =='shopping')
    for(let i=0;i<shopping.length;i++){
        shopping_expense=shopping_expense+parseInt(shopping[i].expense)
    }

    let cash = expenses.filter(cash => cash.category =='cash')
    for(let i=0;i<cash.length;i++){
        cash_expense=cash_expense+parseInt(cash[i].expense)
    }

    console.log(travel_expense);
    console.log(food_expense);
    console.log(cash_expense);
    console.log(shopping_expense);

}


async function display_custom_expense(){
    let expenses = await fetch_expense();
    console.log('length is ',expenses.length);
    let custom_expense;
    let category = document.getElementById("category_c").value;
    let start_date = new Date(document.getElementById("start_date").value);
    let end_date = new Date(document.getElementById("end_date").value);
    console.log('expense is '+expenses);
    console.log(start_date);
    console.log(end_date);
    if(expenses.length==0){
        alert('Sorry, you have no transaction with us');
    }else{
        custom_expense = expenses.filter((expense) =>
        {
            let demo_date = new Date(expense.transaction_date);
            return expense.category == category && demo_date.getTime() <= end_date.getTime() && demo_date.getTime() >= start_date.getTime();}
        );
        console.log(custom_expense);
    }
};


