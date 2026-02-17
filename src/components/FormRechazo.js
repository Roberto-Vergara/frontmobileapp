import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  Alert, ActivityIndicator, ScrollView, StyleSheet 
} from 'react-native';
import axios from "axios";
import ModalRechazo from './PantallaRechazo'; 
import {useRechazoCache} from "../context/RechazoContext"

// const API_URL = "http://186.67.187.227:3001/auth";
const host_url_local = "localhost"
const host_url_externa="186.67.187.227";

const url_ext = process.env.EXPO_PUBLIC_API_EXT_URL;
const url_local = process.env.EXPO_PUBLIC_API_LOCAL_URL;


export default function FormRechazo() {
  // Consumimos el estado global del contexto
  const { 
    cacheNota, setCacheNota, 
    cacheSearch, setCacheSearch, 
    cacheSelecteds, setCacheSelecteds,
    limpiarCache 
  } = useRechazoCache();

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  const formatearFecha = (fechaNum) => {
    if (!fechaNum) return "";
    const str = fechaNum.toString();
    if (str.length !== 6) return str;
    const yy = str.substring(0, 2);
    const mm = str.substring(2, 4);
    const dd = str.substring(4, 6);
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${dd} ${meses[parseInt(mm) - 1]} 20${yy}`;
  };

  const buscarNota = async () => {
    if (!cacheSearch) return Alert.alert("Atención", "Ingresa un código de venta");
    setLoading(true);
    
    try {
      const partes = cacheSearch.split('-');
      const codVenta = partes[0].trim();
      const nroItemBusqueda = partes[1] ? partes[1].trim() : null;

      let url = `${url_local}/ventas/${codVenta}`;
      if (nroItemBusqueda) url += `/${nroItemBusqueda}`;

      const response = await axios.get(url);
      const res = response.data.data;

      if (res && res.cab_venta && res.cab_venta.length > 0) {
        // Guardamos en el contexto (se reemplaza lo anterior)
        setCacheNota({ 
          cabecera: res.cab_venta[0], 
          items: Array.isArray(res.det_venta) ? res.det_venta : [res.det_venta] 
        });
        setCacheSelecteds([]); // Al buscar una nota nueva, reseteamos los seleccionados
      } else {
        Alert.alert("No encontrado", "No existe registro para esta búsqueda.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const manejarPresionItem = (item) => {
    const existe = cacheSelecteds.find(s => s.NRO_ITEM === item.NRO_ITEM);
    if (existe) {
      setCacheSelecteds(prev => prev.filter(i => i.NRO_ITEM !== item.NRO_ITEM));
    } else {
      setItemSeleccionado(item);
      setModalVisible(true);
    }
  };

  const confirmarRechazo = (datosDelModal) => {
    setCacheSelecteds(prev => [...prev, datosDelModal]);
    setModalVisible(false);
    setItemSeleccionado(null);
  };

  const guardarFinal = async () => {
    if (cacheSelecteds.length === 0) return Alert.alert("Atención", "No hay ítems para rechazar.");
    setLoading(true);
    try {
      const url = `${url_local}/rechazos`; 
      const response = await axios.post(url, cacheSelecteds);

      if (response.data.ok) {
        Alert.alert("Éxito", response.data.msg);
        limpiarCache(); // Se limpia todo el contexto tras éxito
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo guardar los rechazos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={localStyles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 15 }}>
          
          <View style={localStyles.searchSection}>
            <TextInput 
              style={localStyles.minimalInput} 
              placeholder="Venta (445495) o Venta-Item (445495-1)" 
              placeholderTextColor="#999"
              value={cacheSearch} 
              onChangeText={setCacheSearch} // Escribe directo en el contexto
            />
            <TouchableOpacity style={localStyles.btnSearch} onPress={buscarNota} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={localStyles.btnText}>BUSCAR</Text>}
            </TouchableOpacity>
          </View>

          {cacheNota && (
            <View>
              <View style={localStyles.infoCard}>
                <View style={localStyles.headerRow}>
                  <Text style={localStyles.infoLabel}>CLIENTE</Text>
                </View>
                <Text style={localStyles.infoValue}>{cacheNota.cabecera.NOM_CLIENTE?.trim()}</Text>
                
                <View style={localStyles.gridInfo}>
                  <View>
                    <Text style={localStyles.infoLabel}>RUT</Text>
                    <Text style={localStyles.gridText}>{cacheNota.cabecera.RUT_CLIENTE}</Text>
                  </View>
                  <View>
                    <Text style={localStyles.infoLabel}>VENDEDOR</Text>
                    <Text style={localStyles.gridText}>{cacheNota.cabecera.ID_VENDEDOR?.trim()}</Text>
                  </View>
                  <View>
                    <Text style={localStyles.infoLabel}>NRO VENTA</Text>
                    <Text style={localStyles.gridText}>#{cacheNota.cabecera.COD_VENTA}</Text>
                  </View>
                  <View>
                    <Text style={localStyles.infoLabel}>FECHA ORDEN</Text>
                    <Text style={localStyles.gridText}>{formatearFecha(cacheNota.cabecera.FECHA_ORDEN)}</Text>
                  </View>
                </View>

                {cacheNota.cabecera.INSTRUCCIONES?.trim() !== "" && (
                  <View style={localStyles.instruccionesBox}>
                    <Text style={localStyles.instruccionesText}>📝 {cacheNota.cabecera.INSTRUCCIONES?.trim()}</Text>
                  </View>
                )}
              </View>

              <Text style={localStyles.sectionTitle}>Items Disponibles</Text>
              
              {cacheNota.items.map((item) => {
                const rechazado = cacheSelecteds.find(s => s.NRO_ITEM === item.NRO_ITEM);
                return (
                  <TouchableOpacity 
                    key={item.NRO_ITEM.toString()} 
                    onPress={() => manejarPresionItem(item)}
                    style={[localStyles.itemCard, rechazado && localStyles.itemCardSelected]}
                  >
                    <View style={localStyles.itemMainRow}>
                      <View style={localStyles.itemIdentificacion}>
                        <Text style={localStyles.itemTitle}>Ítem {cacheNota.cabecera.COD_VENTA}-{item.NRO_ITEM}</Text>
                        <Text style={localStyles.itemMarca}>Plano: {item.MARCA_PIEZA?.trim() || 'SIN MARCA'}</Text>
                      </View>
                      <View style={localStyles.qtyBox}>
                        <Text style={localStyles.qtyLabel}>CANT</Text>
                        <Text style={localStyles.qtyValue}>{item.CANTIDAD}</Text>
                      </View>
                    </View>

                    <View style={localStyles.divider} />

                    <View style={localStyles.itemDetailRow}>
                      <Text style={localStyles.dimText}>{item.DIM1} x {item.DIM2} mm</Text>
                      <Text style={localStyles.skuText}>SKU: {item.COD_ITEM?.trim()}</Text>
                    </View>

                    {rechazado && (
                      <View style={localStyles.rechazoTag}>
                        <Text style={localStyles.rechazoTagText}>RECHAZADO: {rechazado.motivoRechazo}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity 
                style={[localStyles.btnSave, { opacity: cacheSelecteds.length > 0 ? 1 : 0.5 }]} 
                onPress={guardarFinal}
                disabled={cacheSelecteds.length === 0}
              >
                <Text style={localStyles.btnText}>FINALIZAR CON {cacheSelecteds.length} RECHAZOS</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <ModalRechazo 
        visible={isModalVisible}
        item={itemSeleccionado}
        nota={cacheNota}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmarRechazo}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f4f6f8' },
  searchSection: { flexDirection: 'row', marginBottom: 15 },
  minimalInput: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#dcdcdc', color: '#000' },
  btnSearch: { backgroundColor: '#1a73e8', marginLeft: 10, paddingHorizontal: 20, justifyContent: 'center', borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  infoCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 3, marginBottom: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 10, color: '#9aa0a6', fontWeight: 'bold', letterSpacing: 0.5 },
  infoValue: { fontSize: 18, fontWeight: 'bold', color: '#202124', marginBottom: 12 },
  gridInfo: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f3f4', paddingTop: 10 },
  gridText: { fontSize: 13, fontWeight: '600', color: '#3c4043' },
  instruccionesBox: { backgroundColor: '#fff4e5', padding: 10, borderRadius: 8, marginTop: 12 },
  instruccionesText: { fontSize: 12, color: '#663c00', fontStyle: 'italic' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#5f6368', marginBottom: 10, marginLeft: 5 },
  itemCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 10, borderLeftWidth: 6, borderLeftColor: '#1a73e8' },
  itemCardSelected: { borderLeftColor: '#d93025', backgroundColor: '#fef7f6' },
  itemMainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#1a73e8' },
  itemMarca: { fontSize: 13, fontWeight: '800', color: '#202124', marginTop: 2 },
  qtyBox: { alignItems: 'center', backgroundColor: '#f8f9fa', padding: 6, borderRadius: 8, minWidth: 50 },
  qtyLabel: { fontSize: 9, color: '#70757a' },
  qtyValue: { fontSize: 14, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#f1f3f4', marginVertical: 10 },
  itemDetailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dimText: { fontSize: 14, fontWeight: '500', color: '#3c4043' },
  skuText: { fontSize: 12, color: '#70757a' },
  rechazoTag: { marginTop: 10, padding: 8, backgroundColor: '#fce8e6', borderRadius: 6 },
  rechazoTagText: { color: '#d93025', fontSize: 12, fontWeight: 'bold' },
  btnSave: { backgroundColor: '#d93025', padding: 16, borderRadius: 12, alignItems: 'center', marginVertical: 15 }
});