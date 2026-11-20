
// Get HTML Elements

const expressionDisplay = document.getElementById("expression");

const resultDisplay = document.getElementById("result");

const buttons = document.querySelector(".buttons");


// Store User Expression

let expression = "";


// Update Calculator Display

function updateDisplay() {

    expressionDisplay.textContent = expression || "0";

    if (expression === "") {

        resultDisplay.textContent = "0";

        return;

    }

    try {

        const answer = calculateExpression(expression);

        resultDisplay.textContent = formatResult(answer);

    } catch (error) {

        resultDisplay.textContent =
            error.message === "Division by zero"
                ? "Cannot divide by zero"
                : "—";

    }

}


// Format Result

function formatResult(value) {

    return String(Number(value.toPrecision(12)));

}


// Calculate Mathematical Expression

function calculateExpression(input) {

    let position = 0;


    // Skip Spaces

    function skipSpaces() {

        while (input[position] === " ") {

            position++;

        }

    }


    // Read Number

    function readNumber() {

        skipSpaces();

        let start = position;

        let decimalCount = 0;

        while (
            position < input.length &&
            (
                (input[position] >= "0" &&
                 input[position] <= "9") ||
                input[position] === "."
            )
        ) {

            if (input[position] === ".") {

                decimalCount++;

                if (decimalCount > 1) {

                    throw new Error("Invalid number");

                }

            }

            position++;

        }

        const number = Number(input.slice(start, position));

        if (start === position || !Number.isFinite(number)) {

            throw new Error("Invalid expression");

        }

        return number;

    }


    // Handle Positive and Negative Numbers

    function factor() {

        skipSpaces();

        if (input[position] === "+") {

            position++;

            return factor();

        }

        if (input[position] === "-") {

            position++;

            return -factor();

        }

        return readNumber();

    }


    // Multiplication and Division

    function term() {

        let value = factor();

        while (true) {

            skipSpaces();

            const operator = input[position];

            if (operator !== "*" && operator !== "/") {

                break;

            }

            position++;

            const nextValue = factor();

            if (operator === "*") {

                value *= nextValue;

            } else {

                if (nextValue === 0) {

                    throw new Error("Division by zero");

                }

                value /= nextValue;

            }

        }

        return value;

    }


    // Addition and Subtraction

    function expressionValue() {

        let value = term();

        while (true) {

            skipSpaces();

            const operator = input[position];

            if (operator !== "+" && operator !== "-") {

                break;

            }

            position++;

            const nextValue = term();

            if (operator === "+") {

                value += nextValue;

            } else {

                value -= nextValue;

            }

        }

        return value;

    }


    const answer = expressionValue();

    skipSpaces();

    if (position !== input.length || !Number.isFinite(answer)) {

        throw new Error("Invalid expression");

    }

    return answer;

}


// Add Values to Expression

function addValue(value) {

    const lastCharacter = expression.slice(-1);

    const operators = ["+", "-", "*", "/"];


    if (operators.includes(value)) {

        if (expression === "") {

            if (value === "-") {

                expression = "-";

            } else {

                return;

            }

        } else if (operators.includes(lastCharacter)) {

            if (value === "-" && lastCharacter !== "-") {

                expression += value;

            } else if (expression.length > 1) {

                expression = expression.slice(0, -1) + value;

            }

        } else {

            expression += value;

        }

    } else if (value === ".") {

        const currentNumber = expression.split(/[+\-*/]/).pop();

        if (currentNumber.includes(".")) {

            return;

        }

        if (currentNumber === "") {

            expression += "0.";

        } else {

            expression += ".";

        }

    } else {

        expression += value;

    }

    updateDisplay();

}


// Clear Calculator

function clearCalculator() {

    expression = "";

    updateDisplay();

}


// Delete Last Character

function deleteLast() {

    expression = expression.slice(0, -1);

    updateDisplay();

}


// Calculate Final Result

function calculateResult() {

    if (expression === "") {

        return;

    }

    try {

        const answer = calculateExpression(expression);

        expression = formatResult(answer);

        updateDisplay();

    } catch (error) {

        resultDisplay.textContent =
            error.message === "Division by zero"
                ? "Cannot divide by zero"
                : "Invalid Expression";

    }

}


// Handle Button Clicks

buttons.addEventListener("click", (event) => {

    const button = event.target.closest("button");

    if (!button) {

        return;

    }

    const value = button.dataset.value;

    const action = button.dataset.action;


    if (action === "clear") {

        clearCalculator();

    } else if (action === "delete") {

        deleteLast();

    } else if (action === "calculate") {

        calculateResult();

    } else if (value !== undefined) {

        addValue(value);

    }

});


// Keyboard Support

document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (/^[0-9]$/.test(key)) {

        addValue(key);

    } else if (["+", "-", "*", "/", "."].includes(key)) {

        addValue(key);

    } else if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculateResult();

    } else if (key === "Backspace") {

        deleteLast();

    } else if (key === "Escape") {

        clearCalculator();

    }

});


// Initial Display

updateDisplay();
