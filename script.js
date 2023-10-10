// Récupération des éléments du DOM
const budgetValue = document.getElementById("budget-value");
const budgetCalculate = document.querySelector(".budget-calculate");
const idBudget = document.getElementById("idBudget");
const idBalance = document.getElementById("idBalance");
const addExpensive = document.querySelector(".addExpensive");
const amountValue = document.getElementById("amount-value");
const idExpence = document.getElementById("idExpence");
const resetValue = document.querySelector(".reset-value");
const historique = document.getElementById("historique");
const close = document.getElementById("close");
const historiCashes = document.querySelector(".historiCashes");
const inputTextExpense = document.getElementById("expence-value");
const list = document.querySelector(".list");
const bloc = document.querySelector(".bloc");
// Fonction pour mettre à jour l'affichage de la balance
function updateBalance() {
  const budgetAmount = parseFloat(idBudget.textContent);
  const expenseAmount = parseFloat(idExpence.textContent);
  if (!isNaN(budgetAmount) && !isNaN(expenseAmount)) {
    const balance = budgetAmount - expenseAmount;
    idBalance.textContent = balance + " F"; // Utilisation de toFixed(2) pour afficher deux décimales
  }
}
// Écouteur d'événement pour le bouton de réinitialisation
resetValue.addEventListener("click", () => {
  // Effacez les données du stockage local et rechargez la page
  localStorage.clear();
  document.location.reload();
});
// Écouteur d'événement pour l'élément historique
historique.addEventListener("click", (e) => {
  if (e.target === historique) {
    // Vérifiez si l'événement provient de l'élément historique lui-même
    historiCashes.classList.remove("historiCashes");
  }
});
// Écouteur d'événement pour l'élément close
close.addEventListener("click", (e) => {
  if (e.target === close) {
    // Vérifiez si l'événement provient de l'élément close lui-même
    historiCashes.classList.add("historiCashes");
  }
});
// Initialisation des valeurs
let valeur = {
  budged: "00",
  expense: "00",
  balance: "00",
};
// Vérification de la présence des données dans le stockage local
if (!localStorage.getItem("key")) {
  localStorage.setItem("key", JSON.stringify(valeur));
}
// Récupération des données du stockage local et affichage initial
let tabTout = JSON.parse(localStorage.getItem("key"));
idBudget.textContent = tabTout.budged + " F";
// Écouteur d'événement pour le bouton de calcul du budget
budgetCalculate.addEventListener("click", (event) => {
  event.preventDefault();
  let tabTout = JSON.parse(localStorage.getItem("key"));
  valeur = {
    budged: Number(tabTout.budged) + Number(budgetValue.value),
    expense: Number(tabTout.expense),
    balance: Number(tabTout.balance),
  };
  localStorage.setItem("key", JSON.stringify(valeur));
  let tab = JSON.parse(localStorage.getItem("key"));
  idBudget.textContent = tab.budged + " F";
  updateBalance();
  budgetValue.value = "";
  condition();
});
// Récupération des données du stockage local pour l'expense initial
let tabs = JSON.parse(localStorage.getItem("key"));
idExpence.textContent = tabs.expense + " F";
idBalance.textContent = tabs.balance + " F";
let tab = JSON.parse(localStorage.getItem("key"));
idBudget.textContent = tab.budged + " F";
// Écouteur d'événement pour le bouton d'ajout de dépense
addExpensive.addEventListener("click", (event) => {
  event.preventDefault();

  // Récupérez les valeurs actuelles des champs du formulaire
  let inputExpenceValue = inputTextExpense.value;
  let inputAmountValue = amountValue.value;
  let inputBudgetValue = budgetValue.value;

  if (
    inputAmountValue === "" ||
    inputAmountValue < 0 ||
    inputExpenceValue === "" ||
    inputExpenceValue === " "
  ) {
    condition();
    setTimeout(() => {
      info.classList.add("info");
      info.classList.remove("infoa");
    }, 2000);
  } else {
    info.classList.remove("info");
    info.classList.add("infoa");
    infoText.textContent = "";
    infoText.textContent = "Ajout des dépenses avec succès";
    let tabToutExpense = JSON.parse(localStorage.getItem("key"));
    valeur = {
      budged: Number(tabToutExpense.budged),
      expense: Number(tabToutExpense.expense) + Number(inputAmountValue),
      balance:
        Number(tabToutExpense.budged) -
        (Number(tabToutExpense.expense) + Number(inputAmountValue)),
    };
    localStorage.setItem("key", JSON.stringify(valeur));

    // Ajoutez la nouvelle dépense aux données sauvegardées
    let dataBase = {
      title: inputExpenceValue,
      montant: inputAmountValue,
    };

    savedExpenses.push(dataBase);

    // Sauvegardez les données dans le stockage local
    localStorage.setItem("savedExpenses", JSON.stringify(savedExpenses));
    afficheExpense(dataBase);
    updateBalance();
    setTimeout(() => {
      info.classList.add("info");
      info.classList.remove("infoa");
    }, 2000);
  }
  amountValue.value = "";
  inputTextExpense.value = "";
  location.reload();
});
// Récupérez les données de dépense depuis le stockage local
let savedExpenses = JSON.parse(localStorage.getItem("savedExpenses")) || [];

