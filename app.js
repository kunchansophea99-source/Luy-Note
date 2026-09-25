const addExpenseButton = document.getElementById("add-expense-button");
const expenseForm = document.getElementById("expense-form");
const saveExpenseButton = document.getElementById("save-expense-button");

const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const noteInput = document.getElementById("note");
const dateInput = document.getElementById("date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;

    const currentDate = new Date();

    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const monthName = currentDate.toLocaleString("en-US", {
        month: "long"
    });

    document.getElementById("month-title").textContent =
        monthName + " " + currentYear;

// Load previously saved expenses.
// If there are none yet, start with an empty list.
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editingIndex = null;

addExpenseButton.addEventListener("click", function () {
    editingIndex = null;

    amountInput.value = "";
    noteInput.value = "";
    dateInput.value = today;

    saveExpenseButton.textContent = "Save Expense";

    expenseForm.classList.remove("hidden");

    expenseForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    amountInput.focus();
});

saveExpenseButton.addEventListener("click", function () {

    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const note = noteInput.value;
    const date = dateInput.value;

    if (amount <= 0) {
        alert("Please enter an amount.");
        return;
    }

    if (!date) {
        alert("Please select a date.");
        return;
    }

   const newExpense = {
    amount: amount,
    category: category,
    note: note,
    date: date
    };

    if (editingIndex === null) {

        // We are adding a brand-new expense
        expenses.push(newExpense);

    } else {

        // We are updating an existing expense
        expenses[editingIndex] = newExpense;

        editingIndex = null;

        saveExpenseButton.textContent = "Save Expense";
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));

    updateTotals();
    displayHistory();

    amountInput.value = "";
    noteInput.value = "";
    dateInput.value = today;

    expenseForm.classList.add("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    const saveToast = document.getElementById("save-toast");

    saveToast.classList.remove("hidden");

    setTimeout(function () {
        saveToast.classList.add("hidden");
    }, 1800);
});


function updateTotals() {

    let total = 0;
    const weekTotals = [0, 0, 0, 0, 0];

    const categoryTotals = {
        Food: 0,
        Drinks: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0,
        Health: 0,
        Learning: 0,
        Other: 0
    };

    expenses.forEach(function (expense) {

    const expenseDate = new Date(expense.date + "T00:00:00");

    const expenseMonth = expenseDate.getMonth();
    const expenseYear = expenseDate.getFullYear();

    if (expenseMonth === currentMonth && expenseYear === currentYear) {

        total = total + expense.amount;
        
        const day = expenseDate.getDate();
        const weekIndex = Math.floor((day - 1) / 7);
        weekTotals[weekIndex] = weekTotals[weekIndex] + expense.amount;

        if (categoryTotals[expense.category] !== undefined) {
            categoryTotals[expense.category] =
                categoryTotals[expense.category] + expense.amount;
        }
    }
});

    document.getElementById("total-amount").textContent = total.toFixed(2);

    document.getElementById("food-total").textContent = categoryTotals.Food.toFixed(2);
    document.getElementById("drinks-total").textContent = categoryTotals.Drinks.toFixed(2);
    document.getElementById("transport-total").textContent = categoryTotals.Transport.toFixed(2);
    document.getElementById("shopping-total").textContent = categoryTotals.Shopping.toFixed(2);
    document.getElementById("bills-total").textContent = categoryTotals.Bills.toFixed(2);
    document.getElementById("health-total").textContent = categoryTotals.Health.toFixed(2);
    document.getElementById("learning-total").textContent = categoryTotals.Learning.toFixed(2);
    document.getElementById("other-total").textContent = categoryTotals.Other.toFixed(2);

    document.getElementById("week-1-total").textContent = weekTotals[0].toFixed(2);
    document.getElementById("week-2-total").textContent = weekTotals[1].toFixed(2);
    document.getElementById("week-3-total").textContent = weekTotals[2].toFixed(2);
    document.getElementById("week-4-total").textContent = weekTotals[3].toFixed(2);
    document.getElementById("week-5-total").textContent = weekTotals[4].toFixed(2);
}
updateTotals();

const weekRows = document.querySelectorAll(".week-row");
const weekDetail = document.getElementById("week-detail");

weekRows.forEach(function (row) {

    row.addEventListener("click", function () {

        const selectedWeek = Number(row.dataset.week);

        showWeekDetail(selectedWeek);
    });

});

function showWeekDetail(selectedWeek) {

    let weekTotal = 0;

    const weekCategoryTotals = {
        Food: 0,
        Drinks: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0,
        Health: 0,
        Learning: 0,
        Other: 0
    };

    expenses.forEach(function (expense) {

        const expenseDate = new Date(expense.date + "T00:00:00");

        const expenseMonth = expenseDate.getMonth();
        const expenseYear = expenseDate.getFullYear();
        const expenseDay = expenseDate.getDate();

        const expenseWeek = Math.floor((expenseDay - 1) / 7) + 1;

        if (
            expenseMonth === currentMonth &&
            expenseYear === currentYear &&
            expenseWeek === selectedWeek
        ) {

            weekTotal = weekTotal + expense.amount;

            if (weekCategoryTotals[expense.category] !== undefined) {
                weekCategoryTotals[expense.category] =
                    weekCategoryTotals[expense.category] + expense.amount;
            }
        }
    });

    document.getElementById("week-detail-title").textContent =
        "Week " + selectedWeek;

    document.getElementById("week-detail-total").textContent =
        weekTotal.toFixed(2);

    document.getElementById("week-food-total").textContent = weekCategoryTotals.Food.toFixed(2);
    document.getElementById("week-drinks-total").textContent = weekCategoryTotals.Drinks.toFixed(2);
    document.getElementById("week-transport-total").textContent = weekCategoryTotals.Transport.toFixed(2);
    document.getElementById("week-shopping-total").textContent = weekCategoryTotals.Shopping.toFixed(2);
    document.getElementById("week-bills-total").textContent = weekCategoryTotals.Bills.toFixed(2);
    document.getElementById("week-health-total").textContent = weekCategoryTotals.Health.toFixed(2);
    document.getElementById("week-learning-total").textContent = weekCategoryTotals.Learning.toFixed(2);
    document.getElementById("week-other-total").textContent = weekCategoryTotals.Other.toFixed(2);

    weekDetail.classList.remove("hidden");
}

function displayHistory() {

    const historyContainer = document.getElementById("expense-history");

    historyContainer.innerHTML = "";

    const currentMonthExpenses = expenses
        .map(function (expense, index) {
            return {
                expense: expense,
                originalIndex: index
            };
        })
        .filter(function (item) {

            const expenseDate =
                new Date(item.expense.date + "T00:00:00");

            return (
                expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear
            );
        })
        .reverse();

    currentMonthExpenses.forEach(function (item) {

        const expense = item.expense;

        const expenseItem = document.createElement("div");

        expenseItem.innerHTML = `
            <strong>${expense.category}</strong> - $${expense.amount.toFixed(2)}
            <br>
            ${expense.date}
            ${expense.note ? "<br>" + expense.note : ""}
            <br>
            <button class="edit-expense-button">Edit</button>
            <button class="delete-expense-button">Delete</button>
        `;

        const editButton =
            expenseItem.querySelector(".edit-expense-button");

            editButton.addEventListener("click", function () {

            editingIndex = item.originalIndex;

            amountInput.value = expense.amount;
            categoryInput.value = expense.category;
            noteInput.value = expense.note;
            dateInput.value = expense.date;

            expenseForm.classList.remove("hidden");

            saveExpenseButton.textContent = "Update Expense";

            expenseForm.scrollIntoView({
                behavior: "smooth"
            });
        });

        const deleteButton =
            expenseItem.querySelector(".delete-expense-button");

            deleteButton.addEventListener("click", function () {

        const confirmed = confirm("Delete this expense?");

        if (!confirmed) {
        return;
        }

            expenses.splice(item.originalIndex, 1);

            localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
            );

            updateTotals();
            displayHistory();
        });

        historyContainer.appendChild(expenseItem);
    });
}

displayHistory();

const previousMonthButton =
    document.getElementById("previous-month-button");

const nextMonthButton =
    document.getElementById("next-month-button");


previousMonthButton.addEventListener("click", function () {

    currentMonth = currentMonth - 1;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear = currentYear - 1;
    }

    changeMonth();
});


nextMonthButton.addEventListener("click", function () {

    currentMonth = currentMonth + 1;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear = currentYear + 1;
    }

    changeMonth();
});

function changeMonth() {

    const viewedDate = new Date(currentYear, currentMonth, 1);

    const viewedMonthName = viewedDate.toLocaleString("en-US", {
        month: "long"
    });

    document.getElementById("month-title").textContent =
        viewedMonthName + " " + currentYear;

        const lastDayOfMonth =
            new Date(currentYear, currentMonth + 1, 0).getDate();

        const week5Label =
            document.getElementById("week-5-label");

        if (lastDayOfMonth >= 29) {
            week5Label.textContent =
                "29–" + lastDayOfMonth;
        } else {
            week5Label.textContent = "";
        }

    updateTotals();
    displayHistory();

    weekDetail.classList.add("hidden");
}