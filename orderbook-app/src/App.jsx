import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./components/ui/select";

// Symbol setup
const symbolsFromPDF = [
  "OPAI",
  "DATB",
  "XAAI",
  "ANTH",
  "STRI",
  "REMA",
  "SPAX",
  "KLAR",
  "EPGA",
  "ANIN",
  "FANA",
  "RESP",
  "RAPP",
  "CHIM",
  "RIPP",
  "NETS",
  "DTMR",
  "AIR",
  "NURO",
  "BREX",
  "ZIPL",
  "DATO",
  "TATE",
  "ETTO",
  "GLEA",
  "LIDE",
  "WORR",
  "FLEP",
  "EQSH",
  "NEUR",
  "GROQ",
  "SANS",
  "ROOF",
  "CIRC",
  "IMPF",
  "COHS",
  "BRAC",
  "CIHE",
  "VERC",
  "ATTE",
  "PLAI",
  "SIXS",
  "SCAI",
  "PSIQ",
  "CONS",
  "EAJU",
  "FLOQ",
  "AXSP",
  "PATR",
  "BIGI",
  "RAMP",
  "ZOCD",
  "CESY",
  "GREE",
  "SHAI",
  "DISO",
  "PEAI",
  "AUAN",
  "BLOO",
  "FABN",
  "LAMD",
  "LIG",
  "THSP",
  "WHOO",
  "SAAQ",
  "FIGR",
  "HTWO",
  "ADDE",
  "COLH",
  "NEFJ",
  "VECR",
  "MAPB",
  "UPGR",
  "CHAA",
  "RIPL",
  "MAFT",
  "TURO",
  "SNAL",
  "HARN",
  "ARWO",
  "OUTR",
  "GERO",
  "TANI",
  "MERC",
  "MOTV",
  "WORA",
  "REPI",
  "SIFT",
  "SIST",
  "DRAG",
  "GUID",
  "POSM",
  "FIGM",
  "DIFO",
  "EISL",
  "SESC",
  "THFD",
  "INTC",
];

const symbolMap = Object.fromEntries(
  symbolsFromPDF.flatMap((sym) => [
    [sym, sym],
    [`${sym}.S`, `${sym} SPV`],
  ])
);

// Layout with Outlet
const Layout = () => {
  console.log("Layout rendered");
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-900 text-white p-4 space-y-4">
        <h1 className="text-xl font-bold mb-4">
          Monark Markets<sup>®</sup>
        </h1>
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
      <main className="flex-1 p-6 overflow-y-auto bg-slate-800 text-white">
        <Outlet />
      </main>
    </div>
  );
};

