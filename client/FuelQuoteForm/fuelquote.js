const gallonsInput = document.getElementById('gallons_requested');
const gallonsError = document.getElementById('gallons_error');

gallonsInput.addEventListener('input', function() {
    const value = gallonsInput.value;
    if (!isNumeric(value)) {
        gallonsError.style.display = 'block';
    } else {
        gallonsError.style.display = 'none';
    }
});

function isNumeric(value) {
    return /^\d+$/.test(value);
}