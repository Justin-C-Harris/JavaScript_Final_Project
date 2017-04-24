$(document).ready(function() {
    // Create all the variables
    var heads = ["Select Pizza Size:", "Select Meats: (+$1.00 each additional meat items beyond the first complementary meat item.)"
        , "Select Cheese:", "Select Crust:", "Select Sauce:", "Select Veggies: (+$1.00 each additional veggie items beyond the first complementary veggie item.)"];
    var pSize = [{"Personal": "6.00"}, {"Medium": "10.00"}, {"Large": "14.00"}, {"Extra Large": "16.00"}];
    var pMeat = [{"Pepperoni": "1.00"}, {"Sausage": "1.00"}, {"Canadian Bacon": "1.00"}, {"Ground Beef": "1.00"}, {"Anchovy": "1.00"}, {"Chicken": "1.00"}];
    var pCheese = [{"Regular": "0.00"}, {"No cheese": "0.00"}, {"Extra Cheese": "3.00"}];
    var pCrust = [{"Plain Crust": "0.00"}, {"Garlic Butter Crust": "0.00"}, {"Cheese Stuffed Crust": "3.00"}, {"Spicy Crust": "0.00"}, {"House Special Crust": "0.00"}];
    var pSauce = [{"Marinara sauce": "0.00"}, {"White sauce": "0.00"}, {"Barbeque sauce": "0.00"}, {"No Sauce": "0.00"}];
    var pVeggie = [{"Tomatoes": "1.00"}, {"Onions": "1.00"}, {"Olives": "1.00"}, {"Green Peppers": "1.00"}, {"Mushrooms": "1.00"}, {"Pineapple": "1.00"}, 
        {"Spinach": "1.00"}, {"Jalapeno": "1.00"}];
    var table = ""; // This is the table that will hold the receipt that will be inserted after the place order button

    //Create all the headings for the menu
    for (var i = 0; i < heads.length; i += 1) {
        $('form').append('<h4>'+ heads[i] + '</h4>');
    }

    //Build all the html that goes under each heading
    singleFormGroup(heads[0], pSize, "radio", "pizzaSize");
    multipleFormGroup(heads[1], pMeat, "checkbox", "pizzaMeat");
    singleFormGroup(heads[2], pCheese, "radio", "pizzaCheese");
    singleFormGroup(heads[3], pCrust, "radio", "pizzaCrust");
    singleFormGroup(heads[4], pSauce, "radio", "pizzaSauce");
    multipleFormGroup(heads[5], pVeggie, "checkbox", "pizzaVeggie");

    //Build and append the button that will be used to calculate the total and return the receipt.
    $('form').append('<button id="orderPizza" z-index="0" type="button" class="btn btn-primary">Place Order</button>')

    //Automatically select options for testing purposes.
    //$('label:contains("$1.00"), label:contains("3.00"), label:contains("Marinara"), label:contains("$14.00")').click();
    
    //The order button click event that will calculate the proper total and return the receipt with the breakdown of the total.
    $("#orderPizza").click(function() {
        var totalsArray = [selectOne("pizzaSize", "Pizza Size:"), extraToppings("pizzaMeat", "Pizza Meats:"), selectOne("pizzaCheese", "Pizza Cheese:")
            , selectOne("pizzaCrust", "Pizza Crust:"), selectOne("pizzaSauce", "Pizza Sauce:"), extraToppings("pizzaVeggie", "Pizza Veggies:")];
        var tableRows = "";
        for (var i = 0; i < totalsArray.length; i += 1) { //Building the table rows that will be shown in the receipt
            if (tableRows === "") {
                tableRows = '<tr><td>' + totalsArray[i].kind + " " + totalsArray[i].list + '</td><td>$' + totalsArray[i].price.toFixed(2) + '</td></tr>';
            } else {
                tableRows = tableRows + '\n<tr><td>' + totalsArray[i].kind + " " + totalsArray[i].list + '</td><td>$' + totalsArray[i].price.toFixed(2) + '</td></tr>';
            };
        };

        //Calculate total and place in in table rows
        var totalPrice = 0;
        for (var i = 0; i < totalsArray.length; i += 1) {
            totalPrice += parseInt(totalsArray[i].price)
        };
        tableRows = tableRows + '\n<tr><td><b>TOTAL PRICE:</b></td><td>$' + totalPrice.toFixed(2) + '</td></tr>';

        //Add a table header to the front of the tableRows
        tableRows = '<thead><tr><th>Category:</th><th>Price:</th></tr></thead>\n' + tableRows;

        table = '<table class="table table-border table-condensed">' + tableRows + '</table>'; //Final receipt table that will be placed after the form
        $('table').remove();
        $('button').after('<br /> <br /> <h3> Your Receipt is Below:</h3>' + table);
    });

    //Create the select one function that returns the calculated price and name of the selection
    function selectOne(pName, pKind) {
        var price = 0;
        var list = "";
        $('[name="' + pName + '"]:radio:checked').each(function() {
            price += parseInt(this.value);
            var replaceString = $(this).parent().text().replace(/^(.*)\s\(.*$/i, "$1");
            if (list === "") {
                list = replaceString;
            } else {
                list += ', ' + replaceString;
            }
        });
        var obj = {
            "kind": pKind,
            "price": price,
            "list": list
        };
        return obj
    };

    //Create the extra toppings function to calculate the cost of and collect the topping names selected
    function extraToppings(pName, pKind) {
        var price = 0;
        var list = "";
        $('[name="' + pName + '"]:checkbox:checked').each(function() {
            price += parseInt(this.value);
            var replaceString = $(this).parent().text().replace(/^(.*)\s\(.*$/i, "$1");
            if (list === "") {
                list = replaceString;
            } else {
                list += ', ' + replaceString;
            }
        });
        if (price > 0) {
            price -= 1;
        } else {
            price = 0;
        }
        var obj = {
            "kind": pKind,
            "price": price,
            "list": list
        };
        return obj
    };

    //Create the single form Group Function to build the html
    function singleFormGroup(pSelect, pArray, pType, pName) {
        $('h4:contains("'+ pSelect + '")').after('<div class="form-group"></div>');    
        for (var i = 0; i < pArray.length; i += 1) {
            $('h4:contains("'+ pSelect + '")').next().append('<label class="' + pType + '-inline"><input name="' + pName + '" type="' + pType + '" value="'
                + pArray[i][Object.keys(pArray[i])[0]] + '">'+ Object.keys(pArray[i])[0] + ' ($' + pArray[i][Object.keys(pArray[i])[0]] + ')</label>');
        };
    };

    //Create the multiple form Group Function to build html
    function multipleFormGroup(pSelect, pArray, pType, pName) {
        $('h4:contains("'+ pSelect + '")').after('<div class="form-group"></div>');    
        for (var i = 0; i < pArray.length; i += 1) {
            $('h4:contains("'+ pSelect + '")').next().append('<label class="' + pType + '-inline"><input name="' + pName + '" type="' + pType + '" value="'
                + pArray[i][Object.keys(pArray[i])[0]] + '">'+ Object.keys(pArray[i])[0] + ' ($' + pArray[i][Object.keys(pArray[i])[0]] + ')</label>');
        };
    };
});