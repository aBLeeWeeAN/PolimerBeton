import { MaskedTextChangedListener } from "ts-input-mask";

// --- Телефон ---
const phoneInput = document.getElementById("client_phone") as HTMLInputElement | null;

if (phoneInput) {
    const phoneFormat = "+7 ([000]) [000]-[00]-[00]";

    // Устанавливаем placeholder через HTML атрибут
    phoneInput.placeholder = "+7 (___) ___-__-__";

    MaskedTextChangedListener.installOn(
        phoneFormat,
        phoneInput,
        new (class implements MaskedTextChangedListener.ValueListener {
            onTextChanged(maskFilled: boolean, extractedValue: string, formattedText: string): void {
                // console.log(maskFilled, extractedValue, formattedText);
            }
        })(),
        undefined, // affineFormats
        undefined, // customNotations
        undefined, // affinityCalculationStrategy
        true // autocomplete
    );
}

// --- Имя ---
const nameInput = document.getElementById("client_name") as HTMLInputElement | null;

if (nameInput) {
    // Маска для имени: только буквы, до 35 символов
    // ts-input-mask не поддерживает кастомные regex в нативной маске, поэтому используем обработчик blur
    nameInput.addEventListener("blur", () => {
        const value = nameInput.value;
        if (value) {
            // Первая буква заглавная, остальные маленькие
            nameInput.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    });

    // Можно добавить слушатель на ввод для фильтрации не-букв, если хочется:
    nameInput.addEventListener("input", () => {
        nameInput.value = nameInput.value.replace(/[^A-Za-zА-Яа-я]/g, "");
        if (nameInput.value.length > 35) {
            nameInput.value = nameInput.value.slice(0, 35);
        }
    });
}

export {};
