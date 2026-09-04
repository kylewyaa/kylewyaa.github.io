(function () {
  var storageKey = "kyles-paper-portfolio";
  var saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  var state = saved || { balance: 100000, weeklyEarnings: 0, wins: 0, losses: 0, trades: [] };
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
  var balanceElement = document.getElementById("account-balance");
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
  var terminal = document.querySelector(".trading-terminal");

  function money(value) { return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function market() { return markets[activeMarket].pairs[currentPair]; }
  function save() { localStorage.setItem(storageKey, JSON.stringify(state)); }
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
  }
  function updateChart() {
    chart.src = "https://www.tradingview.com/widgetembed/?symbol=" + market().symbol + "&interval=15&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbar_bg=%23080808&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&hide_top_toolbar=1&hide_legend=0&hide_volume=1&allow_symbol_change=0&calendar=0";
  }
  function selectMarket(name) {
    activeMarket = name;
    var isPortfolio = name === "portfolio";
    terminal.classList.toggle("is-hidden", isPortfolio);
    portfolioPanel.hidden = !isPortfolio;
    if (!isPortfolio) {
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
    state.balance += result; state.weeklyEarnings += result;
    if (result >= 0) state.wins++; else state.losses++;
    positionLine.textContent = (result >= 0 ? "Winning" : "Bad") + " trade closed: " + (result >= 0 ? "+" : "") + money(result) + ".";
    save(); updatePortfolio();
  });
  setInterval(function () {
    if (activeMarket === "portfolio") return;
    currentPrice = Math.max(market().decimals === 2 ? 1 : 0.5, currentPrice + (Math.random() - 0.48) * (activeMarket === "crypto" ? currentPrice * 0.004 : 0.00035));
    markets[activeMarket].pairs[currentPair].price = currentPrice;
    quote.textContent = currentPrice.toFixed(market().decimals);
    updatePortfolio();
  }, 1800);
  updatePortfolio();
}());