import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// --- symbol data ---
const symbolsFromPDF = ["OPAI", "DATB", "XAAI", "ANTH"];
const symbolMap = Object.fromEntries(
  symbolsFromPDF.flatMap((sym) => [
    [sym, sym],
    [`${sym}.S`, `${sym} SPV`],
  ])
);

// --- layout ---
const Layout = ({ children }) => (
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
      {children}
    </main>
  </div>
);

// --- page: new order ---
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
          onValueChange={(v) => handleChange("side", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Side" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
          </SelectContent>
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
            onCheckedChange={(val) => handleChange("direct", val)}
          />
          <span>Direct to Party</span>
        </label>
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={formData.spv}
            onCheckedChange={(val) => handleChange("spv", val)}
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
              onCheckedChange={(v) => handleChange("riaManaged", v)}
            />
            <span>RIA/ERA Managed?</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={formData.doubleLayer}
              onCheckedChange={(v) => handleChange("doubleLayer", v)}
            />
            <span>Double Layer?</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={formData.audits}
              onCheckedChange={(v) => handleChange("audits", v)}
            />
            <span>Audits Available?</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={formData.dataroom}
              onCheckedChange={(v) => handleChange("dataroom", v)}
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
        onValueChange={(v) => handleChange("visibility", v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="quiet">Quiet</SelectItem>
          <SelectItem value="loud">Loud</SelectItem>
          <SelectItem value="silent">Silent</SelectItem>
        </SelectContent>
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

// You can add MarketViewPage + SymbolsPage back here as well, just like above

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<MarketOrderPage />} />
        {/* Add <Route path="/market-view" ...> and <Route path="/symbols" ...> here if needed */}
      </Routes>
    </Layout>
  </Router>
);

export default App;
