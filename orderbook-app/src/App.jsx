import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

// TEMP: replace custom UI components with HTML elements
const Input = (props) => (
  <input {...props} className="border p-2 rounded w-full" />
);
const Textarea = (props) => (
  <textarea {...props} className="border p-2 rounded w-full" />
);
const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    {children}
  </button>
);
const Checkbox = ({ checked, onCheckedChange }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
  />
);
const Select = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="border p-2 rounded w-full"
  >
    {children}
  </select>
);
const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const symbolsFromPDF = ["OPAI", "DATB", "XAAI", "ANTH"]; // short for now

const symbolMap = Object.fromEntries(
  symbolsFromPDF.flatMap((sym) => [
    [sym, sym],
    [`${sym}.S`, `${sym} SPV`],
  ])
);

const Layout = ({ children }) => (
  <div className="flex min-h-screen">
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Monark Markets</h1>
      <nav className="space-y-2">
        <Link to="/" className="block">
          My Orders
        </Link>
        <Link to="/market-view" className="block">
          Market View
        </Link>
        <Link to="/symbols" className="block">
          Symbols
        </Link>
      </nav>
    </aside>
    <main className="flex-1 p-6 bg-gray-100 text-black overflow-y-auto">
      {children}
    </main>
  </div>
);

const MarketOrderPage = () => {
  const [formData, setFormData] = React.useState({
    symbol: "",
    side: "",
    price: "",
    quantity: "",
    total: "",
    closingDate: "",
    valuation: "",
    direct: false,
    spv: false,
    shareClass: "",
    mgmtFee: "",
    carry: "",
    riaManaged: false,
    doubleLayer: false,
    audits: false,
    dataroom: false,
    notes: "",
    visibility: "",
    minimum: "",
  });

  const [searchInput, setSearchInput] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const price = parseFloat(formData.price);
    const quantity = parseFloat(formData.quantity);
    if (!isNaN(price) && !isNaN(quantity)) {
      setFormData((prev) => ({
        ...prev,
        total: (price * quantity).toFixed(2),
      }));
    }
  }, [formData.price, formData.quantity]);

  React.useEffect(() => {
    const match = Object.entries(symbolMap).find(([_symbol, name]) =>
      name.toLowerCase().includes(searchInput.toLowerCase())
    );
    if (match) setFormData((prev) => ({ ...prev, symbol: match[0] }));
  }, [searchInput]);

  React.useEffect(() => {
    if (formData.spv && !formData.symbol.endsWith(".S")) {
      setFormData((prev) => ({ ...prev, symbol: `${prev.symbol}.S` }));
    }
  }, [formData.spv]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newOrder = {
      ...formData,
      createdAt: new Date().toISOString(),
      ageDays: 0,
    };

    let existingOrders = [];
    try {
      existingOrders = JSON.parse(localStorage.getItem("marketOrders") || "[]");
    } catch (err) {
      console.error("Error reading orders from localStorage:", err);
    }

    localStorage.setItem(
      "marketOrders",
      JSON.stringify([...existingOrders, newOrder])
    );
    navigate("/market-view");
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold">New Order</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Search Company"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Input
          placeholder="Symbol"
          value={formData.symbol}
          onChange={(e) => handleChange("symbol", e.target.value)}
        />
        <Select
          value={formData.side}
          onValueChange={(v) => handleChange("side", v)}
        >
          <option disabled value="">
            Side
          </option>
          <SelectItem value="buy">Buy</SelectItem>
          <SelectItem value="sell">Sell</SelectItem>
        </Select>
        <Input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
        />
        <Input value={formData.total} readOnly placeholder="Total" />
        <Input
          placeholder="Closing Date"
          value={formData.closingDate}
          onChange={(e) => handleChange("closingDate", e.target.value)}
        />
        <Input
          placeholder="Valuation"
          value={formData.valuation}
          onChange={(e) => handleChange("valuation", e.target.value)}
        />
      </div>

      <label>
        <Checkbox
          checked={formData.direct}
          onCheckedChange={(val) => handleChange("direct", val)}
        />{" "}
        Direct to Party
      </label>
      <label>
        <Checkbox
          checked={formData.spv}
          onCheckedChange={(val) => handleChange("spv", val)}
        />{" "}
        SPV
      </label>

      {formData.direct && (
        <Input
          placeholder="Share Class"
          value={formData.shareClass}
          onChange={(e) => handleChange("shareClass", e.target.value)}
        />
      )}

      {formData.spv && (
        <>
          <Input
            placeholder="Mgmt Fee"
            value={formData.mgmtFee}
            onChange={(e) => handleChange("mgmtFee", e.target.value)}
          />
          <Input
            placeholder="Carry"
            value={formData.carry}
            onChange={(e) => handleChange("carry", e.target.value)}
          />
        </>
      )}

      <Textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
      />

      <Select
        value={formData.visibility}
        onValueChange={(v) => handleChange("visibility", v)}
      >
        <option disabled value="">
          Visibility
        </option>
        <SelectItem value="quiet">Quiet</SelectItem>
        <SelectItem value="loud">Loud</SelectItem>
        <SelectItem value="silent">Silent</SelectItem>
      </Select>

      <Input
        placeholder="Minimum"
        value={formData.minimum}
        onChange={(e) => handleChange("minimum", e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

const MarketViewPage = () => {
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("marketOrders") || "[]");
      setOrders(saved);
    } catch (err) {
      console.error("Failed to parse marketOrders:", err);
    }
  }, []);

  const grouped = orders.reduce((acc, order) => {
    if (!acc[order.symbol]) acc[order.symbol] = [];
    acc[order.symbol].push(order);
    return acc;
  }, {});

  const handleCancelOrder = () => {
    const updated = orders.filter((o) => o !== selectedOrder);
    localStorage.setItem("marketOrders", JSON.stringify(updated));
    setOrders(updated);
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([symbol, orders]) => (
        <div key={symbol} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">{symbol}</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Side</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr
                  key={idx}
                  onClick={() => {
                    setSelectedOrder(o);
                    setShowModal(true);
                  }}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <td>{o.side}</td>
                  <td>${parseFloat(o.price).toLocaleString()}</td>
                  <td>{parseInt(o.quantity).toLocaleString()}</td>
                  <td>{o.ageDays <= 7 ? "Live" : "Inquire"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Order Details</h3>
            {Object.entries(selectedOrder).map(([k, v]) => (
              <div key={k}>
                <strong>{k}</strong>: {String(v)}
              </div>
            ))}
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={handleCancelOrder}>Cancel</Button>
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SymbolsPage = () => {
  const [symbols, setSymbols] = React.useState([]);
  const [newSymbol, setNewSymbol] = React.useState("");

  React.useEffect(() => {
    try {
      const fromStorage = JSON.parse(localStorage.getItem("symbols") || "[]");
      setSymbols(fromStorage.length ? fromStorage : symbolsFromPDF);
    } catch (err) {
      console.error("Failed to load symbols:", err);
      setSymbols(symbolsFromPDF);
    }
  }, []);

  const addSymbol = () => {
    if (newSymbol && !symbols.includes(newSymbol)) {
      const updated = [...symbols, newSymbol];
      setSymbols(updated);
      localStorage.setItem("symbols", JSON.stringify(updated));
    }
    setNewSymbol("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Symbols</h2>
      <ul className="grid grid-cols-2 gap-2 mb-4">
        {symbols.map((sym) => (
          <Link
            key={sym}
            to={`/market-view?symbol=${sym}`}
            className="underline text-blue-600"
          >
            {sym}
          </Link>
        ))}
      </ul>
      <Input
        placeholder="Add Symbol"
        value={newSymbol}
        onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
      />
      <Button onClick={addSymbol}>Add</Button>
    </div>
  );
};

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<MarketOrderPage />} />
        <Route path="/market-view" element={<MarketViewPage />} />
        <Route path="/symbols" element={<SymbolsPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
