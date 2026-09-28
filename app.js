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
    
    checkInToday();

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
     updateSpendingVisual(categoryTotals, total);
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

    const weekDetailOverlay =
    document.getElementById("week-detail-overlay");

    const closeWeekDetailButton =
    document.getElementById("close-week-detail");

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

    const weekCategoryElements = {
    Food: document.getElementById("week-food-total"),
    Drinks: document.getElementById("week-drinks-total"),
    Transport: document.getElementById("week-transport-total"),
    Shopping: document.getElementById("week-shopping-total"),
    Bills: document.getElementById("week-bills-total"),
    Health: document.getElementById("week-health-total"),
    Learning: document.getElementById("week-learning-total"),
    Other: document.getElementById("week-other-total")
};

Object.keys(weekCategoryTotals).forEach(function (category) {

    const amount = weekCategoryTotals[category];
    const amountElement = weekCategoryElements[category];
    const row = amountElement.closest("li");

    amountElement.textContent = amount.toFixed(2);

    if (amount === 0) {
        row.classList.add("hidden");
    } else {
        row.classList.remove("hidden");
    }

});

    weekDetailOverlay.classList.remove("hidden");

    closeWeekDetailButton.addEventListener("click", function () {
    weekDetailOverlay.classList.add("hidden");
    });

    weekDetailOverlay.addEventListener("click", function (event) {

    if (event.target === weekDetailOverlay) {
        weekDetailOverlay.classList.add("hidden");
    }
    });
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

        const expenseDate = new Date(expense.date + "T00:00:00");

        const friendlyDate = expenseDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
        }); 

        expenseItem.innerHTML = `
            <strong>${expense.category}</strong> - $${expense.amount.toFixed(2)}
            <br>
            ${friendlyDate}
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

    weekDetailOverlay.classList.add("hidden");
}

/* =========================
   EXPORT MONTHLY CSV
   ========================= */

const exportButton = document.getElementById("export-button");

exportButton.addEventListener("click", function () {

    const monthExpenses = expenses.filter(function (expense) {
        const expenseDate = new Date(expense.date + "T00:00:00");

        return (
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        );
    });

    if (monthExpenses.length === 0) {
        alert("There are no expenses to export for this month.");
        return;
    }

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

    let monthlyTotal = 0;

    monthExpenses.forEach(function (expense) {
        monthlyTotal += expense.amount;

        if (categoryTotals[expense.category] !== undefined) {
            categoryTotals[expense.category] += expense.amount;
        }
    });

    const viewedDate = new Date(currentYear, currentMonth, 1);

    const monthName = viewedDate.toLocaleString("en-US", {
        month: "long"
    });

    let csv = "";

    csv += "LUY NOTE - " + monthName + " " + currentYear + "\n\n";

    csv += "MONTHLY TOTAL\n";
    csv += monthlyTotal.toFixed(2) + "\n\n";

    csv += "CATEGORY SUMMARY\n";
    csv += "Category,Amount\n";

    Object.keys(categoryTotals).forEach(function (category) {
        csv += category + "," +
            categoryTotals[category].toFixed(2) + "\n";
    });

    csv += "\nEXPENSES\n";
    csv += "Date,Category,Amount,Note\n";

    monthExpenses.forEach(function (expense) {

        const safeNote = (expense.note || "")
            .replace(/"/g, '""');

        csv +=
            expense.date + "," +
            expense.category + "," +
            expense.amount.toFixed(2) + ',"' +
            safeNote + '"\n';
    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(blob);

    downloadLink.download =
        "Luy-Note-" + monthName + "-" + currentYear + ".csv";

    downloadLink.click();

    URL.revokeObjectURL(downloadLink.href);
});

function updateSpendingVisual(categoryTotals, monthlyTotal) {

    const spendingBars = document.getElementById("spending-bars");

    spendingBars.innerHTML = "";

    const categoryIcons = {
    Food: "🍜",
    Drinks: "🧋",
    Transport: "🛵",
    Shopping: "🛍️",
    Bills: "🧾",
    Health: "🌿",
    Learning: "📚",
    Other: "✨"
    };

    Object.keys(categoryTotals).forEach(function (category) {

        const amount = categoryTotals[category];

        if (amount === 0) {
            return;
        }

        const percentage =
            monthlyTotal > 0 ? (amount / monthlyTotal) * 100 : 0;

        const row = document.createElement("div");
        row.className = "spending-bar-row";

        row.innerHTML = `
            <div class="spending-bar-info">
                <span>${categoryIcons[category]} ${category}</span>
                <strong>$${amount.toFixed(2)}</strong>
            </div>

            <div class="spending-bar-track">
                <div
                    class="spending-bar-fill ${category.toLowerCase()}"
                    style="width: ${percentage}%">
                </div>
            </div>
        `;

        spendingBars.appendChild(row);
    });
}

/* =========================
   TREE COMPANION POPUP
   ========================= */

const treeCompanion =
    document.getElementById("tree-companion");

const treePopupOverlay =
    document.getElementById("tree-popup-overlay");

const closeTreePopupButton =
    document.getElementById("close-tree-popup");

const checkInButton =
    document.getElementById("check-in-button");

let treeProgress = JSON.parse(
    localStorage.getItem("treeProgress")
) || {
    lastCheckIn: null,
    currentStreak: 0,
    longestStreak: 0,
    totalCheckInDays: 0
};

    if (
        treeProgress.totalCheckInDays > 0 &&
        treeProgress.currentStreak === 0
    ) {
        treeProgress.currentStreak = 1;

        if (treeProgress.longestStreak === 0) {
            treeProgress.longestStreak = 1;
        }

        localStorage.setItem(
            "treeProgress",
            JSON.stringify(treeProgress)
        );
    }

treeCompanion.addEventListener("click", function () {

    if (treeWasDragged === true) {
        treeWasDragged = false;
        return;
    }

    treePopupOverlay.classList.remove("hidden");
});


closeTreePopupButton.addEventListener("click", function () {
    treePopupOverlay.classList.add("hidden");
});


treePopupOverlay.addEventListener("click", function (event) {

    if (event.target === treePopupOverlay) {
        treePopupOverlay.classList.add("hidden");
    }

});

function checkInToday() {

    const today = new Date().toLocaleDateString("en-CA");

    if (treeProgress.lastCheckIn === today) {
        updateTreeDisplay();
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayString =
        yesterday.toLocaleDateString("en-CA");

    if (treeProgress.lastCheckIn === yesterdayString) {

        treeProgress.currentStreak =
            treeProgress.currentStreak + 1;

    } else {

        treeProgress.currentStreak = 1;

    }

    if (
        treeProgress.currentStreak >
        treeProgress.longestStreak
    ) {
        treeProgress.longestStreak =
            treeProgress.currentStreak;
    }

    treeProgress.lastCheckIn = today;

    treeProgress.totalCheckInDays =
        treeProgress.totalCheckInDays + 1;

    localStorage.setItem(
        "treeProgress",
        JSON.stringify(treeProgress)
    );

    updateTreeDisplay();
}


checkInButton.addEventListener("click", function () {
    checkInToday();
});

function updateTreeDisplay() {

    const today = new Date().toLocaleDateString("en-CA");

    const growingDaysText =
        treeProgress.currentStreak === 1
            ? "1 Growing Day"
            : treeProgress.currentStreak + " Growing Days";

    const daysTogetherText =
        treeProgress.totalCheckInDays === 1
            ? "1 Day Together"
            : treeProgress.totalCheckInDays + " Days Together";

    document.getElementById("growing-days-text").textContent =
        growingDaysText;

    document.getElementById("days-together-text").textContent =
        daysTogetherText;

        let treeEmoji = "🌱";
        let treeStage = "Seedling";
        let treeMessage = "We're just getting started.";

        if (treeProgress.totalCheckInDays >= 30) {
            treeEmoji = "🌳✨";
            treeStage = "Happy Tree";
            treeMessage = "Look how far we've grown.";
        } else if (treeProgress.totalCheckInDays >= 14) {
            treeEmoji = "🌳";
            treeStage = "Young Tree";
            treeMessage = "You've been showing up.";
        } else if (treeProgress.totalCheckInDays >= 7) {
            treeEmoji = "🪴";
            treeStage = "Little Plant";
            treeMessage = "Your little habit is taking root.";
        } else if (treeProgress.totalCheckInDays >= 3) {
            treeEmoji = "🌿";
            treeStage = "Sprout";
            treeMessage = "Look at us growing.";
        }

document.getElementById("tree-character").textContent =
    treeEmoji;

    treeCompanion.textContent = treeEmoji;

document.getElementById("tree-stage").textContent =
    treeStage;

document.getElementById("tree-message").textContent =
    treeMessage;

    if (treeProgress.lastCheckIn === today) {
        checkInButton.textContent = "Checked in today ✓";
        checkInButton.disabled = true;
    } else {
        checkInButton.textContent = "Check in today ✓";
        checkInButton.disabled = false;
    }

}

updateTreeDisplay();

const savedTreePosition =
    localStorage.getItem("treePosition");

if (savedTreePosition) {
    treeCompanion.style.top = savedTreePosition;
    treeCompanion.style.bottom = "auto";
}

let isDraggingTree = false;
let treeWasDragged = false;
let treeStartY = 0;

treeCompanion.addEventListener("pointerdown", function (event) {
    isDraggingTree = true;
    treeWasDragged = false;
    treeStartY = event.clientY;
});

document.addEventListener("pointermove", function (event) {

    if (isDraggingTree === false) {
        return;
    }

    const distanceMoved =
    Math.abs(event.clientY - treeStartY);

    if (distanceMoved > 5) {
        treeWasDragged = true;
    }

document.addEventListener("pointerup", function () {

    if (isDraggingTree === true) {

        localStorage.setItem(
            "treePosition",
            treeCompanion.style.top
        );

    }

    isDraggingTree = false;
});

    const treeHeight = treeCompanion.offsetHeight;

    let newTop =
        event.clientY - (treeHeight / 2);

    const minimumTop = 10;

    const maximumTop =
        window.innerHeight - treeHeight - 10;

    newTop = Math.max(
        minimumTop,
        Math.min(newTop, maximumTop)
    );

    treeCompanion.style.top = newTop + "px";
    treeCompanion.style.bottom = "auto";
});