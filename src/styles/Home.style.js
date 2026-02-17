import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { 
    paddingTop: 50, paddingBottom: 20, backgroundColor: '#007AFF', 
    flexDirection: 'row', justifyContent: 'space-around' 
  },
  tabButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  activeTab: { backgroundColor: 'white' },
  tabText: { color: 'white', fontWeight: 'bold' },
  activeTabText: { color: '#007AFF' },
  
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  
  // Estilos Formulario
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  productItem: { 
    padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' 
  },
  rejectedItem: { backgroundColor: '#ffebee', borderColor: '#ef5350', borderWidth: 1, borderRadius: 8 },
  
  // Botones
  btnPrimary: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnSuccess: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  btnSave: { backgroundColor: '#e91e63', padding: 18, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  textWhite: { color: 'white', fontWeight: 'bold' },
  
  previewImg: { width: '100%', height: 150, borderRadius: 10, marginTop: 10 }
});