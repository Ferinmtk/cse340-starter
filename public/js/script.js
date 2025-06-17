// register form 

// Password visibility toggle
document.addEventListener("DOMContentLoaded", function() {
  const passwordInput = document.getElementById('password')
  const showPasswordToggle = document.getElementById('showPassword')
  
  if (passwordInput && showPasswordToggle) {
    showPasswordToggle.addEventListener('click', function(e) {
      e.preventDefault() // Prevent any default behavior
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text'
        showPasswordToggle.textContent = 'Hide'
      } else {
        passwordInput.type = 'password' 
        showPasswordToggle.textContent = 'Show'
      }
    })
  }

  // Form change detection for account update
  const updateForm = document.getElementById("updateAccountForm")
  if (updateForm) {
    const originalData = {
      firstname: updateForm.account_firstname.value,
      lastname: updateForm.account_lastname.value,
      email: updateForm.account_email.value
    }

    updateForm.addEventListener("submit", function(e) {
      if (updateForm.account_firstname.value === originalData.firstname &&
          updateForm.account_lastname.value === originalData.lastname &&
          updateForm.account_email.value === originalData.email) {
        e.preventDefault()
        alert("No changes detected. Please modify the data before submitting.")
      }
    })
  }
})
