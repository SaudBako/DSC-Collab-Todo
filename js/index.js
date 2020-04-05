$(document).ready(function() {    
  if (firebase.auth().currentUser)
    window.location = "app.html";

  // Toggles between forms
  $('.accountPrompt a').click(function() {
      $('form').each(function(i){
          var form = $(this);
  
          if (form.css('display') == "none") form.delay(400);
  
          form.animate({height:"toggle"}, 400);
      });
  });
  
  // Valudates the login form when submitted
  $('form[name=login]').submit(function(e) {
      e.preventDefault();
  }).validate({
      rules : {
          email: { required: true, email: true },
          password: { required: true }
      },
      messages: {
          email: 'ادخل بريد إلكتروني صحيح',
          password: 'ادخل كلمة مرور صحيحة'
      },
      submitHandler: function(form) {
        firebase.auth().signInWithEmailAndPassword(form.email.value, form.password.value)
            .then(function() { window.location = "app.html"; })
            .catch(function(error) { alert('معلومات الدخول غير صحيحة'); });
      }
  });
  
  // Validates the signup form when submitted
  $('form[name=signup]').submit(function(e) {
      e.preventDefault
  }).validate({
      rules : {
          email: { required: true, email: true },
          password: { required: true,  minlength: 6 },
          name: 'required'
      },
      messages: {
          email: 'ادخل بريد إلكتروني صحيح',
          password: 'ادخل كلمة مرور من 6 أحرف أو أكثر',
          name: "ادخل اسمك"
      },
      submitHandler: function(form) {
          var email = form.email.value;
          var password = form.password.value;
          var username = form.name.value;

          // Register the user
          firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (res) {
              // Add the username
              return res.user.updateProfile({ displayName: username });
            })
            .then(function() {
              // If there was not an error, proceed to app
              window.location = "app.html";
            })
            .catch(function(error) {
              // Otherwise alert the user
              if (error.code == 'auth/email-already-in-use') {
                alert('البريد الإكتروني مستخدم بالفعل');
              } else {
                  alert('واجهتنا مشكلة في انشاء حسابك '+error.message);
              }
              console.log(error);
            });
      }
  });
})
