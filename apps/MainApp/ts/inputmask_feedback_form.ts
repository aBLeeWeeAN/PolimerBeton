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

// $(document).ready(function() {
//     // Применение маски для номера телефона
//     $("#client_phone").inputmask("+7 (999) 999-99-99");

//     // Применение маски для имени (только буквы)
//     $("#client_name").inputmask({
//         mask: "A{1,35}",
//         definitions: {
//             'A': {
//                 validator: "[A-Za-zА-Яа-я]",
//                 cardinality: 1
//             }
//         },
//         placeholder: ""
//     });

//     // Приведение первой буквы к заглавной при потере фокуса
//     $('#client_name').on('blur', function() {
//         let value = $(this).val();
//         if (value) {
//             $(this).val(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
//         }
//     });

//     // Обработчик для замены 8 на +7
//     function replaceEightWithPlusSeven() {
//         let value = $("#client_phone").val();
//         if (value.startsWith('8')) {
//             $("#client_phone").val('+7' + value.substring(1));
//         }
//     }

//     // Отслеживаем изменения с помощью MutationObserver
//     const observer = new MutationObserver(function(mutations) {
//         mutations.forEach(function(mutation) {
//             if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
//                 replaceEightWithPlusSeven();
//             }
//         });
//     });

//     // Настроить наблюдатель на поле ввода
//     const targetNode = document.getElementById('client_phone');
//     observer.observe(targetNode, { attributes: true });

//     // Также применим функцию при изменении и потере фокуса
//     $('#client_phone').on('input change blur', function() {
//         replaceEightWithPlusSeven();
//     });
// });