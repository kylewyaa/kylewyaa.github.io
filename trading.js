(function () {
  if (!localStorage.getItem("kyles-paper-reset-v2")) {
    localStorage.removeItem("kyles-paper-accounts");
    localStorage.removeItem("kyles-active-user");
    localStorage.setItem("kyles-paper-reset-v2", "true");
  }
  var username = localStorage.getItem("kyles-active-user");
  var accounts = JSON.parse(localStorage.getItem("kyles-paper-accounts") || "{}");
  var state = username && accounts[username] ? accounts[username] : { balance: 100000, weeklyEarnings: 0, wins: 0, losses: 0, trades: [], performance: [100000], day: new Date().toISOString().slice(0, 10), dailyEarnings: 0 };
  var today = new Date().toISOString().slice(0, 10);
  if (state.day !== today) {
    state.day = today;
    state.dailyEarnings = 0;
  }
  state.performance = state.performance || [state.balance];
  state.trades.forEach(function (trade) {
    trade.market = trade.market || "forex";
    trade.pairKey = trade.pairKey || "EURUSD";
  });
  var activeMarket = "forex";
  var currentPair = "EURUSD";
  var currentPrice = 1.0842;
  var markets = {
    forex: {
      pairs: {
        EURUSD: { title: "EUR / USD", symbol: "FX%3AEURUSD", price: 1.0842, decimals: 5 },
        GBPUSD: { title: "GBP / USD", symbol: "FX%3AGBPUSD", price: 1.2714, decimals: 5 },
        USDJPY: { title: "USD / JPY", symbol: "FX%3AUSDJPY", price: 156.24, decimals: 3 },
        AUDUSD: { title: "AUD / USD", symbol: "FX%3AAUDUSD", price: 0.6621, decimals: 5 }
      }
    },
    crypto: { pairs: {
      BTCUSD: { title: "BTC / USD", symbol: "COINBASE%3ABTCUSD", price: 64250, decimals: 2 },
      ETHUSD: { title: "ETH / USD", symbol: "COINBASE%3AETHUSD", price: 3480, decimals: 2 },
      SOLUSD: { title: "SOL / USD", symbol: "COINBASE%3ASOLUSD", price: 142, decimals: 2 }
    } }
  };
  var botNames = ["malone", "kimchi", "orangie"];
  var savedBotNames = JSON.parse(localStorage.getItem("kyles-paper-bot-names") || "[]");
  var botFirstNames = ["velvet", "pixel", "rocket", "solar", "neon", "orbit", "lucky", "silver", "midnight", "turbo", "cosmic", "mango", "echo", "nova", "flash", "frost", "juno", "mystic", "rapid", "blue"];
  var botSecondNames = ["fox", "wave", "trader", "byte", "chief", "spark", "drift", "bull", "bear", "mint", "chart", "star", "wolf", "cloud", "candle"];
  savedBotNames.forEach(function (savedBotName) {
    if (botNames.indexOf(savedBotName) === -1) botNames.push(savedBotName);
  });
  while (botNames.length < 100) {
    var generatedName = botFirstNames[Math.floor(Math.random() * botFirstNames.length)] + botSecondNames[Math.floor(Math.random() * botSecondNames.length)] + Math.floor(Math.random() * 99 + 1);
    if (botNames.indexOf(generatedName) === -1) botNames.push(generatedName);
  }
  localStorage.setItem("kyles-paper-bot-names", JSON.stringify(botNames));
  var botProfiles = { malone: "circle", kimchi: "square", orangie: "diamond" };
  botNames.forEach(function (botName) {
    if (!accounts[botName]) {
      accounts[botName] = { balance: 100000000, weeklyEarnings: 0, wins: 0, losses: 0, trades: [], performance: [100000000], day: today, dailyEarnings: 0, profile: botProfiles[botName], isBot: true, lastTrade: "" };
    }
  });
  var balanceElement = document.getElementById("account-balance");
  var performanceChange = document.getElementById("performance-change");
  var performancePath = document.getElementById("performance-path");
  var portfolioBalance = document.getElementById("portfolio-balance");
  var weeklyEarnings = document.getElementById("weekly-earnings");
  var winLoss = document.getElementById("win-loss");
  var tradesList = document.getElementById("active-trades-list");
  var emptyTrades = document.getElementById("active-trades-empty");
  var activeCount = document.getElementById("active-count");
  var quote = document.getElementById("quote");
  var title = document.getElementById("terminal-title");
  var pairSelector = document.getElementById("pair-selector");
  var chart = document.getElementById("tradingview-chart");
  var positionLine = document.getElementById("position-line");
  var closeButton = document.getElementById("close-trade");
  var unitsInput = document.getElementById("trade-units");
  var portfolioPanel = document.getElementById("portfolio-panel");
  var leaderboardPanel = document.getElementById("leaderboard-panel");
  var signupPanel = document.getElementById("signup-panel");
  var settingsPanel = document.getElementById("settings-panel");
  var leaderboardList = document.getElementById("leaderboard-list");
  var leaderboardEmpty = document.getElementById("leaderboard-empty");
  var terminal = document.querySelector(".trading-terminal");
  var loginToggle = document.getElementById("login-toggle");
  var loginForm = document.getElementById("login-form");

  function money(value) { return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function market() { return markets[activeMarket].pairs[currentPair]; }
  function save() {
    if (!username) return;
    accounts[username] = state;
    localStorage.setItem("kyles-paper-accounts", JSON.stringify(accounts));
    renderLeaderboard();
  }
  function renderLeaderboard() {
    var today = new Date().toISOString().slice(0, 10);
    Object.keys(accounts).forEach(function (accountName) {
      if (accounts[accountName].day !== today) { accounts[accountName].day = today; accounts[accountName].dailyEarnings = 0; }
    });
    var entries = Object.keys(accounts).map(function (accountName) { return { name: accountName, data: accounts[accountName] }; }).sort(function (a, b) { return b.data.dailyEarnings - a.data.dailyEarnings; });
    leaderboardEmpty.hidden = entries.length > 0;
    leaderboardList.innerHTML = entries.map(function (entry, index) {
      var result = entry.data.dailyEarnings || 0;
      var avatar = entry.data.profilePic ? "<img class=\"profile-avatar\" src=\"" + entry.data.profilePic + "\" alt=\"\" />" : "<i class=\"profile-avatar avatar-circle\">" + entry.name.charAt(0).toUpperCase() + "</i>";
      var botLabel = entry.data.isBot ? " <small>BOT / " + entry.data.lastTrade + " TRADE</small>" : "";
      return "<div class=\"leaderboard-row\"><strong>" + (index + 1) + "</strong><span>" + avatar + entry.name + botLabel + "</span><em class=\"" + (result < 0 ? "negative" : "") + "\">" + (result >= 0 ? "+" : "") + money(result) + "</em><span>" + money(entry.data.balance) + "</span></div>";
    }).join("");
  }
  function openProfitLoss() {
    return state.trades.reduce(function (total, trade) {
      var livePrice = trade.market === activeMarket && trade.pairKey === currentPair ? currentPrice : markets[trade.market].pairs[trade.pairKey].price;
      var direction = trade.side === "buy" ? 1 : -1;
      return total + (livePrice - trade.entry) * trade.units * direction;
    }, 0);
  }
  function updatePerformance() {
    var change = state.balance + openProfitLoss() - 100000;
    var percent = change / 100000 * 100;
    performanceChange.textContent = (change >= 0 ? "+" : "-") + money(Math.abs(change)) + " / " + (percent >= 0 ? "+" : "") + percent.toFixed(2) + "%";
    performanceChange.classList.toggle("negative", change < 0);
    var history = state.performance.slice(-40);
    var minimum = Math.min.apply(null, history);
    var maximum = Math.max.apply(null, history);
    var range = maximum - minimum || 1;
    performancePath.setAttribute("points", history.map(function (value, index) {
      var x = index / Math.max(history.length - 1, 1) * 240;
      var y = 58 - ((value - minimum) / range * 52);
      return x.toFixed(1) + "," + y.toFixed(1);
    }).join(" "));
  }
  function updatePortfolio() {
    balanceElement.textContent = money(state.balance);
    portfolioBalance.textContent = money(state.balance);
    weeklyEarnings.textContent = (state.weeklyEarnings >= 0 ? "+" : "") + money(state.weeklyEarnings);
    weeklyEarnings.classList.toggle("negative", state.weeklyEarnings < 0);
    winLoss.textContent = state.wins + " / " + state.losses;
    activeCount.textContent = state.trades.length + " open";
    emptyTrades.hidden = state.trades.length > 0;
    tradesList.innerHTML = state.trades.map(function (trade) {
      var direction = trade.side === "buy" ? 1 : -1;
      var livePrice = trade.market === activeMarket && trade.pairKey === currentPair ? currentPrice : markets[trade.market].pairs[trade.pairKey].price;
      var liveResult = (livePrice - trade.entry) * trade.units * direction;
      return "<li><strong>" + trade.side.toUpperCase() + " " + trade.pair + "</strong><span>" + trade.units + " units at " + trade.entry.toFixed(trade.decimals) + "</span><em>" + (liveResult >= 0 ? "+" : "") + money(liveResult) + "</em></li>";
    }).join("");
    closeButton.disabled = state.trades.length === 0;
    updatePerformance();
  }
  function runBotTrading() {
    botNames.forEach(function (botName) {
      if (Math.random() > 0.28) return;
      var bot = accounts[botName];
      var result = (Math.random() - 0.46) * 1200000;
      var tradeSize = Math.random() < 0.025 ? 40000000 : Math.floor(100000 + Math.random() * 9000000);
      bot.dailyEarnings += result;
      bot.weeklyEarnings += result;
      bot.balance += result;
      bot.lastTrade = money(tradeSize);
      if (result >= 0) bot.wins++; else bot.losses++;
    });
    localStorage.setItem("kyles-paper-accounts", JSON.stringify(accounts));
    renderLeaderboard();
  }
  function updateChart() {
    chart.src = "https://www.tradingview.com/widgetembed/?symbol=" + market().symbol + "&interval=15&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbar_bg=%23080808&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&hide_top_toolbar=1&hide_legend=0&hide_volume=1&allow_symbol_change=0&calendar=0";
  }
  function selectMarket(name) {
    activeMarket = name;
    var isPortfolio = name === "portfolio";
    var isLeaderboard = name === "leaderboard";
    var isSignup = name === "signup";
    var isSettings = name === "settings";
    terminal.classList.toggle("is-hidden", isPortfolio || isLeaderboard || isSignup || isSettings || !username);
    portfolioPanel.hidden = !isPortfolio;
    leaderboardPanel.hidden = !isLeaderboard;
    signupPanel.hidden = !isSignup;
    settingsPanel.hidden = !isSettings;
    if (isLeaderboard) renderLeaderboard();
    if (isSettings) document.getElementById("signed-in-as").textContent = username ? "Signed in as " + username : "No account is signed in.";
    if (!isPortfolio && !isLeaderboard && !isSignup && !isSettings) {
      currentPair = Object.keys(markets[name].pairs)[0];
      currentPrice = market().price;
      title.textContent = market().title;
      pairSelector.innerHTML = Object.keys(markets[name].pairs).map(function (pair) { return "<option value=\"" + pair + "\">" + markets[name].pairs[pair].title + "</option>"; }).join("");
      updateChart();
    }
    document.querySelectorAll(".terminal-tab").forEach(function (tab) { tab.classList.toggle("is-active", tab.dataset.market === name); });
    updatePortfolio();
  }
  document.querySelectorAll(".terminal-tab").forEach(function (tab) { tab.addEventListener("click", function () { selectMarket(tab.dataset.market); }); });
  window.addEventListener("storage", function (event) {
    if (event.key === "kyles-paper-accounts") {
      accounts = JSON.parse(event.newValue || "{}");
      renderLeaderboard();
    }
  });
  document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();
    username = document.getElementById("signup-username").value.trim();
    var password = document.getElementById("signup-password").value;
    if (accounts[username]) { document.getElementById("signup-message").textContent = "That username is already taken."; return; }
    var file = document.getElementById("profile-file").files[0];
    var finishSignup = function (profilePic) {
      state = { balance: 100000, weeklyEarnings: 0, wins: 0, losses: 0, trades: [], performance: [100000], day: new Date().toISOString().slice(0, 10), dailyEarnings: 0, profilePic: profilePic, password: password };
      accounts[username] = state;
      localStorage.setItem("kyles-active-user", username);
      save();
      selectMarket("forex");
    };
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        document.getElementById("signup-message").textContent = "Choose an image smaller than 2 MB.";
        return;
      }
      var reader = new FileReader();
      reader.addEventListener("load", function () { finishSignup(reader.result); });
      reader.readAsDataURL(file);
    } else {
      finishSignup("");
    }
  });
  loginToggle.addEventListener("click", function () { loginForm.hidden = !loginForm.hidden; });
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var loginName = document.getElementById("login-username").value.trim();
    var account = accounts[loginName];
    if (!account || account.password !== document.getElementById("login-password").value) {
      document.getElementById("login-message").textContent = "Username or password is incorrect.";
      return;
    }
    username = loginName; state = account;
    var loginToday = new Date().toISOString().slice(0, 10);
    if (state.day !== loginToday) { state.day = loginToday; state.dailyEarnings = 0; save(); }
    localStorage.setItem("kyles-active-user", username);
    selectMarket("forex");
  });
  document.getElementById("settings-form").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!username) { document.getElementById("settings-message").textContent = "Log in before changing settings."; return; }
    var newName = document.getElementById("new-username").value.trim();
    var file = document.getElementById("settings-profile-file").files[0];
    var lastChange = state.usernameChangedAt ? new Date(state.usernameChangedAt).getTime() : 0;
    if (newName && newName !== username && Date.now() - lastChange < 15 * 24 * 60 * 60 * 1000) {
      document.getElementById("settings-message").textContent = "Username changes unlock after 15 days.";
      return;
    }
    if (newName && newName !== username && accounts[newName]) { document.getElementById("settings-message").textContent = "That username is already taken."; return; }
    var applyChanges = function (profilePic) {
      if (profilePic) state.profilePic = profilePic;
      if (newName && newName !== username) { delete accounts[username]; state.usernameChangedAt = new Date().toISOString(); username = newName; }
      accounts[username] = state; localStorage.setItem("kyles-active-user", username); save();
      document.getElementById("settings-message").textContent = "Settings saved.";
      document.getElementById("signed-in-as").textContent = "Signed in as " + username;
    };
    if (file) {
      if (file.size > 2 * 1024 * 1024) { document.getElementById("settings-message").textContent = "Choose an image smaller than 2 MB."; return; }
      var reader = new FileReader(); reader.addEventListener("load", function () { applyChanges(reader.result); }); reader.readAsDataURL(file);
    } else applyChanges("");
  });
  document.getElementById("logout-button").addEventListener("click", function () {
    localStorage.removeItem("kyles-active-user"); username = null;
    selectMarket("signup");
  });
  pairSelector.addEventListener("change", function () { currentPair = pairSelector.value; currentPrice = market().price; title.textContent = market().title; updateChart(); });
  document.querySelectorAll(".order-button[data-side]").forEach(function (button) {
    button.addEventListener("click", function () {
      var units = Number(unitsInput.value);
      if (!Number.isFinite(units) || units < 1) { positionLine.textContent = "Enter at least 1 unit."; return; }
      state.trades.push({ side: button.dataset.side, market: activeMarket, pairKey: currentPair, pair: market().title, units: units, entry: currentPrice, decimals: market().decimals });
      positionLine.textContent = "Position open. Close it later to apply the result to your portfolio.";
      save(); updatePortfolio();
    });
  });
  closeButton.addEventListener("click", function () {
    if (!state.trades.length) return;
    var trade = state.trades.shift();
    var direction = trade.side === "buy" ? 1 : -1;
    var closingPrice = trade.market === activeMarket && trade.pairKey === currentPair ? currentPrice : markets[trade.market].pairs[trade.pairKey].price;
    var result = (closingPrice - trade.entry) * trade.units * direction;
    state.balance += result; state.weeklyEarnings += result; state.dailyEarnings += result;
    if (result >= 0) state.wins++; else state.losses++;
    positionLine.textContent = (result >= 0 ? "Winning" : "Bad") + " trade closed: " + (result >= 0 ? "+" : "") + money(result) + ".";
    save(); updatePortfolio();
  });
  setInterval(function () {
    if (activeMarket === "portfolio") return;
    currentPrice = Math.max(market().decimals === 2 ? 1 : 0.5, currentPrice + (Math.random() - 0.48) * (activeMarket === "crypto" ? currentPrice * 0.004 : 0.00035));
    markets[activeMarket].pairs[currentPair].price = currentPrice;
    state.performance.push(state.balance + openProfitLoss());
    if (state.performance.length > 100) state.performance.shift();
    quote.textContent = currentPrice.toFixed(market().decimals);
    updatePortfolio();
  }, 1800);
  setInterval(runBotTrading, 8000);
  updatePortfolio();
  selectMarket(username ? "forex" : "signup");
}());