// Remplissez la liste des dépenses avec les données sauvegardées
for (const expense of savedExpenses) {
  afficheExpense(expense, savedExpenses.indexOf(expense));
}

function afficheExpense(dataBase, index) {
  const divAffiche = document.createElement("div");
  divAffiche.classList.add("depenseFait");

  divAffiche.innerHTML = `<span id="Expense-title">${dataBase.title}</span>
    <span id="Expense-valuee">${dataBase.montant} F</span>
    <span>
        <button style="color: rgb(14, 212, 8); margin-right: 0.6rem;" id="editList"><i class="fa-solid fa-pen-to-square"></i></button>
        <button style="color: red;" id="deleteList"><i class="fa-solid fa-trash"></i></button>
    </span>`;

  const divAfficheHisto = document.createElement("div");
  divAfficheHisto.classList.add("divFille");

  divAfficheHisto.innerHTML = `<span>${index}</span>
    <span>${dataBase.title}</span>
    <span>${dataBase.montant} F</span>`;

  list.appendChild(divAffiche);
  bloc.appendChild(divAfficheHisto);

  // Écouteur d'événement pour le bouton "deleteList"
  const deleteButton = divAffiche.querySelector("#deleteList");
  deleteButton.addEventListener("click", () => {
    // Supprimez l'élément correspondant du tableau savedExpenses
    savedExpenses.splice(index, 1);

    // Mettez à jour le stockage local avec les nouvelles données
    localStorage.setItem("savedExpenses", JSON.stringify(savedExpenses));
    // Supprimez l'élément de la liste DOM
    updateBalance();
    divAffiche.remove();
    divAfficheHisto.remove();
    info.classList.remove("info");
    info.classList.add("infoa");
    infoText.textContent = "Supprimer avec  succès";
    setTimeout(() => {
      info.classList.add("info");
      info.classList.remove("infoa");
    }, 2000);
    location.reload();
  });
  const btnModifier = document.getElementById('editList');
    btnModifier.addEventListener("click", () => {
      // Récupérez la tâche à modifier en utilisant l'index
      //const tacheAModifier = dataBase[index];

      // Remplissez les champs de saisie avec les données actuelles de la tâche
      inputTextExpense.value = dataBase.title;
      amountValue.value = dataBase.montant;

      // Supprimez la tâche du tableau dataTache
      savedExpenses.splice(index, 1);

      // Mettez à jour le localStorage avec le tableau modifié
      localStorage.setItem("savedExpenses", JSON.stringify(savedExpenses));
      updateBalance();
    divAffiche.remove();
    divAfficheHisto.remove();
      // Affichez à nouveau la liste de tâches mise à jour
      //location.reload();
    });
}

let inputExpenceValue = document.getElementById("expence-value").value;
let inputAmountValue = document.getElementById("amount-value").value;
let inputBudgetValue = document.getElementById("budget-value").value;
const info = document.querySelector(".info");
const infoText = document.getElementById("info");
function condition() {
  if (
    inputBudgetValue === "" ||
    inputBudgetValue < 0 ||
    inputAmountValue === "" ||
    inputAmountValue < 0 ||
    inputExpenceValue === ""
  ) {
    info.classList.remove("info");
    info.classList.add("infoa");
    infoText.textContent = "Erreur! Veuillez saisir un nombre valide";
    setTimeout(() => {
      info.classList.add("info");
      info.classList.remove("infoa");
    }, 2000);
  }else{
    info.classList.remove("info");
    info.classList.add("infoa");
    infoText.textContent = "Valider avec succes";
    setTimeout(() => {
      info.classList.add("info");
      info.classList.remove("infoa");
    }, 2000);
  }
}

// Fonction pour mettre à jour Chart.js avec les données de dépenses
let myChartjs = () => {
  let tabb = JSON.parse(localStorage.getItem("savedExpenses"));
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[0].backgroundColor = []; // Use assignment instead of push
  tabb.forEach((element) => {
    chart.data.labels.push(element.title);
    chart.data.datasets[0].data.push(element.montant);
    chart.data.datasets[0].backgroundColor.push(colorr());
  });
  chart.update();
};

let chart;
// Initialisation de Chart.js
window.onload = function () {
  const ctx = document.getElementById("myChart");
  const expenseLabels = savedExpenses.map((dataBase) => dataBase.title);
  const expenseData = savedExpenses.map((dataBase) => dataBase.montant);
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: expenseLabels,
      datasets: [
        {
          data: expenseData,
          backgroundColor: colorr,
          borderWidth: 1,
        },
      ],
    },
    options: { circumference: 360, rotation: 360, cutout: 80 },
  });
};

// Fonction pour générer une couleur aléatoire
const colorr = () => {
  let col = "0123456789ABCDEF";
  let r = "#";
  for (let i = 0; i < 6; i++) {
    r += col[Math.floor(Math.random() * 16)];
  }
  return r;
};
