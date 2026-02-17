import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useAuth } from '../context/AuthContext';


const host_url_local = "localhost"
const host_url_externa="186.67.187.227";

const url_ext = process.env.EXPO_PUBLIC_API_EXT_URL;
const url_local = process.env.EXPO_PUBLIC_API_LOCAL_URL;

export default function ListaRechazos() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(false); // Default: más recientes primero

  const { token, user } = useAuth();

  // 1. Llamada a la API
  const fetchRechazos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url_local}/rechazos`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
      const json = await response.json();
      if (json.ok) {
        setHistorial(json.data);
      }
    } catch (error) {
      console.error("Error cargando rechazos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRechazos();
  }, []);

  // 2. Lógica de Filtrado y Ordenado
  const procesarDatos = () => {
    // Filtrar por Código de Venta o Defecto
    let filtrados = historial.filter(item => 
      item.cod_venta.toString().includes(busqueda) || 
      item.defecto_detectado.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Ordenar por fecha
    filtrados.sort((a, b) => {
      const fechaA = new Date(a.fecha_rechazo);
      const fechaB = new Date(b.fecha_rechazo);
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });

    return agruparPorVenta(filtrados);
  };

  // 3. Tu función de agrupación (mantenida)
  const agruparPorVenta = (data) => {
    if (!data || data.length === 0) return [];
    const grupos = data.reduce((acc, item) => {
      const fechaCorta = new Date(item.fecha_rechazo).toLocaleString().slice(0, -3);
      const key = `${item.cod_venta}_${fechaCorta}`;
      if (!acc[key]) {
        acc[key] = {
          cod_venta: item.cod_venta,
          fecha: new Date(item.fecha_rechazo).toLocaleString(),
          id_vendedor: item.id_vendedor,
          items: []
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {});
    return Object.values(grupos);
  };

  const datosAMostrar = procesarDatos();

  if (loading) return <ActivityIndicator size="large" color="#1a73e8" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1 }}>
      {/* --- PANEL DE CONTROL --- */}
      <View style={localStyles.filterPanel}>
        <TextInput 
          style={localStyles.searchInput}
          placeholder="Buscar por venta o defecto..."
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity 
          style={localStyles.orderBtn} 
          onPress={() => setOrdenAscendente(!ordenAscendente)}
        >
          <Text style={localStyles.orderBtnText}>
            {ordenAscendente ? "↑ Antiguos" : "↓ Recientes"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={localStyles.container} showsVerticalScrollIndicator={false}>
        <Text style={localStyles.mainTitle}>Historial de Rechazos</Text>
        
        {datosAMostrar.length === 0 ? (
          <View style={localStyles.emptyState}>
            <Text style={localStyles.emptyStateText}>No se encontraron resultados.</Text>
          </View>
        ) : (
          datosAMostrar.map((grupo, index) => (
            <View key={index} style={localStyles.timelineCard}>
              <View style={localStyles.cardHeader}>
                <View>
                  <Text style={localStyles.dateText}>{grupo.fecha}</Text>
                  <Text style={localStyles.notaText}>Cod Venta: {grupo.cod_venta}</Text>
                  <Text style={localStyles.vendedorText}>Id Vendedor: {grupo.id_vendedor}</Text>
                </View>
              </View>

              <View style={localStyles.itemsList}>
                {grupo.items.map((item, idx) => (
                  <View key={idx} style={localStyles.itemRow}>
                    <View style={localStyles.itemDot} />
                    <View style={{ flex: 1 }}>
                      <Text style={localStyles.itemCodeText}>
                        Item #{item.nro_item} <Text style={localStyles.dimMini}>{item.dim_ancho}x{item.dim_alto}mm</Text>
                      </Text>
                      <Text style={localStyles.planoText}>Plano: {item.plano}</Text>
                      <Text style={localStyles.motivoText}>Razon: {item.defecto_detectado}</Text>
                      {item.comentarios ? <Text style={localStyles.obsText}>Obs: {item.comentarios}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 15 },
  filterPanel: { 
    flexDirection: 'row', 
    padding: 15, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee',
    alignItems: 'center',
    marginTop: 40 // Ajuste para notch
  },
  searchInput: { 
    flex: 1, 
    backgroundColor: '#f1f3f4', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 8,
    marginRight: 10
  },
  orderBtn: { backgroundColor: '#1a73e8', padding: 10, borderRadius: 8 },
  orderBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  // ... tus otros estilos se mantienen igual ...
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1c1e', marginBottom: 20 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyStateText: { color: '#9aa0a6', fontSize: 16 },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dateText: { fontSize: 11, color: '#70757a', fontWeight: 'bold' },
  notaText: { fontSize: 18, fontWeight: 'bold', color: '#1a73e8' },
  vendedorText: { fontSize: 12, color: '#5f6368' },
  countBadge: { backgroundColor: '#e8f0fe', paddingHorizontal: 12, borderRadius: 20, height: 25, justifyContent: 'center' },
  countText: { fontSize: 10, fontWeight: 'bold', color: '#1a73e8' },
  itemsList: { borderTopWidth: 1, borderTopColor: '#f1f3f4', paddingTop: 12 },
  itemRow: { flexDirection: 'row', marginBottom: 15 },
  itemDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d93025', marginTop: 5, marginRight: 12 },
  itemCodeText: { fontSize: 14, fontWeight: 'bold', color: '#3c4043' },
  dimMini: { fontWeight: '400', color: '#70757a', fontSize: 12 },
  planoText: { fontSize: 12, color: '#5f6368' },
  motivoText: { fontSize: 13, color: '#1a1c1e', fontWeight: '600' },
  obsText: { fontSize: 12, color: '#70757a', fontStyle: 'italic' },
});