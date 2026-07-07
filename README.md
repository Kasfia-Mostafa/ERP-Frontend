# Mini ERP — Inventory & Sales Management System (Frontend)

A modern, fully responsive, and aesthetic React-based dashboard client for the Mini ERP System, facilitating stock control, product catalog management, sales transactions, and user administration across all device sizes.

---

## 1. About the Project
This frontend application provides an intuitive workspace for ERP users (Admins, Managers, and Employees). It adapts the UI features dynamically based on user roles and permissions. Users can manage inventory products, search and register sales via an autocomplete interface, analyze key business metrics on the dashboard, configure catalog items, and Admins can manage other user accounts. The interface is fully responsive — optimized for desktop, tablet, and mobile.

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
│   └── favicon.svg             # Page tab icon (generated matching the Boxes brand logo)
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # App shell: collapsible sidebar (desktop) + mobile drawer nav
│   │   ├── ProductForm.tsx     # Add/Edit product modal dialog — vintage styled grid
│   │   ├── UserForm.tsx        # Add/Edit user modal dialog — vintage styled grid
│   │   └── ProtectedRoute.tsx  # Guard container checking user RBAC authorization
│   ├── context/
│   │   └── AuthContext.tsx     # Global Auth state, Axios base settings, login & logout actions
│   ├── pages/
│   │   ├── Dashboard.tsx       # Metrics summary cards and responsive low-stock alert table
│   │   ├── Login.tsx           # Authentication login portal
│   │   ├── Products.tsx        # Paginated products inventory — card list (mobile) / table (desktop)
│   │   ├── Sales.tsx           # Autocomplete product search checkout form and sales invoices log
│   │   └── Users.tsx           # User management view for Admins
│   ├── App.tsx                 # Client routers and context wrapper bootstrapper
│   ├── index.css               # Tailwind CSS declarations and layout styling rules
│   └── main.tsx                # Client entrypoint
├── index.html                  # Core HTML file
├── vercel.json                 # Vercel SPA routing rewrites
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configurations
├── vite.config.ts              # Vite server settings
└── package.json                # Project dependencies
```

---

## 4. Features

### Navigation & Layout
*   **Responsive Sidebar with Mobile Drawer:** On desktop, the sidebar collapses/expands with a chevron toggle button (`ChevronsLeft`/`ChevronsRight`) and smooth transitions. On mobile, the sidebar slides in as a full-height overlay drawer.
*   **Static Footer Profile:** The user profile section (name, role badge, logout button) is fixed at the bottom of the sidebar.
*   **Sticky Mobile Top Bar:** On mobile, a sticky header shows the brand logo, a hamburger menu button, and the current user's role badge.

### User Management (Admin Only)
*   **User Directory:** A responsive dual-layout (cards on mobile, table on desktop) listing all registered users, their roles, and status.
*   **User Form Modal:** Allows Admins to create new users, select their roles dynamically from the backend, update details, or toggle active/inactive status.
*   **Secure Access:** Protected by the `manage_users` permission.

### Products Page
*   **Responsive Table:** On mobile (`< md`), products are displayed as compact **card items** showing name, SKU, category, prices, stock badge, and action buttons. On desktop (`≥ md`), a full-width **sortable table** is rendered.
*   **Paginated Inventory:** Server-side pagination (8 items per page) with Previous/Next navigation.
*   **Search & Category Filter:** Instant-filtered product listing by name/SKU and category dropdown.
*   **Editable SKU:** The SKU field is fully editable inside the Product modal.

### Sales Page
*   **Autocomplete Product Search:** Typing in the Search Product field shows a live dropdown suggestion list filtered by name or SKU. Out-of-stock items are disabled automatically.
*   **Click-Outside to Close:** The suggestion dropdown closes automatically when clicking anywhere outside it.
*   **Invoice Item Responsiveness:** Checkout item rows stack vertically on mobile with quantity controls and subtotals adapting to narrow viewports.

### Dashboard Page
*   **Responsive Low-Stock Table:** Same dual-layout pattern as Products — card list on mobile, full table on desktop.
*   **Stats Cards Grid:** 2-column on tablet, 4-column on desktop, single column on mobile.

### General
*   **Vintage Styling UI:** The app is styled with a premium vintage aesthetic featuring beige backgrounds (`#FAF6ED`), gold borders (`#bba377`), and serif fonts (`Playfair Display` & `Outfit`).
*   **Dynamic UI Restriction:** Elements (Add Product button, Users sidebar link) hide automatically based on the logged-in user's RBAC permissions.
*   **Vercel SPA Routing:** Handles direct URL reloads cleanly without 404 errors using `vercel.json` rewrites.

---

## 5. How to Run

### Prerequisites
*   Node.js (v18+) installed.
*   The `mini-erp-backend` running on `http://localhost:5000` (Axios is preconfigured to route backend requests to this port locally).

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
| **Admin**    | `admin@erp.com`     | `Password123!`  | Full access to Dashboard, Sales, Products, and User Management |
| **Manager**  | `manager@erp.com`   | `Password123!`  | Full access to Dashboard, Sales, and Products |
| **Employee** | `employee@erp.com`  | `Password123!`  | Access to Products List (view only) and Sales Checkout (create invoices) |
