import admin from 'firebase-admin';

admin.initializeApp({
  projectId: 'luqman-a72f8'
});

const db = admin.firestore();

async function checkOrders() {
  try {
    const ordersRef = db.collection('orders');
    console.log('Querying orders without index...');
    const snapshot = await ordersRef.limit(5).get();
    console.log(`Found ${snapshot.size} orders total.`);

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`Order ID: ${doc.id}`);
      console.log(`Customer UserID: ${data.customer?.userId}`);
      console.log(`Date: ${data.date ? data.date.toDate() : 'null'}`);
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

checkOrders();
