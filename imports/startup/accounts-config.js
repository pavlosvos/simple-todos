
// Then, in your JavaScript, add the following code to configure the accounts UI to use usernames instead of email addresses:

import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});