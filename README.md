# linkedtreeanddynamiccol
## NodeJs linked tree management and dynamically control mongodb document.

### Tree Manager Node Linked Tree
 
This module is a web based application that allows the user to view an existing, initially empty, tree and add nodes to it. Tree nodes should be stored in the database. Thus, your program should be able to read them from the database to display the tree, and add new nodes to the tree upon user request. Each node should be identified by a unique node ID and have a parent P.
Please consult the following UI sketch. (Feel free to make improvements.)
Typing in parent node ID in “PID” box and clicking “Add” button should add a new node to thenode with that ID or produce and an error message in case invalid node ID is entered. Error message should be displayed immediately above “Add” button. User should also be able to remove any of node - in that case all the children should be moved to removed node’s parent.
Minimise the traffic between client and server (use AJAX for data exchange) and optimise algorithms for effectivity.

### Dynamic SQL Management with MongoDb

Using your preferred programming language and SQL database create model with one static property (identifier) and possibility to add / remove another dynamic properties. Model should have implemented basic methods like store to database and load from database by any property, condition (eg. like, <, =, >, …) and its value. Database storage should respect property’s datatypes and have appropriate indexes.
Create simple UI with following options:
list displaying existing records stored in db
elements for adding new and removing existing record
inputs and elements to add / remove properties of existing record
search by property name, condition and value
Feel free to show all your additional powers:JavaScript/ AJAX, CSS, HTML

## How to install

Clone this repository into your localhost server. You need nodejs, mongodb to be installed [you can take help from https://tecadmin.net/setup-nodejs-with-mongodb-on-ubuntu/]
Then run ```npm install``` from the folder itself.

Start node server by ```npm start```

Check at browser by http://localhost:3000

If any question kindly contact me. Thanks
