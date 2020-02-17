


function add_Card_validation() {
    let card_number = document.forms["add_card_form"]["cardNumber"];
    let CVV = document.forms["add_card_form"]["CVV"];
    let expiryYear = document.forms["add_card_form"]["expiryYear"];

    if (card_number.value.length != 16)
    {
        window.alert("Please enter valid card Number");
        card_number.focus();
        return false;
    }

    if (CVV.value.length != 3)
    {
        window.alert("Please enter valid CVV");
        CVV.focus();
        return false;
    }

    if (expiryYear.value.length != 4)
    {
        window.alert("Please enter valid year");
        expiryYear.focus();
        return false;
    }



     return (add_Card()
        .then(() => {
            console.log('success');
        }));
}