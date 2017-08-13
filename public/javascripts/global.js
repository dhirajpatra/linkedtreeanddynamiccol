// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// delete a property row
function deleteRow(event)
{
    // Prevent Link from Firing
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure to delete this property/field?');

    if(confirmation === true){
        var details = $(this).attr('rel').split('##');
        var userId = details[1];
        var field = details[2];

        //alert(details[1]);
        var i = details[0];
        //var i = row.parentNode.parentNode.rowIndex;
        document.getElementById('tableUserEdit').deleteRow(i);

        // update document
        $.ajax({
            type: 'POST',
            data: {'id': userId, 'field': field},
            url: '/users/deleteproperty',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                // Update the table
                //alert(response);
                alert('Property deleted');
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
}

// delete a property from all records dynamically
function deleteProperty(event)
{
    // Prevent Link from Firing
    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure to delete this property/field from table?');

    if(confirmation === true){
        var field = $(this).attr('rel');

        // update document
        $.ajax({
            type: 'POST',
            data: {'field': field},
            url: '/users/deletepropertyfortable',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                // Update the table
                //alert(response);
                alert('Property/key deleted from document/table');
                location.reload();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
}

// add a property from all records dynamically
function addProperty(event)
{
    // Prevent Link from Firing
    event.preventDefault();

    var newField = $('#userEdit input#newFieldUserEdit').val();
    var newFieldValue = $('#userEdit input#newFieldValueUserEdit').val();

    // update document
    $.ajax({
        type: 'POST',
        data: {'field': newField, 'fieldValue': newFieldValue},
        url: '/users/addpropertyfortable',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
            // Update the table
            //alert(response);
            alert('Property/key added for document/table');
            location.reload();
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });

}


// Fill table with data
function populateEditTable(data) {

    // Empty content string
    var tableContent = '';
    var userId = data._id;
    var i = 1;

    // For each item in our JSON, add a table row and cells to the content string
    for(var attributename in data){
        if(attributename == '_id'){
            tableContent += '<tr>';
            tableContent += '<td>'+ attributename +'</td><td>' + data[attributename] + '</td><td></td><td></td>';
            tableContent += '</tr>';
        } else{
            tableContent += '<tr>';
            tableContent += '<td>'+ attributename +'</td><td>' + data[attributename] + '</td><td><a href="#" class="linkdeleteproperty" rel="' + i + '##' + userId + '##' + attributename + '">Delete Property + Value</a></td><td><a href="#" class="linkdeletepropertyforall" rel="' + attributename + '">Delete Property For Whole Document</a></td>';
            tableContent += '</tr>';
        }
        i++;
    }

    tableContent += '<tr><td><input type="text" class="newFieldUserEdit" id="newFieldUserEdit" name="newFieldUserEdit" placeholder="enter new field/property name" value=""/></td><td><input type="text" class="newFieldValueUserEdit" id="newFieldValueUserEdit" name="newFieldValueUserEdit" placeholder="enter new field/property value" value=""/></td><td><a href="#" class="linkupdateproperty" rel="' + userId + '##' + i + '">Add New Property</a></td><td><a href="#" class="linkupdatepropertyforall" rel="">Add New Property For Whole Document</a></td></tr>';

    // Inject the whole content string into our existing HTML table
    $('#userEdit table tbody').html(tableContent);

};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    var details = '';
    for (var property in thisUserObject) {
        if (thisUserObject.hasOwnProperty(property)) {
            details += property + ' : ' + thisUserObject[property] + "\r\n";
        }
    }

    //Populate Info Box
    $('#userInfoDetails').html(details);
    /*$('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);*/

};

// Edit User Info including add / remove property/field
function editUser(event) {

    // Prevent Link from Firing
    event.preventDefault();

    var userId = $(this).attr('rel');

        // If they did, do our delete
    $.ajax({
        type: 'GET',
        url: '/users/edituser/' + userId,
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {

            // Update the table
            populateEditTable(response.data);

        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });

};

// update existing user data after delete that property
function updateUser(event) {
    event.preventDefault();

    var userId = $(this).attr('rel').split('##');
    userId = userId[0];
    var i = userId[1];
    //alert(details);
    var newField = $('#userEdit input#newFieldUserEdit').val();
    var newFieldValue = $('#userEdit input#newFieldValueUserEdit').val();

    // update document
    $.ajax({
        type: 'POST',
        data: {'id': userId, 'field': newField, 'fieldValue': newFieldValue},
        url: '/users/addproperty',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg === '') {
            // Update the table
            //alert(response);
            var tableContent = '<tr>';
            tableContent += '<td>'+ newField +'</td><td>' + newFieldValue + '</td><td><a href="#" class="linkdeleteproperty" rel="' + i + '##' + userId + '##' + newField + '">Delete Property + Value</a></td>';
            tableContent += '</tr>';
            var previous = $('#userEdit table tbody').html();
            $('#userEdit table tbody').html(previous + tableContent);

        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);

        }
    });
}

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    /*$('#addUser input').each(function(index, val) {
        if($(this).index != 'inputUserNewField' || $(this).index != 'inputUserNewField') {
            if($(this).val() === '') { errorCount++; }
        }
    });*/

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        var newField = $('#addUser fieldset input#inputUserNewField').val();
        var newFieldValue = $('#addUser fieldset input#inputUserNewFieldValue').val();

        // If it is, compile all user info into one object
        if(newField != null && newFieldValue != null){
            var newUser = {
                'username': $('#addUser fieldset input#inputUserName').val(),
                'email': $('#addUser fieldset input#inputUserEmail').val(),
                'fullname': $('#addUser fieldset input#inputUserFullname').val(),
                'age': $('#addUser fieldset input#inputUserAge').val(),
                'location': $('#addUser fieldset input#inputUserLocation').val(),
                'gender': $('#addUser fieldset input#inputUserGender').val(),
                 [newField]: newFieldValue
            }
        } else {
            var newUser = {
                'username': $('#addUser fieldset input#inputUserName').val(),
                'email': $('#addUser fieldset input#inputUserEmail').val(),
                'fullname': $('#addUser fieldset input#inputUserFullname').val(),
                'age': $('#addUser fieldset input#inputUserAge').val(),
                'location': $('#addUser fieldset input#inputUserLocation').val(),
                'gender': $('#addUser fieldset input#inputUserGender').val()
            }
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Search User
function searchUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#userSearch input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
     });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
        var fieldName = $('#userSearch fieldset input#inputSearchField').val();
        var fieldValue = $('#userSearch fieldset input#inputSearchValue').val();
        var condition = $('#userSearch fieldset select#inputSearchCondition').val();

        var details = {
            'fieldName': fieldName,
            'fieldValue': fieldValue,
            'condition': condition
        };

        // Use AJAX to search user service
        $.ajax({
            type: 'POST',
            data: details,
            url: '/users/searchuser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response != null) { 

                // Clear the form inputs
                $('#userSearch fieldset input').val('');

                // Update the table
                if(response.data.length > 0){
                    var result = '';
                    response.data.forEach(function (row, index) {
                        result += row._id + ' - ' + row.username + ' - ' + row.email + ' - ' + row.fullname + ' - ' + row.age + ' - ' + row.location + ' - ' + row.gender + "\r\n\n";
                    });
                    $('#userInfoDetails').html(result);
                }


            }
            else { 

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Username link click
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

// Add User button click
$('#btnAddUser').on('click', addUser);

// Delete User link click
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

// Edit User link click
$('#userList table tbody').on('click', 'td a.linkedituser', editUser);

// delete property row
$('#userEdit table tbody').on('click', 'td a.linkdeleteproperty', deleteRow);

// delete property row
$('#userEdit table tbody').on('click', 'td a.linkupdateproperty', updateUser);

// delete property from table itself
$('#userEdit table tbody').on('click', 'td a.linkdeletepropertyforall', deleteProperty);

// add property for table itself
$('#userEdit table tbody').on('click', 'td a.linkupdatepropertyforall', addProperty);

// Search User button click
$('#btnSearchUser').on('click', searchUser);

// Update User button click
//$('#btnUpdateUser').on('click', updateUser);
