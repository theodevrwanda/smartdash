
export const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", plan: "Premium", status: "Active", branch: "Main Branch", joined: "2023-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", plan: "Basic", status: "Pending", branch: "Downtown", joined: "2023-02-10" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", plan: "Free", status: "Active", branch: "Main Branch", joined: "2023-03-05" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Manager", plan: "Premium", status: "Deleted", branch: "Uptown", joined: "2023-04-20" },
    { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "User", plan: "Basic", status: "Active", branch: "Downtown", joined: "2023-05-12" },
];

export const transactions = [
    { id: "TXN001", user: "John Doe", amount: 120.50, date: "2023-10-01", status: "Completed", type: "Payment" },
    { id: "TXN002", user: "Jane Smith", amount: 50.00, date: "2023-10-02", status: "Pending", type: "Subscription" },
    { id: "TXN003", user: "Bob Johnson", amount: 75.00, date: "2023-10-03", status: "Failed", type: "Payment" },
    { id: "TXN004", user: "Alice Brown", amount: 200.00, date: "2023-10-04", status: "Completed", type: "Refund" },
    { id: "TXN005", user: "John Doe", amount: 15.00, date: "2023-10-05", status: "Completed", type: "Fee" },
];

export const branches = [
    { id: 1, name: "Main Branch", location: "New York", manager: "Sarah Connor", employees: 12 },
    { id: 2, name: "Downtown", location: "Los Angeles", manager: "Kyle Reese", employees: 8 },
    { id: 3, name: "Uptown", location: "Chicago", manager: "T-800", employees: 5 },
];

export const employees = [
    { id: 1, name: "Sarah Connor", position: "Branch Manager", branch: "Main Branch", email: "sarah@company.com" },
    { id: 2, name: "Kyle Reese", position: "Branch Manager", branch: "Downtown", email: "kyle@company.com" },
    { id: 3, name: "T-800", position: "Security", branch: "Uptown", email: "t800@company.com" },
];

export const logs = [
    { id: 1, action: "User Login", user: "John Doe", timestamp: "2023-10-01 09:00:00", details: "Logged in from IP 192.168.1.1" },
    { id: 2, action: "Function Execution", user: "System", timestamp: "2023-10-01 09:05:00", details: "Daily backup completed" },
    { id: 3, action: "User Created", user: "Admin", timestamp: "2023-10-02 10:00:00", details: "Created user Jane Smith" },
    { id: 4, action: "Payment Failed", user: "Bob Johnson", timestamp: "2023-10-03 14:30:00", details: "Insufficient funds" },
];

export const stats = {
    totalUsers: 1250,
    activeUsers: 890,
    totalRevenue: "$45,231.89",
    pendingApprovals: 5,
};
