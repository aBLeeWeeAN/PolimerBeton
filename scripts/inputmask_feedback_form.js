$(document).ready(function(){
    // Применение маски для номера телефона
    $("#client_phone").inputmask("+7 (999) 999-99-99");

    // Применение маски для имени (только буквы)
    $("#client_name").inputmask({
        mask: "A{1,35}",
        definitions: {
            'A': {
                validator: "[A-Za-zА-Яа-я]",
                cardinality: 1
            }
        },
        placeholder: ""
    });
});

// Приведение первой буквы к заглавной при потере фокуса
$('#client_name').on('blur', function() {
    let value = $(this).val();
    if (value) {
        $(this).val(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
    }
});