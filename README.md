# Mini ERP — Inventory & Sales Management System (Frontend)

A modern, fully responsive, and aesthetic React-based dashboard client for the Mini ERP System, facilitating stock control, product catalog management, and sales transactions across all device sizes.

---

## 1. About the Project
This frontend application provides an intuitive workspace for ERP users (Admins, Managers, and Employees). It adapts the UI features dynamically based on user roles and permissions. Users can manage inventory products, search and register sales via an autocomplete interface, analyze key business metrics on the dashboard, and configure catalog items. The interface is fully responsive — optimized for desktop, tablet, and mobile.

---

## 2. Technology Stack
*   **Framework:** React 19 (compiled via Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4
*   **HTTP Client:** Axios (configured with interceptors for JWT injection)
*   **Routing:** React Router v7
*   **State Management:** React Context API (custom `AuthContext`)
*   **Icons:** Lucide React (using the `Boxes` icon as the brand identity logo)

---

## 3. Architecture
The project follows a standard React SPA structure, separating reusable components, state containers, styles, and page layouts.

### Folder Directory Map
```
mini-erp-frontend/
├── public/
│   ├── favicon.svg             # Page tab icon (generated matching the Boxes brand logo)
│   └── icons.svg               # SVG icons asset file
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # App shell: collapsible sidebar (desktop) + mobile drawer nav
│   │   ├── ProductForm.tsx     # Add/Edit product modal dialog — scrollable on small screens
│   │   └── ProtectedRoute.tsx  # Guard container checking user RBAC authorization
│   ├── context/
│   │   └── AuthContext.tsx     # Global Auth state, Axios base settings, login & logout actions
│   ├── pages/
│   │   ├── Dashboard.tsx       # Metrics summary cards and responsive low-stock alert table
│   │   ├── Login.tsx           # Authentication login portal
│   │   ├── Products.tsx        # Paginated products inventory — card list (mobile) / table (desktop)
│   │   └── Sales.tsx           # Autocomplete product search checkout form and sales invoices log
│   ├── App.tsx                 # Client routers and context wrapper bootstrapper
│   ├── index.css               # Tailwind CSS declarations and layout styling rules
│   └── main.tsx                # Client entrypoint
├── index.html                  # Core HTML file
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configurations
├── vite.config.ts              # Vite server settings
└── package.json                # Project dependencies
```

---

## 4. Features

### Navigation & Layout
*   **Responsive Sidebar with Mobile Drawer:** On desktop, the sidebar collapses/expands with a chevron toggle button (`ChevronsLeft`/`ChevronsRight`) and smooth `duration-350 ease-in-out` transitions. On mobile, the sidebar slides in as a full-height overlay drawer triggered by a hamburger (`Menu`) icon in the sticky top bar. A semi-transparent backdrop closes the drawer on click.
*   **Static Footer Profile:** The user profile section (name, role badge, logout button) is fixed at the bottom of the sidebar — always visible without scrolling.
*   **Sticky Mobile Top Bar:** On mobile, a sticky header shows the brand logo, a hamburger menu button, and the current user's role badge.

### Products Page
*   **Responsive Table:** On mobile (`< md`), products are displayed as compact **card items** showing name, SKU, category, prices, stock badge, and action buttons. On desktop (`≥ md`), a full-width **sortable table** is rendered.
*   **Paginated Inventory:** Server-side pagination (8 items per page) with Previous/Next navigation.
*   **Search & Category Filter:** Instant-filtered product listing by name/SKU and category dropdown.
*   **Editable SKU:** The SKU field is fully editable inside the Product modal — allowing complete catalog item updates.

### Sales Page
*   **Autocomplete Product Search:** Typing in the Search Product field shows a live dropdown suggestion list filtered by name or SKU. Each suggestion card shows the product name, SKU, selling price, and stock count. Out-of-stock items are disabled automatically.
*   **Click-Outside to Close:** The suggestion dropdown closes automatically when clicking anywhere outside it.
*   **Invoice Item Responsiveness:** Checkout item rows stack vertically on mobile (`flex-col sm:flex-row`) with quantity controls, subtotals, and remove buttons adapting to narrow viewports.

### Dashboard Page
*   **Responsive Low-Stock Table:** Same dual-layout pattern as Products — card list on mobile, full table on desktop.
*   **Stats Cards Grid:** 2-column on tablet, 4-column on desktop, single column on mobile.

### General
*   **Unified Brand Logo:** The `Boxes` icon is used as the brand identity across the login portal, sidebar header, and browser tab (`favicon.svg`).
*   **Centered Page Titles:** All main page headers and subtitles are center-aligned for a balanced interface.
*   **Dynamic UI Restriction:** Elements (Add Product button, Dashboard sidebar link) hide automatically based on the logged-in user's RBAC permissions.
*   **Scrollable Modal Form:** The Add/Edit Product modal is constrained to `max-h-[90vh]` with internal scroll, preventing overflow on small-height devices.

---

## 5. How to Run

### Prerequisites
*   Node.js (v18+) installed.
*   The `mini-erp-backend` running on `http://localhost:5000` (Axios is preconfigured to route backend requests to this port).

### Steps
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start development server:**
    ```bash
    npm run dev
    ```
    The application will run on `http://localhost:5173`. Open this URL in your web browser.

3.  **Build for Production:**
    ```bash
    npm run build
    ```
    Previews are run via:
    ```bash
    npm run preview
    ```

---

## 6. Credentials

Use the following demo accounts to test different roles and permissions in the portal:

| Role     | Email             | Password      | Access Permissions |
| :------- | :---------------- | :------------ | :----------------- |
| **Admin**    | `admin@erp.com`     | `Password123!`  | Full access to Dashboard, Sales Invoice, and Products Management |
| **Manager**  | `manager@erp.com`   | `Password123!`  | Full access to Dashboard, Sales Invoice, and Products Management |
| **Employee** | `employee@erp.com`  | `Password123!`  | Access to Products List (view only) and Sales Checkout (create invoices) |


---

## 1. About the Project
This frontend application provides an intuitive workspace for ERP users (Admins, Managers, and Employees). It adapts the UI features dynamically based on user roles and permissions. Users can manage inventory products, search and register sales, analyze key business metrics on the dashboard, and configure catalog items.

---

## 2. Technology Stack
*   **Framework:** React 19 (compiled via Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4
*   **HTTP Client:** Axios (configured with intercepts for JWT injection)
*   **Routing:** React Router v7
*   **State Management:** React Context API (custom `AuthContext`)
*   **Icons:** Lucide React (using the `Boxes` icon as the brand identity logo)

---

## 3. Architecture
The project follows a standard React SPA structure, separating reusable components, state containers, styles, and page layouts.

### Folder Directory Map
```
mini-erp-frontend/
├── public/
│   ├── favicon.svg             # Page tab icon (generated matching the Boxes brand logo)
│   └── icons.svg               # SVG icons asset file
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # App shell containing the collapsible navigation sidebar
│   │   ├── ProductForm.tsx     # Add/Edit product modal dialog supporting SKU edits
│   │   └── ProtectedRoute.tsx  # Guard container checking user RBAC authorization
│   ├── context/
│   │   └── AuthContext.tsx     # Global Auth state, Axios base settings, login & logout actions
│   ├── pages/
│   │   ├── Dashboard.tsx       # Metrics summary cards and low stock items alert table
│   │   ├── Login.tsx           # Authentication login portal
│   │   ├── Products.tsx        # Paginated products inventory table with search & category filter
│   │   └── Sales.tsx           # Multi-product search checkout form and sales invoices log
│   ├── App.tsx                 # Client routers and context wrapper bootstrapper
│   ├── index.css               # Tailwind CSS declarations and layout styling rules
│   └── main.tsx                # Client entrypoint
├── index.html                  # Core HTML file
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configurations
├── vite.config.ts              # Vite server settings
└── package.json                # Project dependencies
```

---

## 4. Features
*   **Collapsible Navigation Sidebar:** A space-saving sidebar with smooth transition animations (`duration-350 ease-in-out`). Collapsing changes the sidebar layout to show centered icons only, and adds hover tooltip labels (`title`) for high UX quality.
*   **Unified Brand Logo:** Replaced placeholder lettering with the `Boxes` icon logo, integrated dynamically in the login portal, sidebar header, and browser tab (`favicon.svg`).
*   **Centered Page Titles:** Standardized headers across the Dashboard, Products Inventory, and Sales pages to be centered on the screen for a balanced interface.
*   **Searchable Product Selection in Sales:** Provides a text search field next to the product dropdown when registering a sale. Typing in the search field filters the dropdown list instantly.
*   **Product Editing and SKU Updates:** The SKU (Stock Keeping Unit) input field is fully editable inside the Product modal form, allowing complete updates to existing catalog items.
*   **Dynamic UI Restriction:** Elements (such as the Add Product button or the Dashboard sidebar link) hide automatically depending on the user's role permissions.

---

## 5. How to Run

### Prerequisites
*   Node.js (v18+) installed.
*   The `mini-erp-backend` running on `http://localhost:5000` (Axios is preconfigured to route backend requests to this port).

### Steps
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start development server:**
    ```bash
    npm run dev
    ```
    The application will run on `http://localhost:5173`. Open this URL in your web browser.

3.  **Build for Production:**
    ```bash
    npm run build
    ```
    Previews are run via:
    ```bash
    npm run preview
    ```

---

## 6. Credentials

Use the following demo accounts to test different roles and permissions in the portal:

| Role     | Email             | Password      | Access Permissions |
| :------- | :---------------- | :------------ | :----------------- |
| **Admin**    | `admin@erp.com`     | `Password123!`  | Full access to Dashboard, Sales Invoice, and Products Management |
| **Manager**  | `manager@erp.com`   | `Password123!`  | Full access to Dashboard, Sales Invoice, and Products Management |
| **Employee** | `employee@erp.com`  | `Password123!`  | Access to Products List (view only) and Sales Checkout (create invoices) |
