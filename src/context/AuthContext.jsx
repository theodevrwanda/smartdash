
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch extended user profile from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();

                        // User Request: "focus... only role and user infor"
                        // We prioritize role and key identity info.
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...userData,
                            // Ensure role is present, default to 'user' if missing, though it should be there.
                            role: userData.role || 'user'
                        });
                    } else {
                        // Fallback if no firestore doc (shouldn't happen for admin)
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: 'user'
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Keep basic auth even if profile fetch fails
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        role: 'user'
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const value = {
        user,
        loading,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
