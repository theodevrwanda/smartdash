
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, query, where, orderBy, getDoc } from 'firebase/firestore';

export const adminService = {
    // Fetch dashboard statistics
    // Fetch dashboard statistics
    async fetchDashboardStats() {
        try {
            const businessesSnapshot = await getDocs(collection(db, 'businesses'));
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const paymentsSnapshot = await getDocs(collection(db, 'payments'));

            const businesses = businessesSnapshot.docs.map(doc => doc.data());
            const users = usersSnapshot.docs.map(doc => doc.data());
            const payments = paymentsSnapshot.docs.map(doc => doc.data());

            // 1. Business Stats
            const businessStats = {
                total: businesses.length,
                active: businesses.filter(b => b.isActive).length,
                inactive: businesses.filter(b => !b.isActive).length,
                byPlan: {
                    free: businesses.filter(b => b.subscription?.plan === 'free').length,
                    monthly: businesses.filter(b => b.subscription?.plan === 'month').length,
                    yearly: businesses.filter(b => b.subscription?.plan === 'year').length,
                    forever: businesses.filter(b => b.subscription?.plan === 'forever').length
                }
            };

            // 2. User Stats
            const userStats = {
                total: users.length,
                active: users.filter(u => u.isActive).length,
                inactive: users.filter(u => !u.isActive).length,
                admin: users.filter(u => u.role === 'admin').length,
                staff: users.filter(u => u.role === 'staff').length
            };

            // 3. Payment Stats
            const paymentStats = {
                total: payments.length,
                pending: payments.filter(p => p.status === 'pending').length,
                approved: payments.filter(p => p.status === 'approved').length,
                rejected: payments.filter(p => p.status === 'rejected').length,
                revenue: payments
                    .filter(p => p.status === 'approved')
                    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
            };

            // 4. Charts Data preparation

            // Business Growth (Monthly) - Simplified Logic: using createdAt
            const businessesByMonth = {};
            businesses.forEach(b => {
                const date = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date();
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                businessesByMonth[key] = (businessesByMonth[key] || 0) + 1;
            });
            const businessGrowthData = Object.entries(businessesByMonth)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([name, value]) => ({ name, value }))
                .slice(-6); // Last 6 months

            // Payments Over Time
            const paymentsByMonth = {};
            payments.forEach(p => {
                const date = p.createdAt ? (p.createdAt.toDate ? p.createdAt.toDate() : new Date(p.createdAt)) : new Date();
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                paymentsByMonth[key] = (paymentsByMonth[key] || 0) + (Number(p.amount) || 0);
            });
            const paymentsGrowthData = Object.entries(paymentsByMonth)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([name, value]) => ({ name, value }))
                .slice(-6);

            return {
                businessStats,
                userStats,
                paymentStats,
                businessGrowthData,
                paymentsGrowthData
            };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    },

    // Fetch all businesses with owner details
    async fetchAllBusinesses() {
        try {
            const businessesSnapshot = await getDocs(collection(db, 'businesses'));
            const businesses = await Promise.all(businessesSnapshot.docs.map(async (businessDoc) => {
                const businessData = businessDoc.data();
                let ownerName = 'Unknown';
                let ownerEmail = 'N/A';

                if (businessData.ownerId) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', businessData.ownerId));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            ownerName = userData.fullName || userData.firstName + ' ' + userData.lastName;
                            ownerEmail = userData.email;
                        }
                    } catch (e) {
                        console.log("Error fetching owner details", e);
                    }
                }

                return {
                    id: businessDoc.id,
                    ...businessData,
                    ownerName,
                    ownerEmail,
                    plan: businessData.subscription?.plan || 'free',
                    status: businessData.isActive ? 'Active' : 'Inactive'
                };
            }));
            return businesses;
        } catch (error) {
            console.error("Error fetching businesses:", error);
            throw error;
        }
    },

    // Toggle business status
    async updateBusinessStatus(businessId, isActive) {
        try {
            const businessRef = doc(db, 'businesses', businessId);
            await updateDoc(businessRef, {
                isActive: isActive
            });
            return true;
        } catch (error) {
            console.error("Error updating business status:", error);
            throw error;
        }
    },

    // Update business plan
    async updateBusinessPlan(businessId, planType) {
        try {
            const businessRef = doc(db, 'businesses', businessId);
            // Also need to update endDate based on plan possibly, but for now just validation of plan
            await updateDoc(businessRef, {
                'subscription.plan': planType,
                'subscription.status': 'active'
            });
            return true;
        } catch (error) {
            console.error("Error updating business plan:", error);
            throw error;
        }
    },

    // Fetch all branches with business details
    async fetchBranches() {
        try {
            const branchesSnapshot = await getDocs(collection(db, 'branches'));
            const branches = await Promise.all(branchesSnapshot.docs.map(async (branchDoc) => {
                const branchData = branchDoc.data();
                let businessName = 'Unknown';

                if (branchData.businessId) {
                    try {
                        const businessDoc = await getDoc(doc(db, 'businesses', branchData.businessId));
                        if (businessDoc.exists()) {
                            businessName = businessDoc.data().businessName;
                        }
                    } catch (e) {
                        console.log("Error fetching business for branch", e);
                    }
                }

                // Construct location from available fields
                const locationParts = [branchData.sector, branchData.district].filter(Boolean);
                const location = locationParts.length > 0 ? locationParts.join(', ') : (branchData.location || 'N/A');

                return {
                    id: branchDoc.id,
                    ...branchData,
                    name: branchData.branchName || branchData.name || 'Unnamed Branch', // Ensure name property exists
                    location,
                    businessName
                };
            }));
            return branches;
        } catch (error) {
            console.error("Error fetching branches:", error);
            throw error;
        }
    },

    // Fetch all employees (users with businessId)
    async fetchEmployees() {
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));

            // Pre-fetch all branches to create a lookup map (optimization)
            const branchesSnapshot = await getDocs(collection(db, 'branches'));
            const branchMap = {};
            branchesSnapshot.docs.forEach(doc => {
                const bData = doc.data();
                branchMap[doc.id] = bData.branchName || bData.name || 'Unknown Branch';
            });

            const employees = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
                const userData = userDoc.data();
                let businessName = 'N/A';

                if (userData.businessId) {
                    try {
                        const businessDoc = await getDoc(doc(db, 'businesses', userData.businessId));
                        if (businessDoc.exists()) {
                            businessName = businessDoc.data().businessName;
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                // Resolve branch name from ID
                const branchId = userData.branch || null;
                let branchName = 'N/A';

                if (branchId && branchMap[branchId]) {
                    branchName = branchMap[branchId];
                }

                return {
                    id: userDoc.id,
                    ...userData,
                    businessName,
                    branch: branchId, // Keep the ID
                    branchName: branchName // Resolved Name
                };
            }));

            return employees.filter(u => u.businessId);
        } catch (error) {
            console.error("Error fetching employees:", error);
            throw error;
        }
    },

    // Fetch transactions/payments with business details
    async fetchTransactions() {
        try {
            const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const transactions = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                let businessName = data.businessName || 'Unknown'; // Use stored name if available
                let ownerName = 'Unknown';

                if (data.businessId && businessName === 'Unknown') {
                    try {
                        const businessDoc = await getDoc(doc(db, 'businesses', data.businessId));
                        if (businessDoc.exists()) {
                            const bData = businessDoc.data();
                            businessName = bData.businessName;
                        }
                    } catch (e) { console.log("Error fetching txn details", e); }
                }

                // Try to resolve owner name from business ownerId or if stored in payment?
                // Payment data has userId, let's try to fetch user if ownerName is needed
                if (data.userId) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', data.userId));
                        if (userDoc.exists()) {
                            const uData = userDoc.data();
                            ownerName = uData.fullName || `${uData.firstName} ${uData.lastName}`;
                        }
                    } catch (e) { }
                }

                return {
                    id: docSnap.id,
                    ...data,
                    businessName,
                    ownerName
                };
            }));

            return transactions;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return [];
        }
    },

    // Approve transaction
    async approveTransaction(transactionId, businessId, plan) {
        try {
            // Update transaction status
            const transactionRef = doc(db, 'payments', transactionId);
            await updateDoc(transactionRef, {
                status: 'approved'
            });

            // Update business plan
            await this.updateBusinessPlan(businessId, plan);

            return true;
        } catch (error) {
            console.error("Error approving transaction:", error);
            throw error;
        }
    },

    // Reject transaction
    async rejectTransaction(transactionId, reason) {
        try {
            const transactionRef = doc(db, 'payments', transactionId);
            await updateDoc(transactionRef, {
                status: 'rejected',
                rejectionReason: reason
            });
            return true;
        } catch (error) {
            console.error("Error rejecting transaction:", error);
            throw error;
        }
    }
};
