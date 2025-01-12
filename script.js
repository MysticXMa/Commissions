function openForm(tier) {
    document.getElementById('form-title').innerText = `Order Form for ${tier}`;

    document.getElementById('selected-pack').value = tier;

    document.querySelector('.form-container').style.display = 'block';

    window.scrollTo({
        top: document.querySelector('.form-container').offsetTop,
        behavior: 'smooth'
    });
}

function toggleClothingOptions() {
    const style = document.getElementById('style').value;
    const clothingOptions = document.getElementById('clothing-options');
    if (style === "protogen") {
        clothingOptions.style.display = "block";
    } else {
        clothingOptions.style.display = "none";
    }
}

function submitForm(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('order-form'));

    fetch('https://your-server-endpoint.com/submit-form', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            alert("Your order has been submitted!");
            document.getElementById('order-form').reset();
            document.querySelector('.form-container').style.display = 'none';
        })
        .catch(error => {
            alert("Error submitting form. Please try again later.");
            console.error('Error:', error);
        });
}