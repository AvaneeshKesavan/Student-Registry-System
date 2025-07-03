$(document).ready(function() {
    // When the document is fully loaded, attach the submit event handler to the form

    $('#nameForm').on('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission behavior (page reload)

        const name = $('#name').val(); // Get the value entered in the name input field

        // Error handling: Display an error message if the name field is empty
        if (!name) {
            $('#responseMessage').html('<div class="alert alert-danger">Name is required.</div>'); // Display error alert
            return; // Stop the function execution
        }

        // Use AJAX to send a POST request to '/add-name' with the entered name
        $.ajax({
            type: 'POST', // HTTP method used
            url: '/add-name', // Endpoint to which the data will be sent
            data: { name: name }, // Data sent in the request, i.e., the name from the input field

            success: function() {
                // If the request is successful, show a success message
                $('#responseMessage').html('<div class="alert alert-success">Name added successfully!</div>');
                $('#name').val(''); // Clear the input field after successful submission
            },
            error: function(xhr) {
                // If the request fails, display an error message with the server's response
                $('#responseMessage').html('<div class="alert alert-danger">' + xhr.responseText + '</div>');
            }
        });
    });
});