// Pages
const MarketOrderPage = () => {
  console.log("MarketOrderPage rendered");

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
    const existingOrders = JSON.parse(
      localStorage.getItem("marketOrders") || "[]"
    );
    localStorage.setItem(
      "marketOrders",
      JSON.stringify([...existingOrders, newOrder])
    );
    navigate("/market-view");
  };

  return (
    <div className="space-y-4 max-w-3xl text-black bg-white p-6 rounded-xl">
      <h2 className="text-2xl font-bold">New Order</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Search by Company Name"
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
          onValueChange={(value) => handleChange("side", value)}
        >
          <option value="" disabled>
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
        <Input value={formData.total} readOnly placeholder="Total Size" />
        <Input
          placeholder="Closing Date (optional)"
          value={formData.closingDate}
          onChange={(e) => handleChange("closingDate", e.target.value)}
        />
        <Input
          placeholder="Implied Valuation (optional)"
          value={formData.valuation}
          onChange={(e) => handleChange("valuation", e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={formData.direct}
            onCheckedChange={(checked) => handleChange("direct", checked)}
          />
          <span>Direct to Party</span>
        </label>
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={formData.spv}
            onCheckedChange={(checked) => handleChange("spv", checked)}
          />
          <span>SPV</span>
        </label>
      </div>

      {formData.direct && (
        <Input
          placeholder="Share Class (if direct)"
          value={formData.shareClass}
          onChange={(e) => handleChange("shareClass", e.target.value)}
        />
      )}
      {formData.spv && (
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Mgmt Fee (if SPV)"
            value={formData.mgmtFee}
            onChange={(e) => handleChange("mgmtFee", e.target.value)}
          />
          <Input
            placeholder="Carry (if SPV)"
            value={formData.carry}
            onChange={(e) => handleChange("carry", e.target.value)}
          />
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={formData.riaManaged}
              onCheckedChange={(checked) => handleChange("riaManaged", checked)}
            />
            <span>RIA/ERA Managed?</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={formData.doubleLayer}
              onCheckedChange={(checked) =>
                handleChange("doubleLayer", checked)
              }
            />
            <span>Double Layer?</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={formData.audits}
              onCheckedChange={(checked) => handleChange("audits", checked)}
            />
            <span>Audits Available?</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={formData.dataroom}
              onCheckedChange={(checked) => handleChange("dataroom", checked)}
            />
            <span>Full Dataroom?</span>
          </label>
        </div>
      )}

      <Textarea
        placeholder="General Notes"
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
      />
      <Select
        value={formData.visibility}
        onValueChange={(value) => handleChange("visibility", value)}
      >
        <option value="" disabled>
          Visibility
        </option>
        <SelectItem value="quiet">Quiet</SelectItem>
        <SelectItem value="loud">Loud</SelectItem>
        <SelectItem value="silent">Silent</SelectItem>
      </Select>

      <Input
        placeholder="Order Minimums (optional)"
        value={formData.minimum}
        onChange={(e) => handleChange("minimum", e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

const MarketViewPage = () => {
  const [orders, setOrders] = React.useState(() =>
    JSON.parse(localStorage.getItem("marketOrders") || "[]")
  );
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

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
    <div className="space-y-6">
      {Object.entries(grouped).map(([symbol, orders]) => (
        <Card key={symbol}>
          <CardContent className="p-4">
            <h3 className="text-xl font-bold mb-2">{symbol}</h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-700 cursor-pointer hover:bg-slate-700"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    <td>{order.side.toUpperCase()}</td>
                    <td>${parseFloat(order.price).toLocaleString()}</td>
                    <td>{parseInt(order.quantity).toLocaleString()}</td>
                    <td>{order.ageDays <= 7 ? "Live" : "Inquire"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg max-w-lg w-full space-y-2">
            <h3 className="text-xl font-bold mb-2">Order Details</h3>
            {Object.entries(selectedOrder).map(([key, val]) => (
              <div key={key} className="text-sm">
                <strong>{key}:</strong> {String(val)}
              </div>
            ))}
            <div className="flex gap-2 pt-4 justify-end">
              <Button variant="destructive" onClick={handleCancelOrder}>
                Cancel Order
              </Button>
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SymbolsPage = () => {
  const [symbols, setSymbols] = React.useState(() => {
    const fromStorage = localStorage.getItem("symbols");
    return fromStorage ? JSON.parse(fromStorage) : symbolsFromPDF;
  });

  const [newSymbol, setNewSymbol] = React.useState("");

  const addSymbol = () => {
    if (newSymbol && !symbols.includes(newSymbol)) {
      const updated = [...symbols, newSymbol];
      setSymbols(updated);
      localStorage.setItem("symbols", JSON.stringify(updated));
    }
    setNewSymbol("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Symbols</h2>
      <ul className="grid grid-cols-2 gap-2">
        {symbols.map((sym) => (
          <Link
            to={`/market-view?symbol=${sym}`}
            className="underline"
            key={sym}
          >
            {sym}
          </Link>
        ))}
      </ul>
      <div className="mt-4">
        <Input
          placeholder="Add New Symbol"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
        />
        <Button className="ml-2" onClick={addSymbol}>
          Add
        </Button>
      </div>
    </div>
  );
};

// Final App component
const App = () => {
  console.log("App rendered");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MarketOrderPage />} />
          <Route path="market-view" element={<MarketViewPage />} />
          <Route path="symbols" element={<SymbolsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
