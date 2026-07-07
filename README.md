# Mini ERP — Inventory & Sales Management System (Frontend)

A modern, responsive, and aesthetic React-based dashboard client for the Mini ERP System, facilitating stock control, product catalog management, and sales transactions.

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
