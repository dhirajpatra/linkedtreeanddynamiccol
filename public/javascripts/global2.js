// TreeList data array for filling in info box
var treeListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    // populate node tree
    populateTreeTable();

});

//=============== Node Tree Functions ===================//

// Fill table with data
function populateTreeTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/trees/nodelist', function( data ) {
        console.log(data);
        // Stick our user data array into a userlist variable in the global object
        treeListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.id + '</td>';
            tableContent += '<td>' + this.parent + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#treeList table tbody').html(tableContent);
    });
};

// add a node
function addNode(event)
{
    // Prevent Link from Firing
    event.preventDefault();

    var nodeParentId = $('#addNode input#inputParentId').val();

    // update document
    $.ajax({
        type: 'POST',
        data: {'parentId': nodeParentId},
        url: '/trees/addnode',
        dataType: 'JSON'
    }).done(function( response ) {

        // Check for successful (blank) response
        if (response.msg == '') {
            // Update the table
            $('#addNode div#inputParentIdErrMsg').html('Wrong parent id');
            setTimeout(function () {
                location.reload();
            }, 3000);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            $('#addNode div#inputParentIdErrMsg').html('Node added successfully');
            setTimeout(function () {
                location.reload();
            }, 3000);
        }
    });

}


//=============== Node Tree ====================//
// node link click
//$('#treeList table tbody').on('click', 'td a.linkshownode', showNodeInfo);

// Add node button click
$('#btnAddNode').on('click', addNode);
