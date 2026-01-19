
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, query, where, orderBy, getDoc, deleteDoc } from 'firebase/firestore';

export const adminService = {
    // Fetch Audit Logs (Transactions collection)
    async fetchAuditLogs(businessId = null, branchId = null) {
        try {
            let q = collection(db, 'transactions');
            const constraints = [];

            if (businessId) {
                constraints.push(where('businessId', '==', businessId));
            }
            if (branchId) {
                constraints.push(where('branchId', '==', branchId));
            }

            constraints.push(orderBy('createdAt', 'desc'));
            const finalQuery = query(q, ...constraints);

            const snapshot = await getDocs(finalQuery);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching audit logs", error);
            // If it's an index error, suggest the user to create an index
            if (error.code === 'failed-precondition') {
                console.warn("Firestore requires a composite index for this query. Falling back to client-side filtering.");
                const snapshot = await getDocs(collection(db, 'transactions'));
                let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (businessId) data = data.filter(d => d.businessId === businessId);
                if (branchId) data = data.filter(d => d.branchId === branchId);

                return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            return [];
        }
    },

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
                    free: businesses.filter(b => (b.subscription?.plan || '').toLowerCase() === 'free').length,
                    monthly: businesses.filter(b => ['monthly', 'month'].includes((b.subscription?.plan || '').toLowerCase())).length,
                    annually: businesses.filter(b => ['annually', 'yearly', 'year'].includes((b.subscription?.plan || '').toLowerCase())).length,
                    forever: businesses.filter(b => (b.subscription?.plan || '').toLowerCase() === 'forever').length
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

            const startDate = new Date();
            let endDate = new Date();

            const duration = planType.toLowerCase();

            if (duration === 'monthly') {
                endDate.setDate(startDate.getDate() + 30);
            } else if (duration === 'annually' || duration === 'yearly' || duration === 'year') {
                endDate.setDate(startDate.getDate() + 365);
            } else if (duration === 'forever') {
                endDate.setFullYear(startDate.getFullYear() + 100);
            } else if (duration === 'free') {
                endDate.setDate(startDate.getDate() + 30); // 30 days for free plan
            } else {
                // Default to 1 month if unknown
                endDate.setDate(startDate.getDate() + 30);
            }

            await updateDoc(businessRef, {
                'subscription.plan': planType,
                'subscription.status': 'active',
                'subscription.startDate': startDate.toISOString(),
                'subscription.endDate': endDate.toISOString(),
                'isActive': true // reactivate business if it was expired
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
    async fetchAllEmployees() {
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

                if (data.businessId) {
                    try {
                        const businessDoc = await getDoc(doc(db, 'businesses', data.businessId));
                        if (businessDoc.exists()) {
                            const bData = businessDoc.data();
                            businessName = bData.businessName;

                            // If ownerName is still unknown, try to get it from business ownerId
                            if (ownerName === 'Unknown' && bData.ownerId) {
                                const userDoc = await getDoc(doc(db, 'users', bData.ownerId));
                                if (userDoc.exists()) {
                                    const uData = userDoc.data();
                                    ownerName = uData.fullName || `${uData.firstName} ${uData.lastName}`;
                                }
                            }
                        }
                    } catch (e) { console.log("Error fetching txn details", e); }
                }

                // Fallback: Try to resolve owner name from userId in payment if still unknown
                if (ownerName === 'Unknown' && data.userId) {
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
            // Update business plan and dates first
            await this.updateBusinessPlan(businessId, plan);

            // Update transaction status
            const transactionRef = doc(db, 'payments', transactionId);
            await updateDoc(transactionRef, {
                status: 'approved',
                approvedAt: new Date().toISOString()
            });

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
    },

    // Update business details
    async updateBusinessDetails(businessId, details) {
        try {
            const businessRef = doc(db, 'businesses', businessId);
            await updateDoc(businessRef, details);
            return true;
        } catch (error) {
            console.error("Error updating business details:", error);
            throw error;
        }
    },

    // Delete business
    async deleteBusiness(businessId) {
        try {
            const businessRef = doc(db, 'businesses', businessId);
            await deleteDoc(businessRef);
            return true;
        } catch (error) {
            console.error("Error deleting business:", error);
            throw error;
        }
    },

    // Generic Update
    async updateDocument(collectionName, id, data) {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, data);
            return true;
        } catch (error) {
            console.error(`Error updating document in ${collectionName}:`, error);
            throw error;
        }
    },

    // Generic Delete
    async deleteDocument(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            console.error(`Error deleting document in ${collectionName}:`, error);
            throw error;
        }
    },

    // Specific Branch Actions
    async deleteBranch(id) {
        return this.deleteDocument('branches', id);
    },

    async updateBranch(id, data) {
        return this.updateDocument('branches', id, {
            ...data,
            updatedAt: new Date().toISOString()
        });
    },

    async fetchUsersByBusiness(businessId) {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('businessId', '==', businessId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching users by business:", error);
            throw error;
        }
    },

    async assignUserToBranch(userId, branchId) {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                branch: branchId,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Error assigning user to branch:", error);
            throw error;
        }
    }
};
