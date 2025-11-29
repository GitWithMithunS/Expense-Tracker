import { BanknoteArrowDown, Coins, DollarSign, FunnelPlus, Layers, LayoutDashboard, List, Wallet } from "lucide-react";

export const SIDE_BAR_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    id: "02",
    label: "Category",
    icon: Layers,
    path: "/category"
  },
  {
    id: "03",
    label: "Income",
    icon: Wallet,
    path: "/income"
  },
  {
    id: "04",
    label: "Expense",
    icon: Coins,
    path: "/expense"
  },
  {
    id: "05",
    label: "Filter",
    icon: FunnelPlus,
    path: "/filter"
  },
  {
    id: "06",
    label: "Bills",
    icon: BanknoteArrowDown,
    path: "/bills"
  },
  
  {
    id: "07",
    label: "Budget",
    icon: DollarSign,
    path: "/budget"
  }
];
