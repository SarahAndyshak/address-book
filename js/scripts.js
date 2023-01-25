// Business Logic for AddressBook ---------
function AddressBook() {
  this.contacts = {};
  this.currentId = 0;
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId();
  this.contacts[contact.id] = contact;
};

AddressBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
};

AddressBook.prototype.findContact = function(id) {
  if (this.contacts[id] !== undefined) { // "id" related back to line 9 in .addContact
    return this.contacts[id];
  }
  return false;
};

AddressBook.prototype.deleteContact = function(id) {
  if (this.contacts[id] === undefined) {
    return false;
  }
  delete this.contacts[id];
  return true;
};

// Business Logic for Contacts ---------
function Contact(firstName, lastName, phoneNumber, emailAddress, homeAddress) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phoneNumber = phoneNumber;
  this.emailAddress = emailAddress;
  //this.workEmail = workEmail;
  this.homeAddress = homeAddress;
}

//This is where we were trying to figure out nesting objects

// function EmailAddress(homeEmail, workEmail) {
//   this.homeEmail = homeEmail;
//   this.workEmail = workEmail;
// }

// function Address(homeAddress, workAddress) {
//   this.homeAddress = homeAddress;
//   this.workAddress = workAddress;
// }
//OBJECT KEYS ARE ABOVE!!

Contact.prototype.fullName = function() {
  return this.firstName + " " + this.lastName;
};

// Contact.prototype.update = function() {
//   this.contact.phoneNumber.replace("");
//   return this.contact.phoneNumber;
// };

// User Interface Logic ---------
let addressBook = new AddressBook(); //creating a nickname for a new AddressBook object

// adding this function to keep up separation of concerns. This will make a UI list function to display the objects we've taken in.
function listContacts(addressBookToDisplay) {
  let contactsDiv = document.querySelector("div#contacts");
  contactsDiv.innerText =  null;
  const ul = document.createElement("ul");
  Object.keys(addressBookToDisplay.contacts).forEach(function(key) {
    const contact = addressBookToDisplay.findContact(key);
    const li = document.createElement("li");
    li.append(contact.fullName());
    li.setAttribute("id", contact.id);
    ul.append(li);
  });
  contactsDiv.append(ul);
}
// example: contactsDiv.append(ul) is our single hit to the DOM *which is most EFFICIENT* as opposed to having it say something like: contactsList.append(li)

// this function will allow clicking on the name to show information in the console
function displayContactDetails(event) {
  const contact = addressBook.findContact(event.target.id); //adding our .findContact()method from our Business Logic we're cheating a bit b/c addressBook is global, which is standing in for a database
  // .class-name #id-name . calls from class-name, # calls from id-name
  document.querySelector(".first-name").innerText = contact.firstName;
  document.querySelector(".last-name").innerText = contact.lastName;
  document.querySelector(".phone-number").innerText = contact.phoneNumber;
  document.querySelector(".email-address").innerText = contact.emailAddress;
  document.querySelector(".home-address").innerText = contact.homeAddress;
  document.querySelector("div#contact-details").removeAttribute("class");
  // console.log("The id of this <li> is " + event.target.id + "."); --this console.log was the first line of code we added to this function from the lesson plan

  // The line below this one is new to help with "delete functionality". our button will need access to the id of the current contact that's being displayed. The displayContactDetails() function already has access to the Contact object's details, so let's update that function to also update our new delete button with an id attribute set to the id of the contact.
  document.querySelector("button.delete").setAttribute("id", contact.id);
  //we are accessing our delete button in the html and then giving it an id attribute (because in the HTML it is only assigned a class attribute)set to the Contact object's id set in the javascript. 
  document.querySelector("div#contact-details").removeAttribute("class");
  //our CSS class is "hidden" which we already created, and that's why the delete works, because it "hides" our info like it's supposed to.
}


function handleDelete(event) {
  addressBook.deleteContact(event.target.id);//addressBook is a global variable, we can call on it from within the handleDelete() function. Remember that we're using the global addressBook variable as a mock database 
  document.querySelector("button.delete").removeAttribute("id");//we remove the id attribute from the delete button, thereby resetting it.
  document.querySelector("div#contact-details").setAttribute("class", "hidden");//we are hiding the contact details div once more.
  listContacts(addressBook);//Finally, we call the listContacts function again to refresh the list of contacts, this time without the contact that we've deleted.
}

function handleFormSubmission(event) {
  event.preventDefault();
  const inputtedFirstName = document.querySelector("input#new-first-name").value;
  const inputtedLastName = document.querySelector("input#new-last-name").value;
  const inputtedPhoneNumber = document.querySelector("input#new-phone-number").value;
  const inputtedEmailAddress = document.querySelector("input#new-email-address").value;
  const inputtedAddress = document.querySelector("input#new-home-address").value;
  let newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber, inputtedEmailAddress, inputtedAddress);
  addressBook.addContact(newContact);
  listContacts(addressBook);  // <--- This is the newer line where we call the listContacts() function and replaced our console.log *shows the full names, but not the phone number*

  document.querySelector("input#new-first-name").value = null;
  document.querySelector("input#new-last-name").value = null;
  document.querySelector("input#new-phone-number").value = null;
  document.querySelector("input#new-email-address").value = null;
  document.querySelector("input#new-home-address").value = null;

  //code from the lines above are to empty out our form fields after submission.
}


//event listeners actually call the functions to make them happen (ex. handleFormSubmission and displayContactDetails)
//function() is a stand-in for the specific function listed below, and "submit", "click" etc are the events tied to the specific functions
window.addEventListener("load", function() { 
  document.querySelector("form#new-contact").addEventListener("submit", handleFormSubmission);
  // The line below this one is new and is related to our function displayContactDetails()
  document.querySelector("div#contacts").addEventListener("click", displayContactDetails); 
  // The line below this one is new and made according to page 20 "delete functionality"
  document.querySelector("button.delete").addEventListener("click", handleDelete);
});