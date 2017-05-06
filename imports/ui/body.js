import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
 
import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';
 

 // Then we need to set up a new ReactiveDict and attach it to the body template instance (as this is where we'll store the checkbox's state) when it is first created:
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {

    //Now, we need to update Template.body.helpers. The code below has a new if block to filter the tasks if the checkbox is checked:
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  // One more feature: Showing a count of incomplete tasks
  // Now that we have written a query that filters out completed tasks, we can use the same query to display a count of the tasks that haven't been checked off. To do this we need to add a helper and change one line of the HTML.
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a task into the collection
    // Tasks.insert({
    //   text,
    //   createdAt: new Date(), 
    //   owner: Meteor.userId(),
    //   username: Meteor.user().username,
    // });

     // Insert a task into the collection
    Meteor.call('tasks.insert', text);
    
    // Clear form
    target.text.value = '';
  },

  // Then, we need an event handler to update the ReactiveDict variable when the checkbox is checked or unchecked. An event handler takes two arguments, the second of which is the same template instance which was this in the onCreated callback:
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },

});
