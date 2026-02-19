import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  LayoutAnimation
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const url_local = process.env.EXPO_PUBLIC_API_LOCAL_URL;

export default function ListaRechazos() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const { token } = useAuth();

  const fetchRechazos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url_local}/rechazos`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await response.json();
      if (json.ok) setHistorial(json.data);
    } catch (error) {
      console.error("Error cargando rechazos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRechazos(); }, []);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const procesarDatos = () => {
    let filtrados = historial.filter(item => 
      item.cod_venta.toString().includes(busqueda) || 
      item.defecto_detectado.toLowerCase().includes(busqueda.toLowerCase())
    );
    filtrados.sort((a, b) => {
      const fechaA = new Date(a.fecha_rechazo);
      const fechaB = new Date(b.fecha_rechazo);
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });
    return agruparPorVenta(filtrados);
  };

  const agruparPorVenta = (data) => {
    if (!data || data.length === 0) return [];
    const grupos = data.reduce((acc, item) => {
      const key = item.id?.toString() || `${item.cod_venta}_${item.nro_item}_${item.fecha_rechazo}`;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          cod_venta: item.cod_venta,
          fechaLabel: new Date(item.fecha_rechazo).toLocaleDateString('es-ES'),
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
    <View style={{ flex: 1, backgroundColor: '#f4f6f8' }}>
      <View style={localStyles.filterPanel}>
        <TextInput 
          style={localStyles.searchInput}
          placeholder="Código de venta o defecto"
          value={busqueda}
          onChangeText={setBusqueda}
          placeholderTextColor="#9aa0a6"
        />
        <TouchableOpacity 
          style={localStyles.orderBtn} 
          onPress={() => setOrdenAscendente(!ordenAscendente)}
        >
          <Text style={localStyles.orderBtnText}>
            {ordenAscendente ? "Más Recientes" : "Más Antiguos"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={localStyles.container} showsVerticalScrollIndicator={false}>
        <Text style={localStyles.mainTitle}>Historial de Rechazos</Text>
        
        {datosAMostrar.map((grupo) => {
          const isExpanded = expandedId === grupo.id;
          
          return (
            <View key={grupo.id} style={localStyles.cardWrapper}>
              <TouchableOpacity 
                style={[localStyles.compactRow, isExpanded && localStyles.activeRow]} 
                onPress={() => toggleExpand(grupo.id)}
                activeOpacity={0.7}
              >
                <View style={localStyles.rowHeader}>
                  <View style={localStyles.topInfo}>
                    <Text style={localStyles.codVentaText}>
                      cod: {grupo.cod_venta}-{grupo.items[0].nro_item}
                    </Text>
                    <Text style={localStyles.miniVendedorText}>ID Vend: {grupo.id_vendedor}</Text>
                  </View>

                  <View style={localStyles.bottomInfo}>
                    <Text style={localStyles.miniFechaText}>{grupo.fechaLabel}  </Text>
                    <Text style={localStyles.miniMotivoText} numberOfLines={1}>
                       Defecto: {grupo.items[0].defecto_detectado}
                    </Text>
                  </View>
                </View>

                <View style={[localStyles.arrowCircle, isExpanded && localStyles.arrowCircleActive]}>
                  <Text style={[localStyles.arrow, isExpanded && localStyles.arrowActive]}>
                    {isExpanded ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={localStyles.expandedDetail}>
                  <Text style={localStyles.fullDateText}>Fecha: {grupo.fechaLabel}</Text>
                  <View style={localStyles.itemsList}>
                    {grupo.items.map((item, idx) => (
                      <View key={idx} style={localStyles.itemRow}>
                        <View style={localStyles.itemDot} />
                        <View style={{ flex: 1 }}>
                          <Text style={localStyles.itemCodeText}>
                            Item #{item.nro_item} <Text style={localStyles.dimMini}>{item.dim_ancho}x{item.dim_alto}mm</Text>
                          </Text>
                          <Text style={localStyles.planoText}>Plano: {item.plano}</Text>
                          <Text style={localStyles.motivoText}>Motivo Rechazo: {item.defecto_detectado}</Text>
                          {item.comentarios ? <Text style={localStyles.obsText}>Obs: {item.comentarios}</Text> : null}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        })}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  filterPanel: { 
    flexDirection: 'row', padding: 15, backgroundColor: '#fff', 
    borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center', marginTop: 40 
  },
  searchInput: { 
    flex: 1, backgroundColor: '#f1f3f4', paddingHorizontal: 15, paddingVertical: 8, 
    borderRadius: 8, marginRight: 10, color: '#000'
  },
  orderBtn: { backgroundColor: '#1a73e8', padding: 10, borderRadius: 8 },
  orderBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#1a1c1e', marginBottom: 20 },
  cardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  compactRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeRow: { backgroundColor: '#f8faff', borderBottomWidth: 1, borderBottomColor: '#eef2f6' },
  rowHeader: { flex: 1 },
  topInfo: { flexDirection: 'row', alignItems: 'baseline' },
  bottomInfo: { flexDirection: 'row', alignItems: 'center', marginTop: -2 },
  codVentaText: { fontSize: 14, fontWeight: 'bold', color: '#1a73e8', marginRight: 8 },
  miniVendedorText: { fontSize: 11, color: '#5f6368', fontWeight: '500' },
  miniFechaText: { fontSize: 10, color: '#9aa0a6' },
  miniMotivoText: { fontSize: 10, color: 'rgb(80,80,80)', flex: 1, fontStyle: 'italic' },
  arrowCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#f1f3f4', alignItems: 'center', justifyContent: 'center',
  },
  arrowCircleActive: { backgroundColor: '#1a73e8' },
  arrow: { fontSize: 8, color: '#5f6368' },
  arrowActive: { color: '#fff' },
  expandedDetail: { padding: 14, backgroundColor: '#fff' },
  fullDateText: { fontSize: 10, color: '#1a73e8', marginBottom: 8, fontWeight: 'bold' },
  itemsList: { borderTopWidth: 1, borderTopColor: '#f1f3f4', paddingTop: 10 },
  itemRow: { flexDirection: 'row', marginBottom: 12 },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'white', marginTop: 6, marginRight: 10 },
  itemCodeText: { fontSize: 13, fontWeight: 'bold', color: '#3c4043' },
  dimMini: { fontWeight: '400', color: '#70757a', fontSize: 11 },
  planoText: { fontSize: 11, color: '#5f6368' },
  motivoText: { fontSize: 12, color: '#1a1c1e', fontWeight: '600' },
  obsText: { fontSize: 11, color: '#70757a', fontStyle: 'italic' },
});
