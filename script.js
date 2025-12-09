class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === "." && this.currentOperand.includes(".")) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === "") return;

        if (this.previousOperand !== "") {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
        this.updateDisplay();
    }

    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const curr = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(curr)) return;

        switch (this.operation) {
            case "+":
                result = prev + curr;
                break;
            case "-":
                result = prev - curr;
                break;
            case "×":
            case "*":
                result = prev * curr;
                break;
            case "÷":
            case "/":
                result = curr === 0 ? "Erro" : prev / curr;
                break;
            default:
                return;
        }

        addToHistory(`${prev} ${this.operation} ${curr} = ${result}`);

        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = "";
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandTextElement.textContent = this.currentOperand;
        this.previousOperandTextElement.textContent = 
            this.operation ? `${this.previousOperand} ${this.operation}` : "";
    }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");

const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");

const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.textContent);
    });
});

operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.textContent);
    });
});

equalsButton.addEventListener("click", () => {
    calculator.compute();
});

allClearButton.addEventListener("click", () => {
    calculator.clear();
});

deleteButton.addEventListener("click", () => {
    calculator.delete();
});

function addToHistory(operationText) {
    const li = document.createElement("li");
    li.textContent = operationText;
    li.addEventListener("click", () => {
        const result = operationText.split(" = ")[1];
        calculator.currentOperand = result;
        calculator.previousOperand = "";
        calculator.operation = undefined;
        calculator.updateDisplay();
    });

    historyList.prepend(li);
}

clearHistoryBtn.addEventListener("click", () => {
    historyList.innerHTML = "";
});
